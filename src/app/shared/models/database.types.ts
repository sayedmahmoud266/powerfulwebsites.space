export interface Source {
  type: 'social_media' | 'manual' | 'suggestion' | 'scraper';
  description: string;
  url?: string; // Required for all types except 'manual'
  platform?: string; // For social media sources
  scraper_id?: string; // For scraper sources
  added_at: string; // ISO timestamp
}

export interface Author {
  display_name: string;
  url: string;
  role?: string;
}

export interface Website {
  id: number;
  name: string;
  url: string;
  description: string;
  logo_url?: string;
  created_at: string;
  sources?: Source[];
  author?: Author;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface WebsiteTag {
  website_id: number;
  tag_id: number;
}
