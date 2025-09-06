import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Website } from '../../shared/models/database.types';
import { WebsiteCardComponent } from '../../shared/components/website-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, WebsiteCardComponent],
  template: `
    <main class="mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center py-12 lg:py-16" aria-labelledby="hero-heading">
        <h1 id="hero-heading" class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 mb-6">
          Discover <span class="text-orange-400">Powerful</span> Websites
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          A curated collection of the most innovative and powerful websites built with modern web
          technologies. Explore, learn, and get inspired by cutting-edge web development.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            routerLink="/search"
            class="btn-primary inline-block w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Explore all websites in our collection"
          >
            Explore All Websites
          </a>
          <a
            href="https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md&title=Add%20Website%3A%20[Website%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary inline-block w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Submit a website to our collection (opens in new tab)"
          >
            Submit a Website
          </a>
        </div>
      </section>

      <!-- Latest Websites Section -->
      <section class="py-12 lg:py-16" aria-labelledby="latest-heading">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0"
        >
          <h2 id="latest-heading" class="text-2xl sm:text-3xl font-bold text-gray-100">
            Latest Additions
          </h2>
          <a
            routerLink="/search"
            class="text-orange-400 hover:text-orange-500 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            aria-label="View all websites"
          >
            View All →
          </a>
        </div>

        @if (isLoading()) {
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          aria-label="Loading websites"
        >
          @for (item of [1,2,3,4,5,6]; track item) {
          <div class="card animate-pulse" aria-hidden="true">
            <div class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div class="w-16 h-16 sm:w-12 sm:h-12 bg-gray-700 rounded-lg mx-auto sm:mx-0"></div>
              <div class="flex-1 text-center sm:text-left">
                <div class="h-5 bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-700 rounded mb-3"></div>
                <div class="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                  <div class="h-6 w-16 bg-gray-700 rounded-full"></div>
                  <div class="h-6 w-20 bg-gray-700 rounded-full"></div>
                </div>
                <div class="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          }
        </div>
        } @else if (websites().length === 0) {
        <div class="text-center py-16" role="status" aria-live="polite">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No websites found</h3>
          <p class="text-gray-500 mb-4">Be the first to add a website to our collection!</p>
          <a
            href="https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md&title=Add%20Website%3A%20[Website%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Add the first website to our collection"
          >
            Add First Website
          </a>
        </div>
        } @else {
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          role="list"
          aria-label="Latest websites"
        >
          @for (website of websites(); track website.id) {
          <app-website-card [website]="website" />
          }
        </div>
        }
      </section>

      <!-- Features Section -->
      <section class="py-12 lg:py-16 border-t border-orange-700" aria-labelledby="features-heading">
        <h2
          id="features-heading"
          class="text-2xl sm:text-3xl font-bold text-gray-100 text-center mb-12"
        >
          Why Use Our Platform?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-orange-400/10 rounded-lg flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg class="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Curated Collection</h3>
            <p class="text-gray-400">
              Hand-picked websites that showcase the best of modern web development and design.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-orange-400/10 rounded-lg flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg class="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Easy Discovery</h3>
            <p class="text-gray-400">
              Search and filter websites by technology, category, or features to find exactly what
              you need.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-orange-400/10 rounded-lg flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg class="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Open Source</h3>
            <p class="text-gray-400">
              Built in the open with modern technologies. Contribute, learn, and help others
              discover great websites.
            </p>
          </div>
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  websites = signal<Website[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      const latestWebsites = await this.supabaseService.getWebsites(6);
      this.websites.set(latestWebsites);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}

// Export default for lazy loading
export default HomeComponent;
