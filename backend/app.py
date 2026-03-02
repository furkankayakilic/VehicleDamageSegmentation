from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import base64
import numpy as np
import cv2
import os

app = Flask(__name__)
CORS(app)  # React Native erişimi için

# Global değişkenler
model = None

# --- 1. Sınıf İsimleri (Modelin eğitim sırasına göre) ---
# DİKKAT: Senin data.yaml dosrandaki sıralama neyse onu buraya yaz.
CLASS_NAMES = {
    0: 'Göçük (Dent)',
    1: 'Çizik (Scratch)',
    2: 'Çatlak (Crack)',
    3: 'Cam Kırığı (Glass Shatter)',
    4: 'Lamba Kırığı (Lamp Broken)',
    5: 'Lastik Patlağı (Tire Flat)'
}

# --- 2. Hasar Raporlama Fonksiyonu ---
def generate_damage_report(result):
    """
    YOLO sonucunu alır, hasar tipini ve büyüklüğünü (maske alanı) analiz eder.
    Metin tabanlı bir rapor listesi döndürür.
    """
    report_lines = []
    
    if result.boxes is None or len(result.boxes) == 0:
        return ["Araçta görünür bir hasar tespit edilemedi."]

    # Kutular ve Maskeler üzerinde döngü
    boxes = result.boxes
    masks = result.masks
    
    for i, box in enumerate(boxes):
        # Sınıf ID'si ve Güven Skoru
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        damage_name = CLASS_NAMES.get(cls_id, "Bilinmeyen Hasar")
        
        # Hasar Şiddeti (Severity) Hesabı
        severity = "Belirsiz"
        
        # Eğer model segmentasyon (maske) ürettiyse alan hesabı yap
        if masks is not None:
            # Maskedeki '1' olan piksellerin toplamı (Alan)
            mask_area = masks.data[i].sum().item()
            
            # Bu eşik değerlerini 768px'e göre biraz düşürdüm (piksel sayısı azaldığı için)
            if mask_area < 800:
                severity = "Hafif (Yüzeysel)"
            elif mask_area < 4000:
                severity = "Orta Düzey"
            else:
                severity = "Ağır (Ciddi)"
        
        # Rapor satırını oluştur
        line = f"{severity} düzeyde bir {damage_name} tespit edildi (Güven: %{conf*100:.1f})"
        report_lines.append(line)
        
    return report_lines

def load_model():
    global model
    try:
        # 768px ile eğittiğin 'best.pt' dosyasının burada olduğundan emin ol
        model_path = "best.pt" 
        
        if not os.path.exists(model_path):
            print(f"❌ Model dosyası bulunamadı: {model_path}")
            return False

        print(f"📦 Model yükleniyor: {model_path}...")
        model = YOLO(model_path)
        print("✅ Model başarıyla yüklendi ve hazır!")
        return True

    except Exception as e:
        print(f"❌ Model yükleme hatası: {e}")
        return False

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok', 
        'model_loaded': model is not None,
        'model_type': 'YOLOv8-Seg (768px)'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model henüz yüklenmedi.'}), 500
        
        if 'image' not in request.files:
            return jsonify({'error': 'Görüntü verisi bulunamadı.'}), 400
        
        # 1. Görüntüyü Al
        file = request.files['image']
        image_bytes = file.read()
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # 2. YOLO ile Tahmin
        # DİKKAT: Şampiyon modelin olduğu için 768 yapıldı.
        results = model.predict(
            original_image, 
            imgsz=768,       # <-- GÜNCELLENDİ: Senin en iyi modelin bu.
            conf=0.20,       
            iou=0.45,
            retina_masks=True
        )
        
        result = results[0]

        # 3. Görselleştirme (Plot)
        annotated_array = result.plot(labels=True, boxes=True, probs=False)
        annotated_array = cv2.cvtColor(annotated_array, cv2.COLOR_BGR2RGB)
        result_image = Image.fromarray(annotated_array)

        # 4. Base64 Çeviri
        buffered = io.BytesIO()
        result_image.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # 5. Metin Raporu Oluştur
        damage_report_list = generate_damage_report(result)
        summary_text = "\n".join(damage_report_list)

        detection_count = len(result.boxes)

        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'detections': detection_count,
            'report_list': damage_report_list, 
            'report_summary': summary_text,    
            'message': f'{detection_count} hasar tespit edildi.'
        })
        
    except Exception as e:
        print("Hata:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Sunucu Başlatılıyor...")
    if load_model():
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("❌ Model yüklenemediği için sunucu başlatılamadı.")