# powerfulwebsites.space

A modern, high-performance, and visually appealing platform built with Angular v20+ to showcase a curated list of powerful websites built with modern web technologies.

## Features
- Home page with introduction, latest websites, and call-to-action
- Search and filter websites by name or tags (data from Supabase)
- Website detail page with full info and tags
- Responsive, dark mode only, yellow as primary color
- Header and footer with GitHub links, badges, and credits
- Open source (MIT License)

## Tech Stack
- Angular v20+ (standalone components, signals)
- Tailwind CSS v4 (dark mode only, yellow primary)
- Supabase (PostgreSQL backend)
- Angular SSG (static site generation)
- TypeScript, SCSS

## Setup & Run
1. **Clone the repo:**
   ```zsh
   git clone https://github.com/sayedmahmoud266/powerfulwebsites.space.git
   cd powerfulwebsites.space
   ```
2. **Install dependencies:**
   ```zsh
   npm install
   ```
3. **Configure Supabase:**
   - Create a project at [Supabase](https://supabase.com/)
   - Copy your API keys and set them in `.env` or `environment.ts`
   - Ensure your database matches the [database structure](./.github/instructions/database-structure.instructions.md)
4. **Run locally:**
   ```zsh
   npm start
   ```
5. **Build static site:**
   ```zsh
   npm run build:ssg
   ```

## Add a Website
- [Open a GitHub issue to suggest a new website](https://github.com/sayedmahmoud266/powerfulwebsites.space/issues/new?template=add-website.md)

## License
MIT. See [LICENSE](./LICENSE).

---

Coded by [GitHub Copilot](https://github.com/features/copilot) for [Sayed Mahmoud Sayed](https://sayedmahmoud266.website).
