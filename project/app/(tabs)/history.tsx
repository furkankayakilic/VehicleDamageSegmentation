import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileQuestion, Trash2, Calendar, TrendingUp, MapPin, X, ZoomIn } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useHistory } from '@/context/HistoryContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HistoryScreen() {
  const { items, loading, clearHistory } = useHistory();
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    label: string;
  } | null>(null);

  const formattedHistory = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        dateLabel: new Date(item.timestamp).toLocaleString(),
      })),
    [items],
  );

  const openImageModal = (uri: string, label: string) => {
    setSelectedImage({ uri, label });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Calendar size={24} color="#2563eb" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Analiz Geçmişi</Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearHistory}
              activeOpacity={0.8}>
              <View style={styles.clearButtonInner}>
                <Trash2 size={16} color="#dc2626" strokeWidth={2.5} />
                <Text style={styles.clearButtonText}>Temizle</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconWrapper}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
          <Text style={styles.loadingText}>Geçmiş yükleniyor...</Text>
        </View>
      ) : formattedHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrapper}>
            <FileQuestion size={72} color="#2563eb" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Henüz analiz geçmişi yok</Text>
          <Text style={styles.emptySubtitle}>
            Yaptığınız analizler burada görünecek
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {formattedHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.dateIconContainer}>
                    <Calendar size={16} color="#64748b" strokeWidth={2} />
                  </View>
                  <Text style={styles.cardTitle}>{item.dateLabel}</Text>
                </View>
                {typeof item.confidence === 'number' && (
                  <LinearGradient
                    colors={['#dbeafe', '#bfdbfe']}
                    style={styles.badge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <TrendingUp size={14} color="#1d4ed8" strokeWidth={2.5} />
                    <Text style={styles.badgeText}>
                      {(item.confidence * 100).toFixed(1)}%
                    </Text>
                  </LinearGradient>
                )}
              </View>

              <View style={styles.imagesRow}>
                <View style={styles.imageWrapper}>
                  <View style={styles.imageLabelContainer}>
                    <View style={styles.imageLabelDot} />
                    <Text style={styles.imageLabel}>Orijinal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => openImageModal(item.originalUri, 'Orijinal Fotoğraf')}
                    activeOpacity={0.8}>
                    <Image source={{ uri: item.originalUri }} style={styles.image} />
                    <View style={styles.zoomBadge}>
                      <ZoomIn size={18} color="#2563eb" strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.imageWrapper}>
                  <View style={styles.imageLabelContainer}>
                    <View style={[styles.imageLabelDot, styles.resultLabelDot]} />
                    <Text style={styles.imageLabel}>Sonuç</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.imageContainer, styles.resultImageContainer]}
                    onPress={() => openImageModal(item.resultUri, 'Hasar Analizi')}
                    activeOpacity={0.8}>
                    <Image source={{ uri: item.resultUri }} style={styles.image} />
                    <View style={styles.zoomBadge}>
                      <ZoomIn size={18} color="#2563eb" strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {typeof item.detectedAreas === 'number' && (
                <View style={styles.metadataContainer}>
                  <View style={styles.metadataIconContainer}>
                    <MapPin size={16} color="#2563eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.metadataText}>
                    {item.detectedAreas} alan tespit edildi
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeImageModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedImage?.label || 'Görüntü'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}
                activeOpacity={0.8}>
                <X size={24} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  clearButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc2626',
    backgroundColor: '#ffffff',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dateIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: 0.1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 14,
  },
  imageWrapper: {
    flex: 1,
    gap: 10,
  },
  imageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94a3b8',
  },
  resultLabelDot: {
    backgroundColor: '#2563eb',
  },
  imageLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  imageContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  resultImageContainer: {
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f1f5f9',
  },
  zoomBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 200,
    borderRadius: 12,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  metadataIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metadataText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});
