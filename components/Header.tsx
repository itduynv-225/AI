
import React, { memo } from 'react';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onLogout: () => void;
  onShowEditPrompts: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({ isLoggedIn, onShowLogin, onLogout, onShowEditPrompts }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-center flex-grow">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Trình Chỉnh Sửa Ảnh Gemini AI
          </h1>
          <p className="mt-2 text-md text-gray-400">
            Biến đổi hình ảnh của bạn với sức mạnh của AI tạo hình. Chỉ cần tải lên, mô tả và sáng tạo.
          </p>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button
                onClick={onShowEditPrompts}
                className="bg-gray-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
              >
                Sửa Prompts
              </button>
              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <button
              onClick={onShowLogin}
              title="Cài đặt Quản trị"
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <SettingsIcon />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});
