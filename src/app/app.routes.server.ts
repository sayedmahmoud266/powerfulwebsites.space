import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'search',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'visit/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'website/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
