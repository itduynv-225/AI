
import React, { useState, useCallback, useRef, memo } from 'react';
import { toBase64 } from '../utils/fileUtils';
import { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (imageFile: ImageFile | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = memo(({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng tải lên một tệp hình ảnh.');
        return;
      }
      try {
        const imageFile = await toBase64(file);
        setPreview(`data:${imageFile.mimeType};base64,${imageFile.base64}`);
        setFileName(imageFile.name);
        onImageUpload(imageFile);
      } catch (error) {
        console.error("Error converting file to base64", error);
        alert("Đã có lỗi xảy ra khi xử lý hình ảnh của bạn.");
        onImageUpload(null);
        setPreview(null);
        setFileName(null);
      }
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      // Simulate a change event on the file input
      const file = event.dataTransfer.files[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div
        className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition-all duration-300"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full p-2">
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
            <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{fileName}</p>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon />
            <p className="mt-2">Nhấp để tải lên hoặc kéo & thả</p>
            <p className="text-xs text-gray-500">Hỗ trợ PNG, JPG, GIF tối đa 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
});
