
export type Platform = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Web' | 'Linux';

export interface AppDownload {
  platform: Platform;
  url: string;
}

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  downloads: AppDownload[];
  rating: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
