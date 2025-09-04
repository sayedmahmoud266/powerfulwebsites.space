import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Website, Tag } from '../../shared/models/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  // Website methods
  async getWebsites(limit?: number): Promise<Website[]> {
    try {
      let query = this.supabase
        .from('websites')
        .select(
          `
          *,
          websites_tags(
            tags(*)
          )
        `
        )
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to include tags properly
      return (
        data?.map((website) => ({
          ...website,
          tags: website.websites_tags?.map((wt: any) => wt.tags) || [],
        })) || []
      );
    } catch (error) {
      console.error('Error fetching websites:', error);
      return [];
    }
  }

  async getWebsiteById(id: number): Promise<Website | null> {
    try {
      const { data, error } = await this.supabase
        .from('websites')
        .select(
          `
          *,
          websites_tags(
            tags(*)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          tags: data.websites_tags?.map((wt: any) => wt.tags) || [],
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching website:', error);
      return null;
    }
  }

  async getWebsiteByName(name: string): Promise<Website | null> {
    try {
      // Decode the URL-encoded name back to the original name
      const decodedName = decodeURIComponent(name.replace(/-/g, ' '));

      const { data, error } = await this.supabase
        .from('websites')
        .select(
          `
          *,
          websites_tags(
            tags(*)
          )
        `
        )
        .ilike('name', decodedName)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          tags: data.websites_tags?.map((wt: any) => wt.tags) || [],
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching website by name:', error);
      return null;
    }
  }

  async searchWebsites(searchTerm: string): Promise<Website[]> {
    try {
      const { data, error } = await this.supabase
        .from('websites')
        .select(
          `
          *,
          websites_tags(
            tags(*)
          )
        `
        )
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((website) => ({
          ...website,
          tags: website.websites_tags?.map((wt: any) => wt.tags) || [],
        })) || []
      );
    } catch (error) {
      console.error('Error searching websites:', error);
      return [];
    }
  }

  async getWebsitesByTag(tagSlug: string): Promise<Website[]> {
    try {
      const { data, error } = await this.supabase
        .from('websites')
        .select(
          `
          *,
          websites_tags!inner(
            tags!inner(*)
          )
        `
        )
        .eq('websites_tags.tags.slug', tagSlug)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((website) => ({
          ...website,
          tags: website.websites_tags?.map((wt: any) => wt.tags) || [],
        })) || []
      );
    } catch (error) {
      console.error('Error fetching websites by tag:', error);
      return [];
    }
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await this.supabase.from('tags').select('*').order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }
}
