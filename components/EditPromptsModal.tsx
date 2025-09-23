import React, { useState } from 'react';
import { Prompt } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface EditPromptsModalProps {
  prompts: Prompt[];
  onSave: (newPrompts: Prompt[]) => void;
  onClose: () => void;
}

export const EditPromptsModal: React.FC<EditPromptsModalProps> = ({ prompts, onSave, onClose }) => {
  const [editedPrompts, setEditedPrompts] = useState<Prompt[]>([...prompts.map(p => ({...p}))]);

  const handlePromptChange = (index: number, field: keyof Prompt, value: string) => {
    const newPrompts = [...editedPrompts];
    newPrompts[index] = { ...newPrompts[index], [field]: value };
    setEditedPrompts(newPrompts);
  };

  const handleSave = () => {
    onSave(editedPrompts);
  };

  const handleAddPrompt = () => {
    setEditedPrompts([...editedPrompts, { label: '', maleText: '', femaleText: '' }]);
  };

  const handleRemovePrompt = (indexToRemove: number) => {
    setEditedPrompts(editedPrompts.filter((_, index) => index !== indexToRemove));
  };

  const handleMovePrompt = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === editedPrompts.length - 1) return;

    const newPrompts = [...editedPrompts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [newPrompts[index], newPrompts[targetIndex]] = [newPrompts[targetIndex], newPrompts[index]];
    
    setEditedPrompts(newPrompts);
  };


  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-4xl m-4 h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-400">Chỉnh sửa Prompts</h2>
            <button
                onClick={handleAddPrompt}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
                Thêm Prompt Mới
            </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-4 -mr-4">
            {editedPrompts.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                    Không có prompt nào. Nhấn "Thêm Prompt Mới" để bắt đầu.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editedPrompts.map((prompt, index) => (
                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-3 relative">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-400">Prompt số {index + 1}</h3>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleMovePrompt(index, 'up')}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Di chuyển lên"
                            >
                                <ChevronUpIcon />
                            </button>
                            <button
                                onClick={() => handleMovePrompt(index, 'down')}
                                disabled={index === editedPrompts.length - 1}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Di chuyển xuống"
                            >
                                <ChevronDownIcon />
                            </button>
                            <button
                              onClick={() => handleRemovePrompt(index)}
                              className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20"
                              title="Xóa Prompt"
                            >
                              <TrashIcon />
                            </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`label-${index}`} className="block text-xs font-medium text-indigo-300 mb-1">
                          Nhãn Prompt
                        </label>
                        <input
                            id={`label-${index}`}
                            type="text"
                            value={prompt.label}
                            onChange={(e) => handlePromptChange(index, 'label', e.target.value)}
                            placeholder="Vd: Hiệu ứng Neon"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor={`maleText-${index}`} className="block text-xs font-medium text-blue-300 mb-1">
                          Cấu trúc Prompt (Nam)
                        </label>
                        <textarea
                            id={`maleText-${index}`}
                            value={prompt.maleText}
                            onChange={(e) => handlePromptChange(index, 'maleText', e.target.value)}
                            placeholder="Vd: Biến anh ấy thành..."
                            className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        />
                      </div>
                      <div>
                        <label htmlFor={`femaleText-${index}`} className="block text-xs font-medium text-pink-300 mb-1">
                          Cấu trúc Prompt (Nữ)
                        </label>
                        <textarea
                            id={`femaleText-${index}`}
                            value={prompt.femaleText}
                            onChange={(e) => handlePromptChange(index, 'femaleText', e.target.value)}
                            placeholder="Vd: Biến cô ấy thành..."
                            className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
                        />
                      </div>
                    </div>
                ))}
                </div>
            )}
        </div>
        <div className="flex items-center justify-end gap-4 pt-6 mt-auto border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};