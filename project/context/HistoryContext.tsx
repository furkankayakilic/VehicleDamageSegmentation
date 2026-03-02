import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryItem = {
  id: string;
  originalUri: string;
  resultUri: string;
  timestamp: number;
  confidence?: number;
  detectedAreas?: number;
};

type HistoryContextValue = {
  items: HistoryItem[];
  loading: boolean;
  addHistoryItem: (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
};

const STORAGE_KEY = 'car-damage-history';

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

const serializeItems = (items: HistoryItem[]) => JSON.stringify(items);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored) as HistoryItem[];
          setItems(parsed);
        }
      } catch (error) {
        console.error('[HistoryContext] Failed to load history', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const persistItems = useCallback(async (nextItems: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, serializeItems(nextItems));
    } catch (error) {
      console.error('[HistoryContext] Failed to persist history', error);
    }
  }, []);

  const addHistoryItem = useCallback(
    async (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        ...entry,
      };

      setItems((prev) => {
        const nextItems = [newItem, ...prev];
        void persistItems(nextItems);
        return nextItems;
      });
    },
    [persistItems],
  );

  const clearHistory = useCallback(async () => {
    setItems([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[HistoryContext] Failed to clear history', error);
    }
  }, []);

  const value = useMemo<HistoryContextValue>(
    () => ({
      items,
      loading,
      addHistoryItem,
      clearHistory,
    }),
    [items, loading, addHistoryItem, clearHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

