import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Camera, Upload, X, Sparkles, CheckCircle2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage } from '@/services/api';
import { useHistory } from '@/context/HistoryContext';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { addHistoryItem } = useHistory();

  // Animasyonlar
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const imageFadeAnim = useState(new Animated.Value(0))[0];
  const successAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Sayfa yüklendiğinde fade-in animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Resim seçildiğinde fade-in
    if (selectedImage) {
      imageFadeAnim.setValue(0);
      Animated.timing(imageFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedImage]);

  useEffect(() => {
    // Sonuç geldiğinde success animasyonu
    if (resultImage) {
      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      successAnim.setValue(0);
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setSuccess(false));
      }, 2000);
    }
  }, [resultImage]);

  const pickImageFromGallery = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedImage(result.assets[0].uri);
        setResultImage(null);
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Fotoğraf seçilirken bir hata oluştu');
    }
  };

  const takePhoto = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setError(null);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError('Kamera izni gerekli');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedImage(result.assets[0].uri);
        setResultImage(null);
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Fotoğraf çekilirken bir hata oluştu');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeImage(selectedImage);
      setResultImage(result.maskedImageUrl);

      await addHistoryItem({
        originalUri: selectedImage,
        resultUri: result.maskedImageUrl,
        confidence: result.confidence,
        detectedAreas: result.detectedAreas,
      });
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(
        err instanceof Error ? err.message : 'Analiz sırasında bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedImage(null);
    setResultImage(null);
    setError(null);
    setSuccess(false);
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
              <Sparkles size={24} color="#2563eb" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Araç Hasar Tespiti</Text>
          </View>
          <Text style={styles.subtitle}>
            Fotoğraf yükleyin veya çekin, yapay zeka hasarı analiz etsin
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        {/* Success Toast */}
        {success && (
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}>
            <CheckCircle2 size={24} color="#10b981" strokeWidth={2.5} />
            <Text style={styles.successText}>Analiz tamamlandı!</Text>
          </Animated.View>
        )}

        {error && (
          <Animated.View
            style={[
              styles.errorContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <View style={styles.errorIconContainer}>
              <X size={20} color="#dc2626" strokeWidth={2.5} />
            </View>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        {!selectedImage ? (
          <Animated.View
            style={[
              styles.uploadSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIconWrapper}>
                <Camera size={64} color="#2563eb" strokeWidth={1.5} />
              </View>
              <Text style={styles.uploadText}>
                Analiz için bir fotoğraf seçin
              </Text>
              <Text style={styles.uploadSubtext}>
                Kamera ile çekin veya galeriden seçin
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {Platform.OS !== 'web' && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={takePhoto}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#2563eb', '#1d4ed8']}
                    style={styles.primaryButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Camera size={22} color="#ffffff" strokeWidth={2.5} />
                    <Text style={styles.primaryButtonText}>Fotoğraf Çek</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={pickImageFromGallery}
                activeOpacity={0.8}>
                <View style={styles.secondaryButtonInner}>
                  <Upload size={22} color="#2563eb" strokeWidth={2.5} />
                  <Text style={styles.secondaryButtonText}>Galeriden Seç</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.imageSection,
              {
                opacity: imageFadeAnim,
              },
            ]}>
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: imageFadeAnim,
                  transform: [
                    {
                      scale: imageFadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.imageLabelContainer}>
                <View style={styles.labelDot} />
                <Text style={styles.imageLabel}>Orijinal Fotoğraf</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.image} />
              </View>
            </Animated.View>

            {resultImage && (
              <Animated.View
                style={[
                  styles.imageContainer,
                  styles.resultContainer,
                  {
                    opacity: imageFadeAnim,
                    transform: [
                      {
                        scale: imageFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <View style={styles.imageLabelContainer}>
                  <View style={[styles.labelDot, styles.resultDot]} />
                  <Text style={styles.imageLabel}>Hasar Analizi</Text>
                </View>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: resultImage }} style={styles.image} />
                </View>
              </Animated.View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearImage}
                activeOpacity={0.8}>
                <View style={styles.clearButtonInner}>
                  <X size={20} color="#dc2626" strokeWidth={2.5} />
                  <Text style={styles.clearButtonText}>Temizle</Text>
                </View>
              </TouchableOpacity>

              {!resultImage && (
                <TouchableOpacity
                  style={[
                    styles.analyzeButton,
                    loading && styles.analyzeButtonDisabled,
                  ]}
                  onPress={handleAnalyze}
                  disabled={loading}
                  activeOpacity={0.8}>
                  {loading ? (
                    <LinearGradient
                      colors={['#93c5fd', '#60a5fa']}
                      style={styles.analyzeButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text style={styles.analyzeButtonText}>
                        Analiz ediliyor...
                      </Text>
                    </LinearGradient>
                  ) : (
                    <LinearGradient
                      colors={['#2563eb', '#1d4ed8']}
                      style={styles.analyzeButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Sparkles size={20} color="#ffffff" strokeWidth={2.5} />
                      <Text style={styles.analyzeButtonText}>Analiz Et</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
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
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginLeft: 56,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  successText: {
    color: '#065f46',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '600',
  },
  uploadSection: {
    flex: 1,
  },
  uploadPlaceholder: {
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  uploadIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 18,
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 14,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderColor: '#2563eb',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  imageSection: {
    gap: 24,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultContainer: {
    borderWidth: 2,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fafc',
  },
  imageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64748b',
  },
  resultDot: {
    backgroundColor: '#2563eb',
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  imageWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f1f5f9',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 14,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderColor: '#dc2626',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  clearButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  clearButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '700',
  },
  analyzeButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonDisabled: {
    shadowOpacity: 0.15,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
