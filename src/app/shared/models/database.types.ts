export interface Website {
  id: number;
  name: string;
  url: string;
  description: string;
  logo_url?: string;
  created_at: string;
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
