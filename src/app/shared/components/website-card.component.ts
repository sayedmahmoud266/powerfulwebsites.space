import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Website } from '../models/database.types';

@Component({
  selector: 'app-website-card',
  imports: [RouterLink],
  template: `
    <article class="card hover:border-orange-400 transition-all duration-200 group" role="article">
      <div class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
        @if (website().logo_url) {
        <img
          [src]="website().logo_url"
          [alt]="website().name + ' logo'"
          class="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0 mx-auto sm:mx-0"
          loading="lazy"
        />
        } @else {
        <div
          class="w-16 h-16 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0"
          aria-hidden="true"
        >
          <svg class="w-8 h-8 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        }

        <div class="flex-1 min-w-0 text-center sm:text-left">
          <a
            [routerLink]="['/website', encodeWebsiteName(website().name)]"
            class="block group-hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
            [attr.aria-label]="'View details for ' + website().name"
          >
            <h3 class="text-lg font-semibold text-gray-100 mb-1 truncate">
              {{ website().name }}
            </h3>
          </a>

          <p class="text-gray-400 text-sm mb-3 line-clamp-2" [attr.title]="website().description">
            {{ website().description }}
          </p>

          @if (website().tags && website().tags!.length > 0) {
          <div
            class="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start"
            role="list"
            aria-label="Website tags"
          >
            @for (tag of website().tags; track tag.id) {
            <a
              [routerLink]="['/search']"
              [queryParams]="{ tag: tag.slug }"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              role="listitem"
              [attr.aria-label]="'Filter websites by ' + tag.name + ' tag'"
            >
              {{ tag.name }}
            </a>
            }
          </div>
          }

          <div
            class="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0"
          >
            <a
              [href]="website().url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-sm text-gray-400 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1 py-1"
              [attr.aria-label]="'Visit ' + website().name + ' website (opens in new tab)'"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                ></path>
                <path
                  d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                ></path>
              </svg>
              Visit Website
            </a>

            <time
              class="text-xs text-gray-500"
              [attr.datetime]="website().created_at"
              [attr.title]="'Added on ' + formatDate(website().created_at)"
            >
              {{ formatDate(website().created_at) }}
            </time>
          </div>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteCardComponent {
  website = input.required<Website>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  encodeWebsiteName(name: string): string {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
  }
}
