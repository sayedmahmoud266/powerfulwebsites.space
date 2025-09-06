# Copilot Instructions for powerfulwebsites.space

## Project Overview
A curated website directory built with Angular v20+ featuring standalone components, signals-based state management, and static site generation. Uses Supabase as backend and Tailwind CSS v4 for dark-mode-only styling.

## Architecture Patterns

### Component Structure
- **Standalone Components**: All components use standalone architecture (do NOT set `standalone: true` - it's default)
- **Signal-based State**: Use `signal()`, `computed()`, and `update()` - avoid `mutate()`
- **Input/Output Functions**: Use `input()` and `output()` functions instead of decorators
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`
- **Explicit Imports**: Always declare dependencies in component `imports` array

```typescript
// Example component pattern from src/app/features/home/home.component.ts
@Component({
  selector: 'app-home',
  imports: [RouterLink, WebsiteCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class HomeComponent {
  protected readonly websites = signal<Website[]>([]);
  private readonly supabase = inject(SupabaseService);
}
```

### Service Patterns
- **Dependency Injection**: Use `inject()` function instead of constructor injection
- **Supabase Integration**: All data access through `SupabaseService` with typed responses
- **Error Handling**: Services return promises with try/catch patterns
- **Joined Queries**: Use Supabase's nested select for relationships

```typescript
// Pattern from src/app/core/services/supabase.service.ts
async getWebsites(): Promise<Website[]> {
  const { data, error } = await this.supabase
    .from('websites')
    .select(`*, websites_tags(tags(*))`);
  
  return data?.map(website => ({
    ...website,
    tags: website.websites_tags?.map((wt: any) => wt.tags) || []
  })) || [];
}
```

## Key Technical Decisions

### Zone-less Change Detection
- **Critical**: App uses `provideZonelessChangeDetection()` in `app.config.ts`
- **Implications**: All reactivity must be signal-based, no manual change detection
- **Pattern**: Use signals for all component state, computed for derived values

### State Management
- **Local State**: Signals for component-level state
- **No Global Store**: Direct service injection for data access
- **Reactive Updates**: Use `computed()` for derived state
- **URL State**: Search component syncs filters with URL query params

### Routing & SEO
- **Lazy Loading**: All feature routes use `loadComponent()` dynamic imports
- **SEO-friendly URLs**: Website routes use names (`/website/:name`) not IDs
- **Fallback Routing**: Legacy ID-based routes redirect to name-based ones
- **SSG Control**: Dynamic content marked with `data: { prerender: false }`

### Styling Architecture
- **Tailwind CSS v4**: Dark mode only with custom orange (#fb6044) primary color
- **SCSS Integration**: Global styles in `src/styles.scss` for complex components
- **Component Styles**: Inline templates preferred for maintainability
- **Class Bindings**: Use `[class.active]` instead of `ngClass`
- **Typography**: Bungee font for logo, system fonts elsewhere

## Database Integration

### Supabase Schema
```typescript
// From src/app/shared/models/database.types.ts
interface Website {
  id: number;
  name: string; // Must be unique, used in routes
  url: string;
  description: string;
  logo_url?: string;
  created_at: string;
  tags?: Tag[]; // Populated via join
}

interface Tag {
  id: number;
  name: string;
  slug: string; // Used in URLs for SEO
  created_at: string;
}
```

### Data Access Patterns
- **All operations**: Through centralized `SupabaseService`
- **Relationships**: Use nested selects: `websites_tags(tags(*))`
- **Filtering**: Multi-tag search with OR logic in computed signals
- **Environment**: Public anon keys in environment files (safe pattern)

## Development Workflows

### Build Commands
- `npm start` - Development server with hot reload on port 4200
- `npm run build` - Production SSG build
- `npm test` - Karma/Jasmine unit tests
- `npm run serve:ssr:powerfulwebsites` - Serve SSR build locally

### Critical Development Patterns
- **Component Loading States**: Always implement skeleton loading with `aria-label`
- **Error Boundaries**: Handle missing data with fallback UI states
- **Accessibility**: ARIA labels, focus management, semantic HTML required
- **Mobile-first**: All components must work on mobile before desktop

## File Organization
```
src/app/
├── core/services/          # Singleton services (Supabase only)
├── features/              # Lazy-loaded feature components
│   ├── home/              # Homepage with featured websites
│   ├── search/            # Advanced filtering with URL sync
│   └── website-detail/    # Name-based dynamic routing
├── shared/
│   ├── components/        # Reusable UI (header, footer, cards)
│   └── models/           # TypeScript interfaces for Supabase
└── app.config.ts         # Zone-less change detection config
```

## Component Communication Patterns
- **Parent to Child**: Input signals (`input()`)
- **Child to Parent**: Output functions (`output()`)
- **URL State**: Router query params for search filters
- **Service State**: Shared signals in services for global state

Remember: This project prioritizes modern Angular patterns. Always use signals, standalone components, and new control flow (`@if`, `@for`, `@switch`). Zone-less change detection requires signal-based reactivity.
