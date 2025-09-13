import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { MetadataService } from '../../core/services/metadata.service';
import { Website, LinkMetadata } from '../../shared/models/database.types';

@Component({
  selector: 'app-website-detail',
  imports: [RouterLink],
  template: `
    <main class="container mx-auto px-4 py-8">
      @if (isLoading()) {
      <!-- Loading State -->
      <div class="max-w-4xl mx-auto" aria-label="Loading website details">
        <div class="animate-pulse">
          <div class="h-8 bg-zinc-700 rounded mb-6 w-32" aria-hidden="true"></div>
          <div
            class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8"
          >
            <div class="w-24 h-24 bg-zinc-700 rounded-lg mx-auto sm:mx-0" aria-hidden="true"></div>
            <div class="flex-1 text-center sm:text-left">
              <div class="h-8 bg-zinc-700 rounded mb-4" aria-hidden="true"></div>
              <div class="h-6 bg-zinc-700 rounded mb-4" aria-hidden="true"></div>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div class="h-8 w-24 bg-zinc-700 rounded-full" aria-hidden="true"></div>
                <div class="h-8 w-32 bg-zinc-700 rounded-full" aria-hidden="true"></div>
              </div>
            </div>
          </div>
          <div class="h-32 bg-zinc-700 rounded mb-6" aria-hidden="true"></div>
          <div class="h-12 bg-zinc-700 rounded" aria-hidden="true"></div>
        </div>
      </div>
      } @else if (!website()) {
      <!-- Error State -->
      <div class="text-center py-16" role="status" aria-live="polite">
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
          The website you're looking for doesn't exist or has been removed.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            (click)="goBack()"
            class="btn-primary w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            aria-label="Go back to previous page"
          >
            Go Back
          </button>
          <a
            routerLink="/search"
            class="btn-secondary w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
        <nav
          aria-label="Breadcrumb"
          class="flex flex-wrap items-center space-x-2 text-sm text-zinc-400 mb-6"
        >
          <a
            routerLink="/"
            class="hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 rounded px-1 py-1"
            aria-label="Go to home page"
          >
            Home
          </a>
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <a
            routerLink="/search"
            class="hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 rounded px-1 py-1"
            aria-label="Go to search page"
          >
            Search
          </a>
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-zinc-300 break-words">{{ website()!.name }}</span>
        </nav>

        <!-- Main Content -->
        <article class="bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          <!-- Logo Section -->
          <div
            class="relative h-48 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center p-8"
          >
            @if (website()!.logo_url) {
            <img
              [src]="website()!.logo_url"
              [alt]="website()!.name + ' logo'"
              class="w-full h-full object-contain"
              loading="lazy"
            />
            } @else {
            <div
              class="w-24 h-24 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-lg flex items-center justify-center"
              aria-hidden="true"
            >
              <svg class="w-12 h-12 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            }
          </div>

          <!-- Content Section -->
          <div class="p-6">
            <!-- Header -->
            <header class="mb-6">
              <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2 break-words text-center">
                {{ website()!.name }}
              </h1>

              <p class="text-zinc-400 text-center">
                <time [attr.datetime]="website()!.created_at">
                  Added on {{ formatDate(website()!.created_at) }}
                </time>
              </p>
            </header>

            <!-- Description -->
            <section class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-4">About This Website</h2>
              <p class="text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                {{ website()!.description }}
              </p>
            </section>

            <!-- Tags -->
            @if (website()!.tags && website()!.tags!.length > 0) {
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-white mb-3">Technologies</h3>
              <div class="flex flex-wrap gap-2" role="list" aria-label="Website tags">
                @for (tag of website()!.tags; track tag.id) {
                <a
                  [routerLink]="['/search']"
                  [queryParams]="{ tag: tag.slug }"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                  role="listitem"
                  [attr.aria-label]="'Filter websites by ' + tag.name + ' tag'"
                >
                  {{ tag.name }}
                </a>
                }
              </div>
            </div>
            }

            <!-- Sources -->
            @if (sourcesWithMetadata() && sourcesWithMetadata().length > 0) {
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-white mb-3">Sources</h3>
              <div class="space-y-3" role="list" aria-label="Website sources">
                @for (sourceWithMeta of sourcesWithMetadata(); track sourceWithMeta.added_at) {
                <div class="bg-zinc-800 rounded-lg p-4 border border-zinc-700" role="listitem">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      @switch (sourceWithMeta.type) { @case ('social_media') {
                      <svg
                        class="w-5 h-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                        ></path>
                      </svg>
                      } @case ('scraper') {
                      <svg
                        class="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      } @case ('suggestion') {
                      <svg
                        class="w-5 h-5 text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      } @default {
                      <svg
                        class="w-5 h-5 text-zinc-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      } }
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-white capitalize">{{
                          sourceWithMeta.type.replace('_', ' ')
                        }}</span>
                        <time
                          class="text-xs text-zinc-400"
                          [attr.datetime]="sourceWithMeta.added_at"
                        >
                          {{ formatDate(sourceWithMeta.added_at) }}
                        </time>
                      </div>
                      <p class="text-sm text-zinc-300 mb-3">{{ sourceWithMeta.description }}</p>
                      @if (sourceWithMeta.platform) {
                      <span
                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20 mb-3"
                      >
                        {{ sourceWithMeta.platform }}
                      </span>
                      } @if (sourceWithMeta.url) {
                      <!-- Rich Metadata Card or Fallback -->
                      @if (sourceWithMeta.metadata?.success) {
                      <!-- Rich metadata card -->
                      <a
                        [href]="sourceWithMeta.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block border border-zinc-600 rounded-lg overflow-hidden bg-zinc-700/50 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                        [attr.aria-label]="
                          'View source: ' +
                          (sourceWithMeta.metadata?.title || sourceWithMeta.description) +
                          ' (opens in new tab)'
                        "
                      >
                        <div class="flex">
                          @if (sourceWithMeta.metadata?.image) {
                          <div class="flex-shrink-0 w-24 h-20 bg-zinc-600">
                            <img
                              [src]="sourceWithMeta.metadata?.image"
                              [alt]="sourceWithMeta.metadata?.title || 'Preview image'"
                              class="w-full h-full object-cover"
                              loading="lazy"
                              (error)="$event.target.style.display = 'none'"
                            />
                          </div>
                          }
                          <div class="flex-1 p-3 min-w-0">
                            @if (sourceWithMeta.metadata?.title) {
                            <h4 class="text-sm font-semibold text-white mb-1 line-clamp-2">
                              {{ sourceWithMeta.metadata?.title }}
                            </h4>
                            } @if (sourceWithMeta.metadata?.description) {
                            <p class="text-xs text-zinc-300 mb-2 line-clamp-2">
                              {{ sourceWithMeta.metadata?.description }}
                            </p>
                            }
                            <div class="flex items-center justify-between">
                              <p class="text-xs text-zinc-400 truncate">
                                {{
                                  sourceWithMeta.metadata?.site_name ||
                                    getUrlDomain(sourceWithMeta.url)
                                }}
                              </p>
                              <svg
                                class="w-3 h-3 text-zinc-400 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                                ></path>
                                <path
                                  d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                      } @else {
                      <!-- Fallback card with loading state -->
                      <a
                        [href]="sourceWithMeta.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block border border-zinc-600 rounded-lg p-3 bg-zinc-700/50 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                        [attr.aria-label]="
                          'View source: ' + sourceWithMeta.description + ' (opens in new tab)'
                        "
                      >
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            @switch (sourceWithMeta.platform) { @case ('twitter') {
                            <div
                              class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center"
                            >
                              <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                                ></path>
                              </svg>
                            </div>
                            } @case ('instagram') {
                            <div
                              class="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded flex items-center justify-center"
                            >
                              <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.084 5.52.199 5.012.374a6.063 6.063 0 00-2.189 1.425A6.063 6.063 0 00.374 5.012C.199 5.52.084 6.094.048 7.041.013 7.989 0 8.396 0 12.017s.013 4.028.048 4.976c.036.947.151 1.521.326 2.029a6.063 6.063 0 001.425 2.189 6.063 6.063 0 002.189 1.425c.508.175 1.082.29 2.029.326.948.035 1.355.048 4.976.048s4.028-.013 4.976-.048c.947-.036 1.521-.151 2.029-.326a6.063 6.063 0 002.189-1.425 6.063 6.063 0 001.425-2.189c.175-.508.29-1.082.326-2.029.035-.948.048-1.355.048-4.976s-.013-4.028-.048-4.976c-.036-.947-.151-1.521-.326-2.029a6.063 6.063 0 00-1.425-2.189A6.063 6.063 0 0018.988.374c-.508-.175-1.082-.29-2.029-.326C15.011.013 14.604 0 12.017 0zm0 2.164c3.53 0 3.94.013 5.33.048.85.037 1.31.171 1.617.284.407.158.697.346.999.648.302.302.49.592.648.999.113.307.247.767.284 1.617.035 1.39.048 1.8.048 5.33s-.013 3.94-.048 5.33c-.037.85-.171 1.31-.284 1.617-.158.407-.346.697-.648.999-.302.302-.592.49-.999.648-.307.113-.767.247-1.617.284-1.39.035-1.8.048-5.33.048s-3.94-.013-5.33-.048c-.85-.037-1.31-.171-1.617-.284a2.678 2.678 0 01-.999-.648 2.678 2.678 0 01-.648-.999c-.113-.307-.247-.767-.284-1.617-.035-1.39-.048-1.8-.048-5.33s.013-3.94.048-5.33c.037-.85.171-1.31.284-1.617.158-.407.346-.697.648-.999.302-.302.592-.49.999-.648.307-.113.767-.247 1.617-.284 1.39-.035 1.8-.048 5.33-.048zm0 3.68a6.173 6.173 0 100 12.346 6.173 6.173 0 000-12.346zm0 10.182a4.009 4.009 0 110-8.018 4.009 4.009 0 010 8.018zm7.846-10.405a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z"
                                ></path>
                              </svg>
                            </div>
                            } @case ('linkedin') {
                            <div
                              class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center"
                            >
                              <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                ></path>
                              </svg>
                            </div>
                            } @default {
                            <div
                              class="w-8 h-8 bg-zinc-600 rounded flex items-center justify-center"
                            >
                              <svg
                                class="w-4 h-4 text-zinc-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </div>
                            } }
                          </div>
                          <div class="flex-1 min-w-0">
                            @if (sourceWithMeta.metadata === null) {
                            <!-- Loading state -->
                            <div class="animate-pulse">
                              <div class="h-4 bg-zinc-600 rounded mb-1"></div>
                              <div class="h-3 bg-zinc-600 rounded w-3/4"></div>
                            </div>
                            } @else {
                            <!-- Failed to load metadata fallback -->
                            <p class="text-sm font-medium text-white truncate">
                              @switch (sourceWithMeta.platform) { @case ('twitter') { Twitter Post }
                              @case ('instagram') { Instagram Post } @case ('linkedin') { LinkedIn
                              Post } @default { {{ getUrlDomain(sourceWithMeta.url) }} } }
                            </p>
                            <p class="text-xs text-zinc-400 truncate">{{ sourceWithMeta.url }}</p>
                            }
                          </div>
                          <div class="flex-shrink-0">
                            <svg
                              class="w-4 h-4 text-zinc-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                              ></path>
                              <path
                                d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </a>
                      }}
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
            }

            <!-- Author -->
            @if (website()!.author) {
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-white mb-3">Added By</h3>
              <div class="flex items-center space-x-2">
                <a
                  [href]="website()!.author!.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-orange-400 hover:text-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
                  [attr.aria-label]="
                    'Visit ' + website()!.author!.display_name + ' profile (opens in new tab)'
                  "
                >
                  {{ website()!.author!.display_name }}
                </a>
                @if (website()!.author!.role) {
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20"
                >
                  {{ website()!.author!.role }}
                </span>
                }
              </div>
            </div>
            }

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-700">
              <a
                [href]="website()!.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                [attr.aria-label]="'Visit ' + website()!.name + ' website (opens in new tab)'"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
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
                class="inline-flex items-center justify-center px-4 py-2 text-sm text-zinc-300 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                aria-label="Go back to previous page"
              >
                Go Back
              </button>

              <a
                routerLink="/search"
                class="inline-flex items-center justify-center px-4 py-2 text-sm text-zinc-300 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
                aria-label="Browse more websites"
              >
                Browse More
              </a>
            </div>
          </div>
        </article>

        <!-- Related or Suggested Websites Section -->
        @if (website()!.tags && website()!.tags!.length > 0) {
        <section class="mt-8 lg:mt-12" aria-labelledby="similar-websites-heading">
          <h2 id="similar-websites-heading" class="text-xl sm:text-2xl font-bold text-white mb-6">
            Similar Websites
          </h2>
          <p class="text-zinc-400 mb-4">
            Explore more websites with similar technologies and features.
          </p>
          <div class="flex flex-wrap gap-2" role="list" aria-label="Similar website categories">
            @for (tag of website()!.tags; track tag.id) {
            <a
              [routerLink]="['/search']"
              [queryParams]="{ tag: tag.slug }"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
  private metadataService = inject(MetadataService);

  website = signal<Website | null>(null);
  isLoading = signal(true);
  sourceMetadata = signal<Map<string, LinkMetadata>>(new Map());

  // Computed signal for sources with their metadata
  protected sourcesWithMetadata = computed(() => {
    const website = this.website();
    const metadata = this.sourceMetadata();
    if (!website?.sources) return [];

    return website.sources.map((source) => ({
      ...source,
      metadata: source.url ? metadata.get(source.url) : null,
    }));
  });

  async ngOnInit() {
    const param =
      this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('name');
    if (!param) {
      this.router.navigate(['/search']);
      return;
    }

    try {
      let websiteData: Website | null = null;

      // Check if the parameter is a number (ID) or a string (name)
      if (!isNaN(+param)) {
        // It's an ID
        websiteData = await this.supabaseService.getWebsiteById(+param);
      } else {
        // It's a name
        websiteData = await this.supabaseService.getWebsiteByName(param);
      }

      this.website.set(websiteData);

      // Fetch metadata for sources
      if (websiteData?.sources) {
        this.fetchSourcesMetadata(websiteData.sources);
      }
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private fetchSourcesMetadata(sources: any[]) {
    const urlsToFetch = sources.filter((source) => source.url).map((source) => source.url);

    if (urlsToFetch.length === 0) return;

    // Fetch metadata for each URL
    urlsToFetch.forEach((url) => {
      this.metadataService.fetchLinkMetadata(url).subscribe({
        next: (metadata) => {
          this.sourceMetadata.update((current) => {
            const updated = new Map(current);
            updated.set(url, metadata);
            return updated;
          });
        },
        error: (error) => {
          console.warn('Failed to fetch metadata for', url, error);
        },
      });
    });
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

  getUrlDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
}

// Export default for lazy loading
export default WebsiteDetailComponent;
