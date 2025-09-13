---
applyTo: "**"
---

# Database Structure

This project uses Supabase as the backend service, which provides a PostgreSQL database. The database structure is designed to support the application's features and ensure data integrity.

## Tables

- **websites** (Main table to store website information)
  - `id`: int8, Primary Key
  - `name`: VARCHAR, Name of the website (UNIQUE)
  - `url`: VARCHAR, URL of the website
  - `description`: TEXT, Description of the website
  - `created_at`: TIMESTAMP, Default to current timestamp
  - `logo_url`: TEXT, URL of the website logo
  - `sources`: JSONB, Array of source objects containing information about how the website was discovered
  - `author`: JSONB, Object containing information about who added the website to the database

- **tags** (Tags for categorizing websites)
  - `id`: int8, Primary Key
  - `name`: VARCHAR, Name of the tag
  - `created_at`: TIMESTAMP, Default to current timestamp
  - `slug`: VARCHAR, Unique slug for the tag

- **websites_tags** (Join table for many-to-many relationship between websites and tags)
  - `website_id`: int8, Foreign Key referencing `websites(id)`
  - `tag_id`: int8, Foreign Key referencing `tags(id)`

## JSONB Field Specifications

### Sources Field
The `sources` field is a JSONB array containing one or more source objects. Each source object describes how the website was discovered and added to the database.

**Source Object Structure:**
- `type`: string - The type of source (e.g., "social_media", "manual", "suggestion", "scraper")
- `description`: string - Human-readable description of the source
- `url`: string (optional) - Link to the source (required for all types except "manual")
- `platform`: string (optional) - Platform name for social media sources (e.g., "twitter", "instagram", "linkedin")
- `scraper_id`: string (optional) - ID of the proprietary scraper used
- `added_at`: string - ISO timestamp of when this source was added

**Example Sources:**
```json
[
  {
    "type": "social_media",
    "description": "Found via Twitter post",
    "url": "https://twitter.com/user/status/123456789",
    "platform": "twitter",
    "added_at": "2025-09-13T10:30:00Z"
  },
  {
    "type": "scraper",
    "description": "Discovered by proprietary scraper",
    "url": "https://example.com/source-page",
    "scraper_id": "instagram_reel_scraper_v1",
    "added_at": "2025-09-13T10:30:00Z"
  },
  {
    "type": "suggestion",
    "description": "Suggested by community member",
    "url": "https://community.example.com/suggestion/456",
    "added_at": "2025-09-13T10:30:00Z"
  },
  {
    "type": "manual",
    "description": "Manually added by admin",
    "added_at": "2025-09-13T10:30:00Z"
  }
]
```

### Author Field
The `author` field is a JSONB object containing information about the person who added the website to the database.

**Author Object Structure:**
- `display_name`: string - The display name of the person (usually "Admin" or actual name)
- `url`: string - URL associated with the author (social media profile, website, etc.)
- `role`: string (optional) - Role of the author (e.g., "admin", "moderator", "contributor")

**Example Author:**
```json
{
  "display_name": "Admin",
  "url": "https://twitter.com/admin_handle",
  "role": "admin"
}
```
