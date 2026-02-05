
import { AppItem, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'social', name: '社交互动', icon: '💬' },
  { id: 'productivity', name: '办公协作', icon: '💼' },
  { id: 'entertainment', name: '影音娱乐', icon: '🎬' },
  { id: 'tools', name: '实用工具', icon: '🛠️' },
  { id: 'dev', name: '开发编程', icon: '💻' },
];

export const APPS: AppItem[] = [
  {
    id: 'wechat',
    name: '微信 (WeChat)',
    description: '连接你我，提供全方位的移动生活方式。',
    category: 'social',
    icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    rating: 4.8,
    featured: true,
    downloads: [
      { platform: 'iOS', url: 'https://apps.apple.com/cn/app/wechat/id414478124' },
      { platform: 'Android', url: 'https://weixin.qq.com/' },
      { platform: 'Windows', url: 'https://pc.weixin.qq.com/' },
      { platform: 'macOS', url: 'https://mac.weixin.qq.com/' }
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: '一体化的工作空间，集成笔记、任务和知识库。',
    category: 'productivity',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    rating: 4.9,
    featured: true,
    downloads: [
      { platform: 'iOS', url: 'https://apps.apple.com/us/app/notion-notes-docs-tasks/id1232823770' },
      { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=notion.id' },
      { platform: 'Windows', url: 'https://www.notion.so/desktop' },
      { platform: 'macOS', url: 'https://www.notion.so/desktop' }
    ]
  },
  {
    id: 'tiktok',
    name: '抖音 / TikTok',
    description: '记录美好生活，发现精彩视频。',
    category: 'entertainment',
    icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
    rating: 4.7,
    downloads: [
      { platform: 'iOS', url: 'https://apps.apple.com/cn/app/id1142110895' },
      { platform: 'Android', url: 'https://www.douyin.com/' }
    ]
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: '轻量级但功能强大的源代码编辑器，支持几乎所有主流编程语言。',
    category: 'dev',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
    rating: 5.0,
    downloads: [
      { platform: 'Windows', url: 'https://code.visualstudio.com/download' },
      { platform: 'macOS', url: 'https://code.visualstudio.com/download' },
      { platform: 'Linux', url: 'https://code.visualstudio.com/download' }
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    description: '企业级团队沟通工具，让团队合作更高效。',
    category: 'social',
    icon: 'https://cdn-icons-png.flaticon.com/512/3800/3800024.png',
    rating: 4.6,
    downloads: [
      { platform: 'iOS', url: 'https://apps.apple.com/app/slack/id618783545' },
      { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.Slack' },
      { platform: 'Web', url: 'https://slack.com/' }
    ]
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: '全球最大的正版流媒体音乐服务平台。',
    category: 'entertainment',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174872.png',
    rating: 4.8,
    downloads: [
      { platform: 'iOS', url: 'https://apps.apple.com/app/spotify-music/id324684580' },
      { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.spotify.music' },
      { platform: 'Windows', url: 'https://www.spotify.com/download' }
    ]
  },
  {
    id: 'dingtalk',
    name: '钉钉 (DingTalk)',
    description: '智能化的办公协作平台，支持视频会议、审批等。',
    category: 'productivity',
    icon: 'https://img.alicdn.com/tfs/TB1_uT8nAL0gK0jSZFAXXcA7pXa-477-600.png',
    rating: 4.5,
    downloads: [
      { platform: 'Windows', url: 'https://www.dingtalk.com/static/zh-cn/download' },
      { platform: 'macOS', url: 'https://www.dingtalk.com/static/zh-cn/download' },
      { platform: 'iOS', url: 'https://apps.apple.com/cn/app/id930368978' }
    ]
  },
  {
    id: 'figma',
    name: 'Figma',
    description: '基于浏览器的协作式设计工具，UI设计首选。',
    category: 'dev',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    rating: 4.9,
    downloads: [
      { platform: 'Web', url: 'https://www.figma.com/' },
      { platform: 'macOS', url: 'https://www.figma.com/downloads/' },
      { platform: 'Windows', url: 'https://www.figma.com/downloads/' }
    ]
  }
];
