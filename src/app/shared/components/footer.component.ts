import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer
      class="border-t border-orange-700 mt-auto"
      style="background-color: #121212;"
      role="contentinfo"
    >
      <div class="mx-auto px-4 py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- About -->
          <div class="sm:col-span-2 lg:col-span-1">
            <h3 class="text-lg font-semibold text-primary-400 mb-4">About</h3>
            <p class="text-zinc-400 mb-4 leading-relaxed">
              A curated list of powerful websites built with modern web technologies. Open source
              and vibe coded by GitHub Copilot.
            </p>
            <p class="text-sm text-zinc-500">
              Project owner:
              <a
                href="https://sayedmahmoud266.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800 rounded"
                aria-label="Visit Sayed Mahmoud Sayed's website"
              >
                Sayed Mahmoud Sayed
              </a>
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-lg font-semibold text-primary-400 mb-4">Links</h3>
            <nav aria-label="Footer navigation">
              <ul class="space-y-2">
                <li>
                  <a
                    href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center text-zinc-400 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800 rounded px-1 py-1"
                    aria-label="View source code on GitHub"
                  >
                    <svg
                      class="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Source Code
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md&title=Add%20Website%3A%20[Website%20Name]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center text-zinc-400 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800 rounded px-1 py-1"
                    aria-label="Submit a website to our collection"
                  >
                    <svg
                      class="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Add Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sayedmahmoud266"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center text-zinc-400 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800 rounded px-1 py-1"
                    aria-label="View Sayed Mahmoud's GitHub profile"
                  >
                    <svg
                      class="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    My Profile
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-lg font-semibold text-primary-400 mb-4">Legal</h3>
            <nav aria-label="Legal information">
              <ul class="space-y-2">
                <li>
                  <a
                    href="https://github.com/sayedmahmoud266/powerfulwebsites.space/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center text-zinc-400 hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-800 rounded px-1 py-1"
                    aria-label="View MIT License details"
                  >
                    <svg
                      class="w-4 h-4 mr-2 flex-shrink-0"
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
                    MIT License
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-orange-700 mt-8 pt-8 text-center">
          <p class="text-zinc-500 text-sm">
            © 2025 powerfulwebsites.space. Open source project vibe coded by GitHub Copilot.
          </p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
