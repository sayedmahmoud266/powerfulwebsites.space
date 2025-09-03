# 📡 API Documentation

This document describes the API structure and data models used in powerfulwebsites.space, which leverages Supabase as the backend service.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Rate Limiting](#rate-limiting)

## 🌐 Overview

powerfulwebsites.space uses **Supabase** as a Backend-as-a-Service (BaaS) solution, providing:

- **PostgreSQL Database**: Reliable, scalable data storage
- **RESTful API**: Auto-generated from database schema
- **Real-time subscriptions**: Live data updates
- **Row-level security**: Fine-grained access control
- **Built-in authentication**: User management system

**Base URL**: `https://[your-project-id].supabase.co/rest/v1/`

## 🔐 Authentication

### API Key Authentication

All requests require the Supabase anonymous key in the header:

```http
Authorization: Bearer [SUPABASE_ANON_KEY]
apikey: [SUPABASE_ANON_KEY]
Content-Type: application/json
```

### Service Configuration

```typescript
// src/app/core/services/supabase.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 📊 Data Models

### Website Model

```typescript
interface Website {
  id: number;
  name: string;
  url: string;
  description: string;
  logo_url: string | null;
  created_at: string;
  tags?: Tag[];
}
```

**Database Schema:**
```sql
CREATE TABLE websites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tag Model

```typescript
interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}
```

**Database Schema:**
```sql
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Website-Tag Relationship

```typescript
interface WebsiteTag {
  website_id: number;
  tag_id: number;
}
```

**Database Schema:**
```sql
CREATE TABLE websites_tags (
  website_id BIGINT REFERENCES websites(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (website_id, tag_id)
);
```

## 🔗 API Endpoints

### Websites

#### Get All Websites

```http
GET /websites?select=*,tags(*)
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Example Website",
    "url": "https://example.com",
    "description": "An amazing example website",
    "logo_url": "https://example.com/logo.png",
    "created_at": "2024-01-01T00:00:00Z",
    "tags": [
      {
        "id": 1,
        "name": "JavaScript",
        "slug": "javascript",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
]
```

#### Get Website by ID

```http
GET /websites?id=eq.1&select=*,tags(*)
```

#### Search Websites

```http
GET /websites?or=(name.ilike.*query*,description.ilike.*query*)&select=*,tags(*)
```

#### Filter by Tag

```http
GET /websites?tags.slug=eq.javascript&select=*,tags(*)
```

#### Create Website (Admin only)

```http
POST /websites
Content-Type: application/json

{
  "name": "New Website",
  "url": "https://newwebsite.com",
  "description": "Description of the new website",
  "logo_url": "https://newwebsite.com/logo.png"
}
```

#### Update Website (Admin only)

```http
PATCH /websites?id=eq.1
Content-Type: application/json

{
  "name": "Updated Website Name",
  "description": "Updated description"
}
```

#### Delete Website (Admin only)

```http
DELETE /websites?id=eq.1
```

### Tags

#### Get All Tags

```http
GET /tags?order=name
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "JavaScript",
    "slug": "javascript",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "React",
    "slug": "react",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Tag by Slug

```http
GET /tags?slug=eq.javascript
```

#### Create Tag (Admin only)

```http
POST /tags
Content-Type: application/json

{
  "name": "Vue.js",
  "slug": "vuejs"
}
```

### Website-Tag Relationships

#### Add Tag to Website (Admin only)

```http
POST /websites_tags
Content-Type: application/json

{
  "website_id": 1,
  "tag_id": 2
}
```

#### Remove Tag from Website (Admin only)

```http
DELETE /websites_tags?website_id=eq.1&tag_id=eq.2
```

## 🔍 Advanced Queries

### Complex Filtering

```typescript
// TypeScript service example
async getWebsitesByFilters(filters: {
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}) {
  let query = this.supabase
    .from('websites')
    .select(`
      *,
      tags (
        id,
        name,
        slug
      )
    `);

  // Search by name or description
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    query = query.in('tags.slug', filters.tags);
  }

  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  // Order by creation date
  query = query.order('created_at', { ascending: false });

  return query;
}
```

### Aggregation Queries

```typescript
// Get websites count by tag
async getWebsiteCountByTag() {
  return this.supabase
    .from('websites_tags')
    .select(`
      tag_id,
      tags (
        name,
        slug
      )
    `)
    .group('tag_id');
}

// Search with full-text search
async searchWebsites(query: string) {
  return this.supabase
    .from('websites')
    .select('*')
    .textSearch('name', query)
    .textSearch('description', query);
}
```

## 🚨 Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Unprocessable Entity
- **500**: Internal Server Error

### Error Response Format

```json
{
  "code": "PGRST116",
  "details": null,
  "hint": null,
  "message": "The result contains 0 rows"
}
```

### Error Handling in Services

```typescript
async getWebsites(): Promise<Website[]> {
  const { data, error } = await this.supabase
    .from('websites')
    .select(`
      *,
      tags (*)
    `);

  if (error) {
    console.error('Error fetching websites:', error);
    throw new Error(`Failed to fetch websites: ${error.message}`);
  }

  return data || [];
}
```

## 📝 Examples

### Angular Service Implementation

```typescript
import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  // Get all websites with tags
  getWebsites(): Observable<Website[]> {
    return from(
      this.supabase
        .from('websites')
        .select(`
          id,
          name,
          url,
          description,
          logo_url,
          created_at,
          tags (
            id,
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  }

  // Search websites
  searchWebsites(query: string): Observable<Website[]> {
    return from(
      this.supabase
        .from('websites')
        .select(`
          *,
          tags (*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  }

  // Get websites by tag
  getWebsitesByTag(tagSlug: string): Observable<Website[]> {
    return from(
      this.supabase
        .from('websites')
        .select(`
          *,
          tags!inner (*)
        `)
        .eq('tags.slug', tagSlug)
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  }

  // Get all tags
  getTags(): Observable<Tag[]> {
    return from(
      this.supabase
        .from('tags')
        .select('*')
        .order('name')
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  }

  // Real-time subscription
  subscribeToWebsites(callback: (payload: any) => void) {
    return this.supabase
      .channel('websites')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'websites' 
        }, 
        callback
      )
      .subscribe();
  }
}
```

### Component Usage

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../core/services/supabase.service';

@Component({
  selector: 'app-websites',
  template: `
    <div class="websites-grid">
      @for (website of websites(); track website.id) {
        <app-website-card [website]="website" />
      }
    </div>
  `
})
export class WebsitesComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  websites = signal<Website[]>([]);

  ngOnInit() {
    this.loadWebsites();
  }

  private loadWebsites() {
    this.supabaseService.getWebsites().subscribe({
      next: (websites) => this.websites.set(websites),
      error: (error) => console.error('Error loading websites:', error)
    });
  }
}
```

## ⚡ Rate Limiting

Supabase implements rate limiting based on your plan:

- **Free Plan**: 500 requests per second
- **Pro Plan**: 1,000 requests per second
- **Team Plan**: 2,500 requests per second

### Best Practices

1. **Implement caching** for frequently accessed data
2. **Use pagination** for large datasets
3. **Batch operations** when possible
4. **Monitor usage** in Supabase dashboard

## 🔄 Real-time Features

### Subscribe to Changes

```typescript
// Subscribe to all website changes
const subscription = supabase
  .channel('websites')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'websites' 
    }, 
    (payload) => {
      console.log('Change received!', payload);
      // Update your local state
    }
  )
  .subscribe();

// Unsubscribe when component is destroyed
ngOnDestroy() {
  subscription.unsubscribe();
}
```

## 📈 Performance Tips

1. **Use select()** to limit returned fields
2. **Implement pagination** with `range()`
3. **Create database indexes** for frequently queried fields
4. **Use materialized views** for complex queries
5. **Cache responses** in the frontend

## 🛡️ Security

### Row Level Security (RLS)

```sql
-- Enable RLS on websites table
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access to all users" ON websites
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow insert/update/delete only to authenticated admin users
CREATE POLICY "Allow admin modifications" ON websites
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

### API Key Security

- Never expose service role keys in frontend code
- Use anon keys for public read access
- Implement proper authentication for write operations
- Rotate keys regularly

---

For more detailed information, visit the [Supabase Documentation](https://supabase.com/docs/reference/javascript/introduction).
