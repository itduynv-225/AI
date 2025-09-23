
import { ImageFile } from '../types';

export const toBase64 = (file: File): Promise<ImageFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
        return reject(new Error('Could not extract base64 string from file.'));
      }
      resolve({
        base64,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.onerror = (error) => reject(error);
  });
