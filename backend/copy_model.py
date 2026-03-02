"""
Model dosyasını backend klasörüne kopyalar
"""
import shutil
import os
from pathlib import Path

# Root dizin (bir üst klasör)
root_dir = Path(__file__).parent.parent
model_file = root_dir / "best_deeplabv3_mnv3_final.pth"
target_file = Path(__file__).parent / "best_deeplabv3_mnv3_final.pth"

if model_file.exists():
    shutil.copy2(model_file, target_file)
    print(f"✅ Model dosyası başarıyla kopyalandı: {target_file}")
else:
    print(f"❌ Model dosyası bulunamadı: {model_file}")
    print("Lütfen model dosyasının root dizinde olduğundan emin olun.")

