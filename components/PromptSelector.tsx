import React, { memo } from 'react';
import { Prompt } from '../types';

interface PromptSelectorProps {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
  selectedPrompt: string;
  disabled: boolean;
  gender: 'male' | 'female';
}

export const PromptSelector: React.FC<PromptSelectorProps> = memo(({ prompts, onPromptSelect, selectedPrompt, disabled, gender }) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {prompts.map((promptItem, index) => {
        const isActive = selectedPrompt === promptItem.maleText || selectedPrompt === promptItem.femaleText;
        const isDisabledForGender = (gender === 'male' && !promptItem.maleText.trim()) || (gender === 'female' && !promptItem.femaleText.trim());
        
        return (
            <button
            key={`${promptItem.label}-${index}`}
            onClick={() => onPromptSelect(promptItem)}
            disabled={disabled || isDisabledForGender}
            className={`
                p-2 h-20 text-xs text-center font-medium rounded-md transition-all duration-200
                border flex items-center justify-center
                ${isActive
                ? 'bg-indigo-500 border-indigo-400 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isDisabledForGender ? `Prompt này không có sẵn cho giới tính đã chọn` : promptItem.label}
            >
            {promptItem.label}
            </button>
        );
      })}
    </div>
  );
});