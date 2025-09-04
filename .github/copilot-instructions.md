# Copilot Instructions for powerfulwebsites.space

## Project Overview
A curated website directory built with Angular v20+ featuring standalone components, signals-based state management, and static site generation. Uses Supabase as backend and Tailwind CSS v4 for dark-mode-only styling.

## Architecture Patterns

### Component Structure
- **Standalone Components**: All components use standalone architecture (do NOT set `standalone: true` - it's default)
- **Signal-based State**: Use `signal()`, `computed()`, and `update()` - avoid `mutate()`
- **Input/Output Functions**: Use `input()` and `output()` functions instead of decorators
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`

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

```typescript
// Pattern from src/app/core/services/supabase.service.ts
async getWebsites(): Promise<Website[]> {
  try {
    const { data, error } = await this.supabase.from('websites').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching websites:', error);
    return [];
  }
}
```

## Key Technical Decisions

### State Management
- **Local State**: Signals for component-level state
- **No Global Store**: Direct service injection for data access
- **Reactive Updates**: Use `computed()` for derived state

### Routing & Lazy Loading
- All feature components are lazy-loaded via `loadComponent()`
- Dynamic routes use parameter binding: `/website/:id`
- SSG prerendering disabled for dynamic content (`data: { prerender: false }`)

### Styling Architecture
- **Tailwind CSS v4**: Dark mode only with custom color scheme
- **SCSS Integration**: Global styles in `src/styles.scss`
- **Component Styles**: Inline templates preferred for small components
- **Class Bindings**: Use `[class.active]` instead of `ngClass`

## Database Integration

### Supabase Schema
```typescript
// From src/app/shared/models/database.types.ts
interface Website {
  id: number;
  name: string;
  url: string;
  description: string;
  logo_url?: string;
  created_at: string;
  tags?: Tag[];
}
```

### Data Access Pattern
- All database operations through `SupabaseService`
- RESTful API calls (not GraphQL)
- Joined queries for relationships: `websites_tags(tags(*))`

## Development Workflows

### Build Commands
- `npm start` - Development server with hot reload
- `npm run build` - Production build with SSG
- `npm test` - Unit tests with Karma/Jasmine

### Environment Configuration
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
- Supabase keys are public (anon keys, not secrets)

## Component Communication
- **Parent to Child**: Input signals (`input()`)
- **Child to Parent**: Output functions (`output()`)
- **Service Communication**: Shared services with signal-based state

## Accessibility Requirements
- All components must include proper ARIA labels
- Focus management with `focus-visible` styles
- Skip links for navigation (`class="skip-link"`)
- Alt text for all images, including fallback states

## Performance Optimizations
- **Zone-less Change Detection**: `provideZonelessChangeDetection()`
- **Lazy Loading**: All feature routes lazy-loaded
- **Image Optimization**: Use `loading="lazy"` attributes
- **Tree Shaking**: Standalone components reduce bundle size

## File Organization
```
src/app/
├── core/services/          # Singleton services (Supabase)
├── features/              # Lazy-loaded feature modules
├── shared/
│   ├── components/        # Reusable UI components
│   └── models/           # TypeScript interfaces
└── app.config.ts         # Root application configuration
```

Remember: This project prioritizes modern Angular patterns over legacy approaches. Always use signals, standalone components, and the new control flow syntax (`@if`, `@for`, `@switch`).
