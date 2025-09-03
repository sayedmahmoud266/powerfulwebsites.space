import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <a
              routerLink="/"
              class="text-2xl font-bold text-primary-400 hover:text-primary-500 transition-colors"
            >
              powerfulwebsites.space
            </a>
            <div class="hidden md:flex space-x-4">
              <a routerLink="/" class="text-gray-300 hover:text-primary-400 transition-colors"
                >Home</a
              >
              <a routerLink="/search" class="text-gray-300 hover:text-primary-400 transition-colors"
                >Search</a
              >
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- GitHub Stars Badge -->
            <a
              href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded-lg border border-dark-600 transition-colors"
            >
              <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="text-sm text-gray-300">GitHub</span>
              <span
                class="bg-primary-400 text-dark-900 text-xs px-2 py-0.5 rounded-full font-semibold"
                >★ Star</span
              >
            </a>
          </div>
        </nav>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
