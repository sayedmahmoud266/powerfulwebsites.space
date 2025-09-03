import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { Website, Tag } from '../../shared/models/database.types';
import { WebsiteCardComponent } from '../../shared/components/website-card.component';

@Component({
  selector: 'app-search',
  imports: [FormsModule, WebsiteCardComponent],
  template: `
    <main class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8 lg:mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">Discover Websites</h1>
        <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Search through our collection of powerful websites or filter by technology and category.
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="max-w-4xl mx-auto mb-8 lg:mb-12">
        <div class="flex flex-col lg:flex-row gap-4 mb-6">
          <!-- Search Input -->
          <div class="flex-1">
            <label for="search-input" class="sr-only">Search websites</label>
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <input
                id="search-input"
                type="text"
                placeholder="Search websites by name or description..."
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                class="input-field pl-10 w-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                aria-describedby="search-help"
              />
            </div>
            <p id="search-help" class="sr-only">
              Search through website names and descriptions to find what you're looking for
            </p>
          </div>

          <!-- Tag Filter -->
          <div class="lg:w-64">
            <label for="tag-filter" class="sr-only">Filter by category</label>
            <select
              id="tag-filter"
              [(ngModel)]="selectedTagId"
              (change)="onTagChange()"
              class="input-field w-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              aria-describedby="tag-help"
            >
              <option value="">All categories</option>
              @for (tag of tags(); track tag.id) {
              <option [value]="tag.id">{{ tag.name }}</option>
              }
            </select>
            <p id="tag-help" class="sr-only">Filter websites by category or technology type</p>
          </div>
        </div>

        <!-- Active Filters -->
        @if (searchTerm || selectedTagId) {
        <div class="flex flex-wrap gap-2 mb-6" role="region" aria-label="Active filters">
          @if (searchTerm) {
          <div
            class="inline-flex items-center bg-primary-400/10 text-primary-400 px-3 py-1 rounded-full text-sm border border-primary-400/20"
            role="status"
            aria-label="Search filter active"
          >
            Search: "{{ searchTerm }}"
            <button
              (click)="clearSearch()"
              class="ml-2 text-primary-400 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
              aria-label="Clear search filter"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          } @if (selectedTagId) {
          <div
            class="inline-flex items-center bg-primary-400/10 text-primary-400 px-3 py-1 rounded-full text-sm border border-primary-400/20"
            role="status"
            aria-label="Category filter active"
          >
            Category: {{ getSelectedTagName() }}
            <button
              (click)="clearTagFilter()"
              class="ml-2 text-primary-400 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
              aria-label="Clear category filter"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          }
          <button
            (click)="clearAllFilters()"
            class="text-gray-400 hover:text-primary-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 rounded px-2 py-1"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
        }
      </div>

      <!-- Results -->
      <div class="max-w-6xl mx-auto">
        @if (isLoading()) {
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          aria-label="Loading websites"
        >
          @for (item of [1,2,3,4,5,6]; track item) {
          <div class="card animate-pulse" aria-hidden="true">
            <div class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div class="w-16 h-16 sm:w-12 sm:h-12 bg-dark-700 rounded-lg mx-auto sm:mx-0"></div>
              <div class="flex-1 text-center sm:text-left">
                <div class="h-5 bg-dark-700 rounded mb-2"></div>
                <div class="h-4 bg-dark-700 rounded mb-3"></div>
                <div class="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                  <div class="h-6 w-16 bg-dark-700 rounded-full"></div>
                  <div class="h-6 w-20 bg-dark-700 rounded-full"></div>
                </div>
                <div class="h-4 bg-dark-700 rounded"></div>
              </div>
            </div>
          </div>
          }
        </div>
        } @else if (filteredWebsites().length === 0) {
        <div class="text-center py-16" role="status" aria-live="polite">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No websites found</h3>
          <p class="text-gray-500 mb-4">
            @if (searchTerm || selectedTagId) { Try adjusting your search criteria or clearing the
            filters. } @else { No websites have been added to the collection yet. }
          </p>
          @if (!searchTerm && !selectedTagId) {
          <a
            href="https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md&title=Add%20Website%3A%20[Website%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label="Add the first website to our collection"
          >
            Add First Website
          </a>
          } @else {
          <button
            (click)="clearAllFilters()"
            class="btn-primary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label="Clear all filters to see more results"
          >
            Clear Filters
          </button>
          }
        </div>
        } @else {
        <!-- Results Count -->
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0"
        >
          <p class="text-gray-400" role="status" aria-live="polite">
            Showing {{ filteredWebsites().length }}
            {{ filteredWebsites().length === 1 ? 'website' : 'websites' }}
          </p>
        </div>

        <!-- Website Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          role="list"
          aria-label="Search results"
        >
          @for (website of filteredWebsites(); track website.id) {
          <app-website-card [website]="website" />
          }
        </div>
        }
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  websites = signal<Website[]>([]);
  tags = signal<Tag[]>([]);
  isLoading = signal(true);

  searchTerm = '';
  selectedTagId = '';

  filteredWebsites = computed(() => {
    let filtered = this.websites();

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (website) =>
          website.name.toLowerCase().includes(term) ||
          website.description.toLowerCase().includes(term)
      );
    }

    // Filter by tag
    if (this.selectedTagId) {
      const tagId = parseInt(this.selectedTagId);
      filtered = filtered.filter((website) => website.tags?.some((tag) => tag.id === tagId));
    }

    return filtered;
  });

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    try {
      this.isLoading.set(true);
      const [websitesData, tagsData] = await Promise.all([
        this.supabaseService.getWebsites(),
        this.supabaseService.getTags(),
      ]);

      this.websites.set(websitesData);
      this.tags.set(tagsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearchChange() {
    // Debounce search if needed - for now immediate search
  }

  onTagChange() {
    // Tag filter changed - already handled by computed signal
  }

  clearSearch() {
    this.searchTerm = '';
  }

  clearTagFilter() {
    this.selectedTagId = '';
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedTagId = '';
  }

  getSelectedTagName(): string {
    if (!this.selectedTagId) return '';
    const tag = this.tags().find((t) => t.id === parseInt(this.selectedTagId));
    return tag?.name || '';
  }
}

// Export default for lazy loading
export default SearchComponent;
