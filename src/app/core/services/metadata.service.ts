import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { LinkMetadata } from '../../shared/models/database.types';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private http = inject(HttpClient);
  private cache = new Map<string, LinkMetadata>();

  // Using a CORS proxy service to fetch metadata
  // In production, you might want to use your own backend endpoint
  private readonly CORS_PROXY = 'https://api.allorigins.win/get?url=';

  fetchLinkMetadata(url: string): Observable<LinkMetadata> {
    // Check cache first
    if (this.cache.has(url)) {
      return of(this.cache.get(url)!);
    }

    // Don't fetch metadata for certain file types or if URL is missing
    if (!url || this.isFileUrl(url)) {
      const fallback: LinkMetadata = { success: false, url };
      this.cache.set(url, fallback);
      return of(fallback);
    }

    return this.http
      .get<{ contents: string }>(this.CORS_PROXY + encodeURIComponent(url), {
        headers: { Accept: 'application/json' },
      })
      .pipe(
        map((response) => {
          const metadata = this.parseHtmlMetadata(response.contents, url);
          this.cache.set(url, metadata);
          return metadata;
        }),
        catchError((error) => {
          console.warn('Failed to fetch metadata for:', url, error);
          const fallback: LinkMetadata = { success: false, url };
          this.cache.set(url, fallback);
          return of(fallback);
        })
      );
  }

  private isFileUrl(url: string): boolean {
    const fileExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.mp4',
      '.zip',
      '.doc',
      '.docx',
    ];
    return fileExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  private parseHtmlMetadata(html: string, originalUrl: string): LinkMetadata {
    try {
      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract Open Graph and meta tags
      const getMetaContent = (property: string): string | undefined => {
        // Try Open Graph first
        let element = doc.querySelector(`meta[property="${property}"]`);
        if (element) return element.getAttribute('content') || undefined;

        // Try Twitter cards
        element = doc.querySelector(`meta[name="twitter:${property.replace('og:', '')}"]`);
        if (element) return element.getAttribute('content') || undefined;

        // Try standard meta tags
        if (property === 'og:title') {
          element = doc.querySelector('meta[name="title"]') || doc.querySelector('title');
          return element
            ? element.getAttribute('content') || element.textContent || undefined
            : undefined;
        }

        if (property === 'og:description') {
          element = doc.querySelector('meta[name="description"]');
          return element ? element.getAttribute('content') || undefined : undefined;
        }

        return undefined;
      };

      const title = getMetaContent('og:title')?.trim();
      const description = getMetaContent('og:description')?.trim();
      const image = getMetaContent('og:image');
      const siteName = getMetaContent('og:site_name')?.trim();

      // Ensure image URL is absolute
      let resolvedImage = image;
      if (image && !image.startsWith('http')) {
        try {
          const baseUrl = new URL(originalUrl);
          resolvedImage = new URL(image, baseUrl.origin).href;
        } catch (e) {
          resolvedImage = image;
        }
      }

      return {
        title,
        description,
        image: resolvedImage,
        site_name: siteName,
        url: originalUrl,
        success: !!(title || description || image),
      };
    } catch (error) {
      console.warn('Failed to parse HTML metadata:', error);
      return {
        success: false,
        url: originalUrl,
      };
    }
  }

  // Clear cache method for testing or memory management
  clearCache(): void {
    this.cache.clear();
  }

  // Get cached metadata without making a request
  getCachedMetadata(url: string): LinkMetadata | null {
    return this.cache.get(url) || null;
  }
}
