---
applyTo: "**"
---

# Libraries, Packages, and Integrations

This project uses the following libraries, packages, and integrations:

- **Tailwind CSS**: A utility-first CSS framework for rapid UI development. [Documentation](https://tailwindcss.com/docs)
  - use it for styling and layout
  - configure it to use dark mode only
  - use the `@apply` directive to create reusable styles
  - use it with SCSS for better organization
  - use it with Angular's `NgClass` and `NgStyle` directives for dynamic styling
  - create an easily to customize theme using config file, see https://tailwindcss.com/docs/theme
  - add subtle animations using Tailwind's animation utilities, see https://tailwindcss.com/docs/animation
- **Supabase**: An open-source Firebase alternative that provides a backend-as-a-service platform. [Documentation](https://supabase.com/docs)
  - use restful APIs instead of GraphQL
  - use the js client library for interacting with the database, see https://supabase.com/docs/reference/javascript/introduction
- **Angular SSG**: A static site generator for Angular applications. [Documentation](https://angular.io/ssg)
  - use it to generate static pages for better performance and SEO, but without the need for server-side rendering
