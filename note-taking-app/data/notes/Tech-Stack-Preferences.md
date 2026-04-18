---
title: Tech Stack Preferences
tags:
  - tech-stack
  - development
  - tools
created: '2026-04-12T00:00:00.000Z'
updated: '2026-04-12T00:00:00.000Z'
---

# Tech Stack Preferences

## Backend (Priority Order)

### 1. Python 🐍
**When to use**: REST APIs, ML projects, data processing
- **FastAPI** - Async-first, great performance
- **Django 5.1** - Full async support now (see [[Tech-Research-2026]])
- **Libraries**: SQLAlchemy, Pydantic, asyncio

### 2. Node.js/TypeScript
**When to use**: Real-time apps, microservices
- **Next.js 16** - Stable PPR, React Server Components
- **Express** - Simple APIs
- **NestJS** - Enterprise architecture

### 3. Go
**When to use**: High-performance APIs, microservices
- **Go 1.23** - Improved GC, hybrid write barrier
- **Gin/Echo** - Web frameworks
- **gorilla/mux** - Routing

### 4. Kotlin/Spring Boot
**When to use**: Enterprise Java ecosystem
- **Spring Boot 4.0** - First-class Kotlin support
- **WebFlux** - Reactive programming
- **Kotlin Coroutines** - Structured concurrency

## Frontend (Priority Order)

### 1. React/Next.js
- **React 19** - Stable Server Components, `use()` hook
- **Next.js 16** - Partial Prerendering, cache components
- **State**: Zustand, Jotai, or React Query

### 2. Vue/Nuxt
- **Vue 3.4+** - Computed property stability
- **Nuxt** - Full-stack framework

### 3. Native Mobile
- **Swift/SwiftUI** - iOS (@Observable macro in iOS 18)
- **Kotlin/Compose** - Android (stability patterns)

## Databases

### 1. PostgreSQL
**Primary choice** for relational data
- **PostgreSQL 18** - AIO subsystem for I/O performance
- **uuidv7()** - Timestamp-ordered UUIDs
- **JSONB** - Flexible document storage

### 2. SQLite
- Local development
- Embedded databases
- Mobile apps

### 3. Redis
- Caching layer
- Session storage
- Pub/sub for real-time

## Infrastructure

- **Vercel** - Next.js deployment
- **AWS/Cloudflare** - CDN, storage
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## Related Notes

- [[JayamAirways-Profile]] - Full technical philosophy
- [[Tech-Research-2026]] - Latest findings from March 2026 research
