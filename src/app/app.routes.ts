import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'visit/:website',
    loadComponent: () => import('./features/visit/visit.component').then((m) => m.VisitComponent),
    data: { prerender: false },
  },
  {
    path: 'website/:name',
    loadComponent: () =>
      import('./features/website-detail/website-detail.component').then(
        (m) => m.WebsiteDetailComponent
      ),
  },
  // Fallback for old ID-based routes
  {
    path: 'website/:id',
    loadComponent: () =>
      import('./features/website-detail/website-detail.component').then(
        (m) => m.WebsiteDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
