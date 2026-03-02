## Backend URL Yapılandırması

Mobil uygulamanın Flask tabanlı araç hasar tespiti backend'ine bağlanabilmesi için Expo ortam değişkenini tanımlayın:

1. `project` klasöründe bir `.env` dosyası oluşturun (yoksa).
2. Aşağıdaki anahtarı backend adresinizle doldurun:

```
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

> Not: Fiziksel cihaz kullanıyorsanız bilgisayarınızın yerel IP adresini ve backend portunu girin. Android emülatörde `http://10.0.2.2:5000`, iOS simülatörde `http://127.0.0.1:5000` kullanılabilir.

3. Değişiklikten sonra Expo geliştirme sunucusunu yeniden başlatın:

```
npm run dev
```

