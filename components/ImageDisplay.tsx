
import React, { memo } from 'react';
import { ImageFile } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  originalImage: ImageFile | null;
  editedImage: ImageFile | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
);

const ImageCard: React.FC<{ image: ImageFile | null; title: string; isPlaceholder?: boolean }> = ({ image, title, isPlaceholder = false }) => {
  const imageUrl = image ? `data:${image.mimeType};base64,${image.base64}` : null;
  
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-center text-gray-400">{title}</h3>
      <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
        ) : (
          isPlaceholder && <span className="text-gray-500">Tải lên một hình ảnh để bắt đầu</span>
        )}
      </div>
    </div>
  );
};

export const ImageDisplay: React.FC<ImageDisplayProps> = memo(({ originalImage, editedImage, isLoading }) => {
  
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement('a');
    link.href = `data:${editedImage.mimeType};base64,${editedImage.base64}`;
    link.download = editedImage.name || 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {originalImage && <ImageCard image={originalImage} title="Ảnh Gốc" />}
      
      {isLoading && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-center text-gray-400">Đang Tạo...</h3>
          <SkeletonLoader />
        </div>
      )}
      
      {editedImage && !isLoading && (
        <div className="flex flex-col gap-4">
            <ImageCard image={editedImage} title="Ảnh Đã Chỉnh Sửa" />
            <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
            >
                <DownloadIcon />
                Tải ảnh về
            </button>
        </div>
      )}

      {!originalImage && !isLoading && (
         <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center p-2 border border-gray-700">
            <span className="text-gray-500 text-center">Ảnh được tạo của bạn sẽ xuất hiện ở đây</span>
         </div>
      )}
    </div>
  );
});
