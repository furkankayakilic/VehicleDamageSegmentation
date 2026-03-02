# Proje Teknolojik Altyapısı

## Genel Bakış

Bu proje, mobil uygulama ve backend servis olmak üzere iki ana bileşenden oluşmaktadır. Mobil uygulama cross-platform geliştirme yaklaşımı ile, backend ise Python tabanlı bir web servisi olarak geliştirilmiştir.

## Mobil Uygulama (Frontend)

### Temel Teknolojiler

**React Native**
Mobil uygulama, React Native framework'ü kullanılarak geliştirilmiştir. React Native, JavaScript ve React kütüphanesini kullanarak iOS ve Android platformları için native mobil uygulamalar geliştirmeyi mümkün kılan açık kaynaklı bir framework'tür.

**Expo**
Expo, React Native tabanlı bir geliştirme platformudur. Native modüllerin kolay entegrasyonunu sağlayan ve cross-platform uyumluluğu garanti eden bir dizi araç ve servis sunmaktadır.

**TypeScript**
Uygulama, statik tip kontrolü sağlayan TypeScript programlama dili ile geliştirilmiştir. TypeScript, JavaScript'in üzerine tip sistemi ekleyerek kod kalitesini artırmaktadır.

### Navigasyon ve Routing

**Expo Router**
File-based routing sistemi sunan modern bir navigasyon çözümüdür. Stack ve Tab navigasyon yapıları bu framework üzerinden yönetilmektedir.

### State Management

**React Context API**
Global state yönetimi için React'in Context API'si kullanılmıştır. Uygulama genelinde veri paylaşımı bu yöntemle sağlanmaktadır.

**AsyncStorage**
Kalıcı veri depolama için React Native'in AsyncStorage API'si kullanılmaktadır. Kullanıcı verilerinin cihazda saklanması bu teknoloji ile gerçekleştirilmektedir.

### UI/UX Bileşenleri

**Lucide React Native**
Modern ve tutarlı ikon seti için SVG tabanlı vektör ikon kütüphanesi kullanılmıştır.

**Expo Linear Gradient**
Görsel tasarımda gradient efektleri için kullanılmaktadır.

### Animasyon ve Etkileşim

**React Native Reanimated**
Yüksek performanslı animasyonlar için kullanılmaktadır. Animasyonlar native thread'de çalışarak 60 FPS performans sağlamaktadır.

**Expo Haptics**
Kullanıcı etkileşimlerine dokunsal geri bildirim (haptic feedback) eklemek için kullanılmaktadır.

### Medya İşlemleri

**Expo Image Picker**
Galeriden görüntü seçme ve kamera ile fotoğraf çekme işlevselliği için kullanılmaktadır.

**Expo Camera**
Kamera erişimi ve görüntü yakalama işlemleri için kullanılmaktadır.

### Ağ İletişimi

**Fetch API**
Backend servisleri ile iletişim için JavaScript'in native Fetch API'si kullanılmıştır. RESTful API çağrıları FormData kullanılarak multipart/form-data formatında gerçekleştirilmektedir.

## Backend Servisi

### Temel Teknolojiler

**Python**
Backend servisi, Python programlama dili kullanılarak geliştirilmiştir. Python, makine öğrenmesi ve görüntü işleme uygulamaları için yaygın olarak kullanılan bir dildir.

**Flask**
Flask, Python tabanlı hafif ve esnek bir web framework'üdür. RESTful API endpoint'leri oluşturmak için kullanılmaktadır.

### Makine Öğrenmesi ve Görüntü İşleme

**YOLO (You Only Look Once)**
Nesne tespiti ve segmentasyon işlemleri için YOLO modeli kullanılmaktadır. Ultralytics kütüphanesi üzerinden YOLOv8 modeli entegre edilmiştir.

**OpenCV**
Görüntü işleme ve manipülasyon işlemleri için OpenCV (Computer Vision) kütüphanesi kullanılmaktadır.

**PIL (Pillow)**
Görüntü formatı dönüşümleri ve işlemleri için Python Imaging Library kullanılmaktadır.

### Veri İşleme

**NumPy**
Sayısal hesaplamalar ve array işlemleri için NumPy kütüphanesi kullanılmaktadır.

**Base64 Encoding**
Görüntü verilerinin JSON formatında aktarılması için Base64 encoding/decoding işlemleri gerçekleştirilmektedir.

### API ve İletişim

**Flask-CORS**
Cross-Origin Resource Sharing (CORS) desteği için Flask-CORS kütüphanesi kullanılmaktadır. Bu sayede mobil uygulama ile backend arasında güvenli veri iletişimi sağlanmaktadır.

**RESTful API**
Backend, RESTful API prensiplerine uygun olarak tasarlanmıştır. HTTP POST metodu ile görüntü verileri alınmakta ve işlenmektedir.

## Mimari Yapı

### Client-Server Mimarisi
Proje, klasik client-server mimarisi üzerine kurulmuştur. Mobil uygulama (client) HTTP protokolü üzerinden backend servisine (server) istek göndermekte ve yanıt almaktadır.

### Cross-Platform Geliştirme
Mobil uygulama, tek bir kod tabanından iOS, Android ve Web platformlarını desteklemektedir. Bu yaklaşım, geliştirme süresini kısaltmakta ve bakım maliyetlerini düşürmektedir.

## Sonuç

Bu proje, modern cross-platform mobil geliştirme teknolojileri (React Native, Expo) ve Python tabanlı backend servislerinin kombinasyonu ile geliştirilmiştir. Mobil uygulama tarafında TypeScript ile tip güvenliği, React Native Reanimated ile yüksek performanslı animasyonlar sağlanırken, backend tarafında Python ve Flask ile RESTful API servisi, YOLO modeli ile makine öğrenmesi tabanlı görüntü analizi gerçekleştirilmektedir.

