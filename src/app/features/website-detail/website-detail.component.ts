import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { Website } from '../../shared/models/database.types';

@Component({
  selector: 'app-website-detail',
  imports: [RouterLink],
  template: `
    <main class="container mx-auto px-4 py-8">
      @if (isLoading()) {
      <!-- Loading State -->
      <div class="max-w-4xl mx-auto" aria-label="Loading website details">
        <div class="animate-pulse">
          <div class="h-8 bg-dark-700 rounded mb-6 w-32" aria-hidden="true"></div>
          <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div class="w-24 h-24 bg-dark-700 rounded-lg mx-auto sm:mx-0" aria-hidden="true"></div>
            <div class="flex-1 text-center sm:text-left">
              <div class="h-8 bg-dark-700 rounded mb-4" aria-hidden="true"></div>
              <div class="h-6 bg-dark-700 rounded mb-4" aria-hidden="true"></div>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div class="h-8 w-24 bg-dark-700 rounded-full" aria-hidden="true"></div>
                <div class="h-8 w-32 bg-dark-700 rounded-full" aria-hidden="true"></div>
              </div>
            </div>
          </div>
          <div class="h-32 bg-dark-700 rounded mb-6" aria-hidden="true"></div>
          <div class="h-12 bg-dark-700 rounded" aria-hidden="true"></div>
        </div>
      </div>
      } @else if (!website()) {
      <!-- Error State -->
      <div class="text-center py-16" role="status" aria-live="polite">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <h1 class="text-2xl font-bold text-gray-300 mb-2">Website Not Found</h1>
        <p class="text-gray-500 mb-6">
          The website you're looking for doesn't exist or has been removed.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            (click)="goBack()" 
            class="btn-primary w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label="Go back to previous page"
          >
            Go Back
          </button>
          <a 
            routerLink="/search" 
            class="btn-secondary w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label="Browse all websites"
          > 
            Browse All Websites 
          </a>
        </div>
      </div>
      } @else {
      <!-- Website Detail -->
      <div class="max-w-4xl mx-auto">
        <!-- Breadcrumb -->
        <nav aria-label="Breadcrumb" class="flex flex-wrap items-center space-x-2 text-sm text-gray-400 mb-6">
          <a 
            routerLink="/" 
            class="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-1 py-1"
            aria-label="Go to home page"
          >
            Home
          </a>
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <a 
            routerLink="/search" 
            class="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-1 py-1"
            aria-label="Go to search page"
          >
            Search
          </a>
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-gray-600 break-words">{{ website()!.name }}</span>
        </nav>

        <!-- Main Content -->
        <article class="card">
          <!-- Header -->
          <header class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            @if (website()!.logo_url) {
            <img
              [src]="website()!.logo_url"
              [alt]="website()!.name + ' logo'"
              class="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              loading="lazy"
            />
            } @else {
            <div
              class="w-24 h-24 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            }

            <div class="flex-1 min-w-0 text-center sm:text-left">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-100 mb-2 break-words">
                {{ website()!.name }}
              </h1>

              <p class="text-gray-400 mb-4">
                <time [attr.datetime]="website()!.created_at">
                  Added on {{ formatDate(website()!.created_at) }}
                </time>
              </p>

              @if (website()!.tags && website()!.tags!.length > 0) {
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start" role="list" aria-label="Website tags">
                @for (tag of website()!.tags; track tag.id) {
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-400/10 text-primary-400 border border-primary-400/20"
                  role="listitem"
                >
                  {{ tag.name }}
                </span>
                }
              </div>
              }
            </div>
          </header>

          <!-- Description -->
          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">About This Website</h2>
            <p class="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
              {{ website()!.description }}
            </p>
          </section>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <a
              [href]="website()!.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              [attr.aria-label]="'Visit ' + website()!.name + ' website (opens in new tab)'"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                ></path>
                <path
                  d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                ></path>
              </svg>
              Visit Website
            </a>

            <button 
              (click)="goBack()" 
              class="btn-secondary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-label="Go back to previous page"
            >
              Go Back
            </button>

            <a 
              routerLink="/search" 
              class="btn-secondary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-label="Browse more websites"
            > 
              Browse More 
            </a>
          </div>
        </article>

        <!-- Related or Suggested Websites Section -->
        @if (website()!.tags && website()!.tags!.length > 0) {
        <section class="mt-8 lg:mt-12" aria-labelledby="similar-websites-heading">
          <h2 id="similar-websites-heading" class="text-xl sm:text-2xl font-bold text-gray-100 mb-6">Similar Websites</h2>
          <p class="text-gray-400 mb-4">
            Explore more websites with similar technologies and features.
          </p>
          <div class="flex flex-wrap gap-2" role="list" aria-label="Similar website categories">
            @for (tag of website()!.tags; track tag.id) {
            <a
              [routerLink]="['/search']"
              [queryParams]="{ tag: tag.slug }"
              class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-primary-400 border border-dark-600 hover:border-primary-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              role="listitem"
              [attr.aria-label]="'View websites with ' + tag.name + ' technology'"
            >
              {{ tag.name }}
              <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            }
          </div>
        </section>
        }
      </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private supabaseService = inject(SupabaseService);

  website = signal<Website | null>(null);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(+id)) {
      this.router.navigate(['/search']);
      return;
    }

    try {
      const websiteData = await this.supabaseService.getWebsiteById(+id);
      this.website.set(websiteData);
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.location.back();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// Export default for lazy loading
export default WebsiteDetailComponent;
