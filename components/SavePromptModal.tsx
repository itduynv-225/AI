import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';

interface SavePromptModalProps {
  currentPrompt: string;
  onSave: (newPrompt: Prompt) => void;
  onClose: () => void;
}

export const SavePromptModal: React.FC<SavePromptModalProps> = ({ currentPrompt, onSave, onClose }) => {
  const [label, setLabel] = useState('');
  const [maleText, setMaleText] = useState(currentPrompt);
  const [femaleText, setFemaleText] = useState(currentPrompt);
  const [error, setError] = useState('');

  useEffect(() => {
    setMaleText(currentPrompt);
    setFemaleText(currentPrompt);
  }, [currentPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Vui lòng cung cấp nhãn cho prompt.');
      return;
    }
    if (!maleText.trim() && !femaleText.trim()) {
        setError('Phải cung cấp ít nhất một text prompt (nam hoặc nữ).');
        return;
    }
    onSave({ label, maleText, femaleText });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">Lưu Prompt Tùy chỉnh</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="promptLabel"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Nhãn Prompt
            </label>
            <input
              id="promptLabel"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Vd: 'Phong cách hoạt hình', 'Kiểu cổ điển'"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="maleText"
              className="block text-sm font-medium text-blue-300 mb-2"
            >
              Cấu trúc Prompt (Nam)
            </label>
            <textarea
              id="maleText"
              value={maleText}
              onChange={(e) => setMaleText(e.target.value)}
              className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="femaleText"
              className="block text-sm font-medium text-pink-300 mb-2"
            >
              Cấu trúc Prompt (Nữ)
            </label>
            <textarea
              id="femaleText"
              value={femaleText}
              onChange={(e) => setFemaleText(e.target.value)}
              className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Lưu Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};