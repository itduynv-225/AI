import React, { useState } from 'react';

interface GitHubSettingsProps {
  currentConfig: {
    owner: string;
    repo: string;
    path: string;
    branch: string;
  };
  onSave: (config: { owner: string; repo: string; path: string; branch: string }) => void;
  onClose: () => void;
}

export const GitHubSettings: React.FC<GitHubSettingsProps> = ({ currentConfig, onSave, onClose }) => {
  const [config, setConfig] = useState(currentConfig);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.owner.trim() || !config.repo.trim() || !config.path.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    onSave(config);
  };

  const handleInputChange = (field: keyof typeof config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">Cài đặt GitHub</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Username/Organization *
            </label>
            <input
              id="owner"
              type="text"
              value={config.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              placeholder="vd: octocat"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="repo" className="block text-sm font-medium text-gray-300 mb-2">
              Repository Name *
            </label>
            <input
              id="repo"
              type="text"
              value={config.repo}
              onChange={(e) => handleInputChange('repo', e.target.value)}
              placeholder="vd: my-prompts"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="path" className="block text-sm font-medium text-gray-300 mb-2">
              Đường dẫn file JSON *
            </label>
            <input
              id="path"
              type="text"
              value={config.path}
              onChange={(e) => handleInputChange('path', e.target.value)}
              placeholder="vd: prompts.json hoặc data/prompts.json"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
              Branch
            </label>
            <input
              id="branch"
              type="text"
              value={config.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
              placeholder="main"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-indigo-300 mb-2">Định dạng file JSON:</h3>
            <pre className="text-xs text-gray-400 overflow-x-auto">
{`[
  {
    "label": "Anime Style",
    "maleText": "Transform him into...",
    "femaleText": "Transform her into..."
  }
]`}
            </pre>
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
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};