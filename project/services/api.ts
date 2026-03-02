const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export interface AnalyzeResponse {
  success: boolean;
  maskedImageUrl: string;
  confidence?: number;
  detectedAreas?: number;
}

type BackendAnalyzeResponse = {
  success?: boolean;
  image?: string;
  maskedImageUrl?: string;
  resultImage?: string;
  confidence?: number;
  detectedAreas?: number;
  mask_shape?: number[] | [number, number];
  error?: string;
  message?: string;
};

export async function analyzeImage(imageUri: string): Promise<AnalyzeResponse> {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_URL çevre değişkeni tanımlı değil. Lütfen backend adresini yapılandırın.'
    );
  }

  try {
    const formData = new FormData();

    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Sunucu hatası: ${response.status}`
      );
    }

    const data = (await response.json()) as BackendAnalyzeResponse;

    if (data.success === false) {
      throw new Error(data.error || data.message || 'Analiz tamamlanamadı.');
    }

    const imageData: string | undefined =
      data.maskedImageUrl || data.image || data.resultImage;

    if (!imageData) {
      throw new Error('Sunucu beklenen görüntü çıktısını döndürmedi.');
    }

    return {
      success: Boolean(data.success ?? true),
      maskedImageUrl: imageData.startsWith('data:')
        ? imageData
        : `data:image/png;base64,${imageData}`,
      confidence: data.confidence,
      detectedAreas: data.detectedAreas,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Beklenmeyen bir hata oluştu');
  }
}
