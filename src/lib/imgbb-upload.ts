/**
 * ImgBB Image Upload Service
 * Free image hosting with no CORS issues
 * Get API key from: https://api.imgbb.com/
 */

export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('ImgBB API key not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local');
  }

  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', apiKey);

    // Upload to ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('[ImgBB] Upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

/**
 * Alternative: Compress image before uploading
 */
export async function uploadCompressedToImgBB(file: File, maxWidth: number = 800): Promise<string> {
  // Compress image
  const compressed = await compressImage(file, maxWidth);
  
  // Upload compressed blob
  const compressedFile = new File([compressed], file.name, { type: file.type });
  return uploadToImgBB(compressedFile);
}

// Helper function to compress images
async function compressImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          file.type,
          0.85
        );
      };
    };
  });
}
