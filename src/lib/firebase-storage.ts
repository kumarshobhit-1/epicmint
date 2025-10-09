import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

/**
 * Compress and resize an image file
 */
async function compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Upload profile picture to Firebase Storage
 * @param userId - The user's UID
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  try {
    // Compress the image
    const compressedBlob = await compressImage(file, 500, 500, 0.85);

    // Create storage reference
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture. Please try again.');
  }
}

/**
 * Delete profile picture from Firebase Storage
 * @param userId - The user's UID
 */
export async function deleteProfilePicture(userId: string): Promise<void> {
  try {
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw new Error('Failed to delete profile picture');
  }
}

/**
 * Upload NFT image to Firebase Storage
 * @param userId - The user's UID
 * @param nftHash - The NFT hash
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export async function uploadNftImage(userId: string, nftHash: string, file: File): Promise<string> {
  try {
    // Compress the image
    const compressedBlob = await compressImage(file, 1200, 1200, 0.9);

    // Create storage reference
    const storageRef = ref(storage, `nfts/${userId}/${nftHash}.jpg`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        nftHash,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading NFT image:', error);
    throw new Error('Failed to upload NFT image. Please try again.');
  }
}
