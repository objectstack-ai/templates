# @templates/blog

A minimal blog and content management application template built on [@objectstack/spec](https://github.com/objectstack-ai/hotcrm) v3.0.8.

## Overview

This template provides the foundation for a blog or CMS application with:

- **Categories** — hierarchical content categories with slug support
- **Posts** — rich blog posts with draft/review/publish workflow, author, and category
- **Comments** — reader comments with pending/approved/rejected moderation

## Business Objects

| Object | Description |
|--------|-------------|
| `category` | Blog category (name, slug, parent category lookup) |
| `post` | Blog post (title, slug, content, status, published_at, author, category) |
| `comment` | Reader comment (content, author info, post lookup, moderation status) |

## Getting Started

```bash
# From the repository root
pnpm install

# Run in development mode
pnpm --filter @templates/blog dev

# Build
pnpm --filter @templates/blog build
```

## Customization Ideas

- Add a `media` object for image/file uploads
- Add newsletter subscription to posts
- Add post scheduling (publish_at timestamp)
- Add reading time estimation
- Add SEO metadata fields (meta_title, meta_description)
