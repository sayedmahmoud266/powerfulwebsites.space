import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Website } from '../../shared/models/database.types';

@Component({
  selector: 'app-visit',
  template: `
    <main class="container mx-auto px-4 py-8">
      @if (isLoading()) {
      <!-- Loading State -->
      <div class="max-w-md mx-auto text-center" aria-label="Redirecting to website">
        <div class="animate-pulse">
          <!-- Logo placeholder -->
          <div class="w-24 h-24 bg-zinc-700 rounded-lg mx-auto mb-6" aria-hidden="true"></div>

          <!-- Loading message -->
          <h1 class="text-2xl font-bold text-white mb-4">Redirecting...</h1>
          <p class="text-zinc-300 mb-6">We're preparing your visit to {{ websiteName() }}</p>

          <!-- Loading spinner -->
          <div class="flex justify-center">
            <svg
              class="animate-spin h-8 w-8 text-orange-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      } @else if (error()) {
      <!-- Error State -->
      <div class="max-w-md mx-auto text-center py-16" role="status" aria-live="polite">
        <svg
          class="w-16 h-16 text-zinc-400 mx-auto mb-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <h1 class="text-2xl font-bold text-zinc-300 mb-2">Website Not Found</h1>
        <p class="text-zinc-500 mb-6">
          The website "{{ websiteName() }}" doesn't exist in our directory or has been removed.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            (click)="goBack()"
            class="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900 w-full sm:w-auto"
            aria-label="Go back to previous page"
          >
            Go Back
          </button>
          <a
            href="/"
            class="inline-flex items-center px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900 w-full sm:w-auto"
            aria-label="Go to home page"
          >
            Browse Websites
          </a>
        </div>
      </div>
      } @else {
      <!-- Success State - Should not be visible as user gets redirected -->
      <div class="max-w-md mx-auto text-center" aria-label="Redirecting to website">
        <h1 class="text-2xl font-bold text-white mb-4">Redirecting to {{ website()?.name }}...</h1>
        <p class="text-zinc-300 mb-6">
          If you're not automatically redirected,
          <a
            [href]="website()?.url ? addUtmSource(website()!.url) : website()?.url"
            target="_blank"
            rel="noopener"
            class="text-orange-400 hover:text-orange-300 underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
          >
            click here
          </a>
        </p>
      </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);

  protected readonly website = signal<Website | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal(false);

  protected readonly websiteName = computed(() => {
    const name = this.route.snapshot.paramMap.get('website');
    return name ? decodeURIComponent(name.replace(/-/g, ' ')) : '';
  });

  ngOnInit(): void {
    this.loadWebsiteAndRedirect();
  }

  private async loadWebsiteAndRedirect(): Promise<void> {
    try {
      const websiteParam = this.route.snapshot.paramMap.get('website');

      if (!websiteParam) {
        this.error.set(true);
        this.isLoading.set(false);
        return;
      }

      // Fetch website data
      const website = await this.supabaseService.getWebsiteByName(websiteParam);

      if (!website) {
        this.error.set(true);
        this.isLoading.set(false);
        return;
      }

      this.website.set(website);
      this.isLoading.set(false);

      // Small delay to show the loading state and let user see the redirect message
      setTimeout(() => {
        // Add UTM source parameter to help destination sites track referrals
        const urlWithUtm = this.addUtmSource(website.url);

        // Redirect to the actual website URL with UTM tracking
        // Using window.open with appropriate parameters to preserve referrer and trigger analytics
        window.open(urlWithUtm, '_self');
      }, 500);
    } catch (error) {
      console.error('Error loading website for visit:', error);
      this.error.set(true);
      this.isLoading.set(false);
    }
  }

  protected addUtmSource(originalUrl: string): string {
    try {
      const url = new URL(originalUrl);

      // Add UTM source parameter with the current origin
      url.searchParams.set('utm_source', window.origin);

      return url.toString();
    } catch (error) {
      // If URL parsing fails, return the original URL
      console.warn('Failed to parse URL for UTM tracking:', originalUrl, error);
      return originalUrl;
    }
  }

  protected goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
