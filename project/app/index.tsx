import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Car,
  Camera,
  History,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: Camera,
      title: 'Hızlı Analiz',
      description: 'Fotoğraf çekin veya yükleyin, AI anında hasarı tespit etsin',
    },
    {
      icon: Shield,
      title: 'Güvenilir Sonuçlar',
      description: 'Gelişmiş yapay zeka teknolojisi ile yüksek doğruluk',
    },
    {
      icon: History,
      title: 'Geçmiş Takibi',
      description: 'Tüm analizlerinizi kaydedin ve istediğiniz zaman görüntüleyin',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8', '#1e40af']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#ffffff', '#f0f9ff']}
                  style={styles.logoCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Car size={36} color="#2563eb" strokeWidth={2} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Araç Hasar Tespiti</Text>
              <Text style={styles.subtitle}>
                Yapay zeka destekli hasar analizi
              </Text>
            </View>

            {/* Features Section */}
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <IconComponent size={20} color="#2563eb" strokeWidth={2} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription} numberOfLines={2}>
                      {feature.description}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* CTA Section */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  try {
                    router.push('/(tabs)');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    router.replace('/(tabs)');
                  }
                }}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.primaryButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text style={styles.primaryButtonText}>Başlayalım</Text>
                  <ArrowRight size={20} color="#2563eb" strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  try {
                    router.push('/(tabs)/history');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    router.replace('/(tabs)/history');
                  }
                }}
                activeOpacity={0.8}>
                <History size={18} color="#ffffff" strokeWidth={2} />
                <Text style={styles.secondaryButtonText}>Geçmişi Görüntüle</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerRow}>
                <Sparkles size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
                <Text style={styles.footerText}>
                  AI destekli hasar tespit sistemi
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 5,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresContainer: {
    justifyContent: 'flex-start',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  featureDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
  ctaContainer: {
    justifyContent: 'flex-start',
    gap: 10,
    paddingTop: 12,
    paddingBottom: 16,
    width: '100%',
    flexShrink: 0,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 10,
    minHeight: 52,
  },
  primaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
    minHeight: 48,
    zIndex: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});

