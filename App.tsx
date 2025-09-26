import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptSelector } from './components/PromptSelector';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { SavePromptModal } from './components/SavePromptModal';
import { EditPromptsModal } from './components/EditPromptsModal';
import { GitHubSettings } from './components/GitHubSettings';
import { editImageWithPrompt } from './services/geminiService';
import { githubPromptsService } from './services/githubService';
import { ImageFile, Prompt } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { RefreshIcon } from './components/icons/RefreshIcon';
import { GitHubIcon } from './components/icons/GitHubIcon';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<ImageFile | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showEditPrompts, setShowEditPrompts] = useState(false);
  const [showGitHubSettings, setShowGitHubSettings] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [githubConfig, setGitHubConfig] = useState({
    owner: 'your-username',
    repo: 'your-repo', 
    path: 'prompts.json',
    branch: 'main'
  });

  // Load prompts from GitHub on component mount
  useEffect(() => {
    loadPromptsFromGitHub();
  }, []);

  const loadPromptsFromGitHub = async () => {
    setIsLoadingPrompts(true);
    try {
      const fetchedPrompts = await githubPromptsService.fetchPrompts();
      setPrompts(fetchedPrompts);
    } catch (error) {
      console.error('Lỗi khi tải prompts:', error);
      setError('Không thể tải prompts từ GitHub. Sử dụng prompts mặc định.');
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleImageUpload = useCallback((imageFile: ImageFile | null) => {
    setOriginalImage(imageFile);
    setEditedImage(null);
    setError(null);
  }, []);

  const handlePromptSelect = useCallback((promptItem: Prompt) => {
    const promptText = gender === 'male' ? promptItem.maleText : promptItem.femaleText;
    setSelectedPrompt(promptText);
    setCustomPrompt(promptText);
  }, [gender]);

  const handleEditImage = async () => {
    if (!originalImage) {
      setError('Vui lòng tải lên một hình ảnh trước.');
      return;
    }

    const promptToUse = customPrompt.trim() || selectedPrompt;
    if (!promptToUse) {
      setError('Vui lòng nhập prompt hoặc chọn một prompt có sẵn.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithPrompt(
        originalImage.base64,
        originalImage.mimeType,
        promptToUse
      );

      if (result) {
        setEditedImage(result);
      } else {
        setError('Không thể tạo hình ảnh. Vui lòng thử lại với prompt khác.');
      }
    } catch (error) {
      console.error('Error editing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSavePrompt = (newPrompt: Prompt) => {
    setPrompts(prev => [...prev, newPrompt]);
    setShowSavePrompt(false);
  };

  const handleSaveEditedPrompts = (newPrompts: Prompt[]) => {
    setPrompts(newPrompts);
    setShowEditPrompts(false);
  };

  const handleGitHubConfigSave = (newConfig: typeof githubConfig) => {
    setGitHubConfig(newConfig);
    
    // Update the service with new config
    githubPromptsService.clearCache();
    Object.assign(githubPromptsService, {
      config: {
        ...newConfig,
        branch: newConfig.branch || 'main'
      }
    });
    
    setShowGitHubSettings(false);
    
    // Reload prompts with new config
    loadPromptsFromGitHub();
  };

  const refreshPrompts = () => {
    githubPromptsService.clearCache();
    loadPromptsFromGitHub();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <Header
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onShowEditPrompts={() => setShowEditPrompts(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                📸 Tải lên hình ảnh
              </h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            {/* Gender Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">👤 Chọn giới tính</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    gender === 'male'
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  👨 Nam
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    gender === 'female'
                      ? 'bg-pink-600 text-white ring-2 ring-pink-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  👩 Nữ
                </button>
              </div>
            </div>

            {/* Prompt Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  ✨ Chọn phong cách
                </h2>
                <div className="flex items-center gap-2">
                  {isLoggedIn && (
                    <button
                      onClick={() => setShowGitHubSettings(true)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Cài đặt GitHub"
                    >
                      <GitHubIcon />
                    </button>
                  )}
                  <button
                    onClick={refreshPrompts}
                    disabled={isLoadingPrompts}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Làm mới prompts"
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>
              
              {isLoadingPrompts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Đang tải prompts...</p>
                </div>
              ) : (
                <PromptSelector
                  prompts={prompts}
                  onPromptSelect={handlePromptSelect}
                  selectedPrompt={selectedPrompt}
                  disabled={isLoading}
                  gender={gender}
                />
              )}
            </div>

            {/* Custom Prompt */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">✏️ Prompt tùy chỉnh</h2>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Nhập mô tả cách bạn muốn chỉnh sửa hình ảnh..."
                className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                disabled={isLoading}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleEditImage}
                  disabled={isLoading || !originalImage}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Chỉnh sửa ảnh
                    </>
                  )}
                </button>
                {isLoggedIn && customPrompt.trim() && (
                  <button
                    onClick={() => setShowSavePrompt(true)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Lưu
                  </button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-2xl p-4">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Image Display */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">🖼️ Kết quả</h2>
            <ImageDisplay
              originalImage={originalImage}
              editedImage={editedImage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showSavePrompt && (
        <SavePromptModal
          currentPrompt={customPrompt}
          onSave={handleSavePrompt}
          onClose={() => setShowSavePrompt(false)}
        />
      )}

      {showEditPrompts && (
        <EditPromptsModal
          prompts={prompts}
          onSave={handleSaveEditedPrompts}
          onClose={() => setShowEditPrompts(false)}
        />
      )}

      {showGitHubSettings && (
        <GitHubSettings
          currentConfig={githubConfig}
          onSave={handleGitHubConfigSave}
          onClose={() => setShowGitHubSettings(false)}
        />
      )}
    </div>
  );
};

export default App;