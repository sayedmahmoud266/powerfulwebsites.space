import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Website, Tag } from '../../shared/models/database.types';
import { WebsiteCardComponent } from '../../shared/components/website-card.component';

@Component({
  selector: 'app-search',
  imports: [FormsModule, WebsiteCardComponent],
  template: `
    <main class="mx-auto px-4 py-8">
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
                [value]="searchTerm()"
                (input)="onSearchChange($event)"
                class="input-field pl-10 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-describedby="search-help"
              />
            </div>
            <p id="search-help" class="sr-only">
              Search through website names and descriptions to find what you're looking for
            </p>
          </div>

          <!-- Tag Search and Selection -->
          <div class="lg:w-64">
            <label for="tag-search" class="sr-only">Search and select tags</label>
            <div class="relative">
              <input
                id="tag-search"
                type="text"
                placeholder="Search tags..."
                [value]="tagSearchTerm()"
                (input)="onTagSearchChange($event)"
                (focus)="setDropdownOpen(true)"
                (blur)="onInputBlur()"
                (keydown)="onKeyDown($event)"
                class="input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              />
              <button
                type="button"
                (click)="toggleDropdown()"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
                aria-label="Toggle tag dropdown"
              >
                <svg
                  class="w-5 h-5 transition-transform"
                  [class.rotate-180]="isDropdownOpen()"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              @if (isDropdownOpen() && filteredTags().length > 0) {
              <div
                class="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-orange-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
              >
                @for (tag of filteredTags(); track tag.id; let i = $index) {
                <button
                  type="button"
                  (click)="toggleTag(tag)"
                  (mousedown)="$event.preventDefault()"
                  (mouseenter)="setHighlightedIndex(i)"
                  [class.bg-gray-700]="i === highlightedIndex()"
                  class="w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-300 hover:text-orange-400 transition-colors flex items-center justify-between"
                >
                  <span>{{ tag.name }}</span>
                  @if (isTagSelected(tag)) {
                  <svg
                    class="w-4 h-4 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  }
                </button>
                }
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Selected Tags -->
        @if (selectedTags().length > 0) {
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-300 mb-2">Selected Tags:</h3>
          <div class="flex flex-wrap gap-2">
            @for (tag of selectedTags(); track tag.id) {
            <div
              class="inline-flex items-center bg-orange-400/10 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-400/20"
            >
              {{ tag.name }}
              <button
                (click)="removeTag(tag)"
                class="ml-2 text-orange-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
                [attr.aria-label]="'Remove ' + tag.name + ' tag'"
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
          </div>
        </div>
        }

        <!-- Active Search Filter -->
        @if (searchTerm()) {
        <div class="flex flex-wrap gap-2 mb-6" role="region" aria-label="Active filters">
          <div
            class="inline-flex items-center bg-orange-400/10 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-400/20"
            role="status"
            aria-label="Search filter active"
          >
            Search: "{{ searchTerm() }}"
            <button
              (click)="clearSearch()"
              class="ml-2 text-orange-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
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

          @if (searchTerm() || selectedTags().length > 0) {
          <button
            (click)="clearAllFilters()"
            class="text-gray-400 hover:text-orange-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
          }
        </div>
        }
      </div>

      <!-- Results -->
      <div class="mx-auto">
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
            @if (searchTerm() || selectedTags().length > 0) { Try adjusting your search criteria or
            clearing the filters. } @else { No websites have been added to the collection yet. }
          </p>
          @if (!searchTerm() && selectedTags().length === 0) {
          <a
            href="https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md&title=Add%20Website%3A%20[Website%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Add the first website to our collection"
          >
            Add First Website
          </a>
          } @else {
          <button
            (click)="clearAllFilters()"
            class="btn-primary focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  websites = signal<Website[]>([]);
  tags = signal<Tag[]>([]);
  isLoading = signal(true);

  searchTerm = signal('');
  selectedTags = signal<Tag[]>([]);
  tagSearchTerm = signal('');
  isDropdownOpen = signal(false);
  highlightedIndex = signal(-1);
  private isInitializing = signal(true);

  // Computed properties
  filteredTags = computed(() => {
    const term = this.tagSearchTerm().toLowerCase().trim();
    if (!term) return this.tags();
    return this.tags().filter((tag) => tag.name.toLowerCase().includes(term));
  });

  filteredWebsites = computed(() => {
    let filtered = this.websites();

    // Filter by search term
    const term = this.searchTerm().trim();
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(
        (website) =>
          website.name.toLowerCase().includes(searchLower) ||
          website.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected tags
    const tags = this.selectedTags();
    if (tags.length > 0) {
      const tagIds = tags.map((tag) => tag.id);
      filtered = filtered.filter((website) => website.tags?.some((tag) => tagIds.includes(tag.id)));
    }

    return filtered;
  });

  async ngOnInit() {
    await this.loadData();

    // Handle route parameters for restoring search state
    this.route.queryParams.subscribe((params) => {
      this.isInitializing.set(true);

      // Restore search term
      if (params['search']) {
        this.searchTerm.set(params['search']);
      }

      // Restore selected tags
      if (params['tags']) {
        const tagSlugs = Array.isArray(params['tags']) ? params['tags'] : [params['tags']];
        const tagsToSelect = this.tags().filter((tag) => tagSlugs.includes(tag.slug));
        this.selectedTags.set(tagsToSelect);
      }

      // Handle legacy single tag parameter for backwards compatibility
      if (params['tag'] && !params['tags']) {
        const tagSlug = params['tag'];
        const tag = this.tags().find((t) => t.slug === tagSlug);
        if (tag && !this.selectedTags().find((t) => t.id === tag.id)) {
          this.selectedTags.update((tags) => [...tags, tag]);
        }
      }

      // Allow route updates after initialization
      setTimeout(() => {
        this.isInitializing.set(false);
      }, 0);
    });
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

  private updateRouteParams() {
    // Don't update route params during initialization to prevent loops
    if (this.isInitializing()) return;

    const queryParams: any = {};

    // Add search term if present
    if (this.searchTerm().trim()) {
      queryParams.search = this.searchTerm().trim();
    }

    // Add selected tag slugs if any
    const selectedTagSlugs = this.selectedTags().map((tag) => tag.slug);
    if (selectedTagSlugs.length > 0) {
      queryParams.tags = selectedTagSlugs;
    }

    // Update route without triggering navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.updateRouteParams();
  }

  onTagSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.tagSearchTerm.set(target.value);
    this.isDropdownOpen.set(true);
    this.highlightedIndex.set(-1); // Reset highlight when searching
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isDropdownOpen()) return;

    const filteredTags = this.filteredTags();
    const currentIndex = this.highlightedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < filteredTags.length - 1 ? currentIndex + 1 : 0;
        this.highlightedIndex.set(nextIndex);
        this.scrollToHighlighted();
        break;

      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredTags.length - 1;
        this.highlightedIndex.set(prevIndex);
        this.scrollToHighlighted();
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < filteredTags.length) {
          const selectedTag = filteredTags[currentIndex];
          this.toggleTag(selectedTag);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.isDropdownOpen.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  private scrollToHighlighted() {
    // Scroll the highlighted item into view
    setTimeout(() => {
      const dropdown = document.querySelector('.absolute.top-full') as HTMLElement;
      const highlightedButton = dropdown?.querySelector(
        `button:nth-child(${this.highlightedIndex() + 1})`
      ) as HTMLElement;

      if (dropdown && highlightedButton) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const buttonRect = highlightedButton.getBoundingClientRect();

        if (buttonRect.bottom > dropdownRect.bottom) {
          dropdown.scrollTop += buttonRect.bottom - dropdownRect.bottom;
        } else if (buttonRect.top < dropdownRect.top) {
          dropdown.scrollTop -= dropdownRect.top - buttonRect.top;
        }
      }
    }, 0);
  }

  isTagSelected(tag: Tag): boolean {
    return this.selectedTags().find((t) => t.id === tag.id) !== undefined;
  }

  addTag(tag: Tag) {
    if (!this.isTagSelected(tag)) {
      this.selectedTags.update((tags) => [...tags, tag]);
      this.updateRouteParams();
    }
  }

  removeTag(tagToRemove: Tag) {
    this.selectedTags.update((tags) => tags.filter((tag) => tag.id !== tagToRemove.id));
    this.updateRouteParams();
  }

  clearSearch() {
    this.searchTerm.set('');
    this.updateRouteParams();
  }

  clearAllFilters() {
    this.searchTerm.set('');
    this.selectedTags.set([]);
    this.updateRouteParams();
  }

  setDropdownOpen(isOpen: boolean) {
    this.isDropdownOpen.set(isOpen);
    if (!isOpen) {
      this.highlightedIndex.set(-1);
    }
  }

  setHighlightedIndex(index: number) {
    this.highlightedIndex.set(index);
  }

  toggleDropdown() {
    this.isDropdownOpen.update((open) => !open);
    if (!this.isDropdownOpen()) {
      this.highlightedIndex.set(-1);
    }
  }

  onInputBlur() {
    // Delay closing to allow for click events on dropdown items
    setTimeout(() => {
      this.isDropdownOpen.set(false);
      this.highlightedIndex.set(-1);
    }, 200);
  }

  toggleTag(tag: Tag) {
    if (this.isTagSelected(tag)) {
      this.removeTag(tag);
    } else {
      this.addTag(tag);
    }
  }
}

// Export default for lazy loading
export default SearchComponent;
