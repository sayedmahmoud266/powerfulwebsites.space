# 🌟 powerfulwebsites.space

> A curated collection of powerful websites built with modern web technologies

[![Angular](https://img.shields.io/badge/Angular-20+-red.svg)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0+-teal.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Overview

powerfulwebsites.space is a modern, high-performance web application that showcases a curated collection of innovative websites. Built with Angular v20+ and featuring cutting-edge technologies, it provides an excellent user experience across all devices.

## 🚀 Live Demo

Visit the live application: **[powerfulwebsites.space](https://powerfulwebsites.space)**

## 📱 Features

- 🎨 **Modern Design**: Clean, responsive interface with dark mode
- 🔍 **Advanced Search**: Search and filter websites by name, description, and tags
- 📱 **Mobile-First**: Fully responsive design optimized for all screen sizes
- ♿ **Accessibility**: WCAG 2.1 compliant with comprehensive screen reader support
- ⚡ **Performance**: Static site generation with optimal loading speeds
- 🏷️ **Categorization**: Tag-based organization for easy discovery
- 🌐 **SSR/SSG**: Server-side rendering and static site generation for SEO

## 🛠️ Tech Stack

### Frontend
- **[Angular 20+](https://angular.dev)** - Modern web framework with standalone components
- **[TypeScript 5+](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Angular Signals](https://angular.dev/guide/signals)** - Reactive state management
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework
- **[SCSS](https://sass-lang.com/)** - Enhanced CSS with variables and mixins

### Backend & Database
- **[Supabase](https://supabase.com)** - Backend-as-a-Service with PostgreSQL
- **RESTful APIs** - Clean API design for data operations

### Build & Development
- **[Angular CLI](https://angular.dev/tools/cli)** - Command-line interface
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 🏗️ Architecture

```
src/
├── app/
│   ├── core/
│   │   └── services/          # Core business logic
│   ├── features/
│   │   ├── home/              # Home page component
│   │   ├── search/            # Search and filtering
│   │   └── website-detail/    # Individual website pages
│   ├── shared/
│   │   ├── components/        # Reusable UI components
│   │   └── models/           # TypeScript interfaces
│   └── app.routes.ts         # Routing configuration
├── environments/             # Environment configurations
└── styles.scss              # Global styles
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+ or **yarn** 1.22+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayedmahmoud266/powerfulwebsites.space.git
   cd powerfulwebsites.space
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp src/environments/environment.ts src/environments/environment.local.ts
   ```
   
   Update `environment.local.ts` with your Supabase credentials:
   ```typescript
   export const environment = {
     production: false,
     supabaseUrl: 'YOUR_SUPABASE_URL',
     supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

### Static Site Generation
```bash
npm run prerender
```

The built application will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🎨 Customization

### Styling
- **Colors**: Modify the primary color in `tailwind.config.js`
- **Components**: Update component styles in `src/styles.scss`
- **Theme**: All styling uses CSS custom properties for easy theming

### Data Sources
- **Supabase**: Configure your database schema in the Supabase dashboard
- **API**: Update API endpoints in `src/app/core/services/supabase.service.ts`

## 📊 Database Schema

### Tables

**websites**
- `id` (int8, Primary Key)
- `name` (varchar) - Website name
- `url` (varchar) - Website URL
- `description` (text) - Website description
- `logo_url` (text) - Website logo URL
- `created_at` (timestamp) - Creation timestamp

**tags**
- `id` (int8, Primary Key)
- `name` (varchar) - Tag name
- `slug` (varchar) - URL-friendly tag identifier
- `created_at` (timestamp) - Creation timestamp

**websites_tags** (Junction table)
- `website_id` (int8) - Foreign key to websites
- `tag_id` (int8) - Foreign key to tags

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run e2e
```

### Linting
```bash
npm run lint
```

## ♿ Accessibility

This application follows WCAG 2.1 guidelines and includes:

- **Semantic HTML** structure
- **ARIA labels** and landmarks
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management**
- **Skip links** for navigation
- **High contrast** mode support
- **Reduced motion** preferences

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sayed Mahmoud Sayed**
- Website: [sayedmahmoud266.website](https://sayedmahmoud266.website)
- GitHub: [@sayedmahmoud266](https://github.com/sayedmahmoud266)

## 🙏 Acknowledgments

- Built with **GitHub Copilot** assistance
- Inspired by the amazing web development community
- Icons from **Heroicons**
- Hosted on **Vercel/Netlify** (update as needed)

## 📈 Roadmap

- [ ] **User Authentication** - Allow users to save favorite websites
- [ ] **Website Submission Form** - Direct submission interface
- [ ] **Comments & Reviews** - Community feedback system
- [ ] **Advanced Filters** - More sophisticated filtering options
- [ ] **API Endpoints** - Public API for third-party integrations
- [ ] **PWA Features** - Progressive Web App capabilities

---

<div align="center">
  <p>Made with ❤️ using Angular v20+ and modern web technologies</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
