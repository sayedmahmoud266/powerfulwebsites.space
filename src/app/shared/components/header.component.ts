import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `
    <header class="border-b border-orange-700 sticky top-0 z-50" style="background-color: #121212;">
      <div class="mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <a
              routerLink="/"
              class="flex items-center space-x-3 text-xl sm:text-2xl font-bold text-orange-400 hover:text-orange-500 transition-colors uppercase"
              style="font-family: 'Bungee', system-ui, -apple-system, sans-serif;"
              aria-label="powerfulwebsites.space home"
            >
              <img
                src="/logo.png"
                alt="Powerful Websites Logo"
                class="w-8 h-8 sm:w-10 sm:h-10"
                loading="eager"
              />
              <span class="hidden sm:inline">powerfulwebsites.space</span>
              <span class="sm:hidden">PWS</span>
            </a>
            <!-- Desktop Navigation -->
            <div class="hidden md:flex space-x-4">
              <a
                routerLink="/"
                class="text-zinc-300 hover:text-orange-400 transition-colors focus:outline-none"
                style="--tw-ring-offset-color: #121212;"
                aria-label="Home page"
              >
                Home
              </a>
              <a
                routerLink="/search"
                class="text-zinc-300 hover:text-orange-400 transition-colors focus:outline-none"
                style="--tw-ring-offset-color: #121212;"
                aria-label="Search websites"
              >
                Search
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-2 sm:space-x-4">
            <!-- GitHub Stars Badge -->
            <a
              href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:flex items-center hover:opacity-90 transition-opacity"
              style="--tw-ring-offset-color: #121212;"
              aria-label="Star on GitHub"
            >
              <img
                src="https://img.shields.io/github/stars/sayedmahmoud266/powerfulewebsites.space?style=for-the-badge&logo=github&color=%23ff8904"
                alt="GitHub stars badge"
              />
            </a>

            <!-- Mobile GitHub Icon -->
            <a
              href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
              target="_blank"
              rel="noopener noreferrer"
              class="sm:hidden "
              style="--tw-ring-offset-color: #121212;"
              aria-label="View on GitHub"
            >
              <img
                src="https://img.shields.io/github/stars/sayedmahmoud266/powerfulewebsites.space?style=for-the-badge&logo=github&color=%23ff8904"
                alt="GitHub stars badge"
              />
            </a>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-zinc-300 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded"
              style="--tw-ring-offset-color: #121212;"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle navigation menu"
            >
              @if (!mobileMenuOpen()) {
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              } @else {
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              }
            </button>
          </div>
        </nav>

        <!-- Mobile Navigation Menu -->
        @if (mobileMenuOpen()) {
        <div class="md:hidden mt-4 pb-4 border-t border-orange-700 pt-4">
          <div class="flex flex-col space-y-2">
            <a
              routerLink="/"
              (click)="closeMobileMenu()"
              class="text-zinc-300 hover:text-orange-400 transition-colors px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              style="--tw-ring-offset-color: #121212;"
            >
              Home
            </a>
            <a
              routerLink="/search"
              (click)="closeMobileMenu()"
              class="text-zinc-300 hover:text-orange-400 transition-colors px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              style="--tw-ring-offset-color: #121212;"
            >
              Search
            </a>
          </div>
        </div>
        }
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
