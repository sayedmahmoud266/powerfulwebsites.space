---
applyTo: "**"
---

# Database Structure

This project uses Supabase as the backend service, which provides a PostgreSQL database. The database structure is designed to support the application's features and ensure data integrity.

## Tables

- **websites** (Main table to store website information)
  - `id`: int8, Primary Key
  - `name`: VARCHAR, Name of the website
  - `url`: VARCHAR, URL of the website
  - `description`: TEXT, Description of the website
  - `created_at`: TIMESTAMP, Default to current timestamp
  - `logo_url`: TEXT, URL of the website logo

- **tags** (Tags for categorizing websites)
  - `id`: int8, Primary Key
  - `name`: VARCHAR, Name of the tag
  - `created_at`: TIMESTAMP, Default to current timestamp
  - `slug`: VARCHAR, Unique slug for the tag

- **websites_tags** (Join table for many-to-many relationship between websites and tags)
  - `website_id`: int8, Foreign Key referencing `websites(id)`
  - `tag_id`: int8, Foreign Key referencing `tags(id)`
