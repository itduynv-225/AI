import { Prompt } from '../types';

interface GitHubConfig {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}

export class GitHubPromptsService {
  private config: GitHubConfig;
  private cache: Prompt[] | null = null;
  private lastFetch: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 phút

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main'
    };
  }

  async fetchPrompts(): Promise<Prompt[]> {
    const now = Date.now();
    
    // Sử dụng cache nếu còn hiệu lực
    if (this.cache && (now - this.lastFetch) < this.cacheTimeout) {
      return this.cache;
    }

    try {
      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}?ref=${this.config.branch}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gemini-Image-Editor'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.content) {
        throw new Error('Không tìm thấy nội dung file');
      }

      // Decode base64 content
      const content = atob(data.content.replace(/\s/g, ''));
      const prompts = JSON.parse(content) as Prompt[];

      // Validate prompts structure
      if (!Array.isArray(prompts)) {
        throw new Error('Dữ liệu prompts không đúng định dạng');
      }

      // Validate each prompt
      const validPrompts = prompts.filter(prompt => 
        prompt && 
        typeof prompt.label === 'string' && 
        typeof prompt.maleText === 'string' && 
        typeof prompt.femaleText === 'string'
      );

      this.cache = validPrompts;
      this.lastFetch = now;
      
      return validPrompts;
    } catch (error) {
      console.error('Lỗi khi fetch prompts từ GitHub:', error);
      
      // Trả về cache cũ nếu có lỗi
      if (this.cache) {
        return this.cache;
      }
      
      // Trả về prompts mặc định nếu không có cache
      return this.getDefaultPrompts();
    }
  }

  private getDefaultPrompts(): Prompt[] {
    return [
      {
        label: "Anime Style",
        maleText: "Transform him into an anime character with vibrant colors and expressive features",
        femaleText: "Transform her into an anime character with vibrant colors and expressive features"
      },
      {
        label: "Vintage Photo",
        maleText: "Convert this to a vintage black and white photograph of him",
        femaleText: "Convert this to a vintage black and white photograph of her"
      },
      {
        label: "Oil Painting",
        maleText: "Turn him into a classical oil painting with rich textures",
        femaleText: "Turn her into a classical oil painting with rich textures"
      },
      {
        label: "Cyberpunk",
        maleText: "Transform him into a cyberpunk character with neon lights and futuristic elements",
        femaleText: "Transform her into a cyberpunk character with neon lights and futuristic elements"
      },
      {
        label: "Watercolor",
        maleText: "Convert this to a soft watercolor painting of him",
        femaleText: "Convert this to a soft watercolor painting of her"
      },
      {
        label: "Cartoon",
        maleText: "Turn him into a fun cartoon character",
        femaleText: "Turn her into a fun cartoon character"
      }
    ];
  }

  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

// Singleton instance
export const githubPromptsService = new GitHubPromptsService({
  owner: 'your-username', // Thay đổi thành username GitHub của bạn
  repo: 'your-repo', // Thay đổi thành tên repository
  path: 'prompts.json', // Đường dẫn đến file prompts.json
  branch: 'main'
});