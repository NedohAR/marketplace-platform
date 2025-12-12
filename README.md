# Marketplace Web Application

Modern marketplace platform built with Next.js 15, featuring user authentication, ad management, and real-time interactions.

## Tech Stack

### Core

- **Next.js**
- **TypeScript**
- **React**

### Backend & Database

- **Prisma** 
- **PostgreSQL (Neon)** 
- **NextAuth.js**
- **bcryptjs** 

### State Management & UI

- **Zustand**
- **Tailwind CSS**
- **React Icons**

### Validation

- **Zod**

## Features

### Authentication & User Management

- Secure registration and login with password hashing
- JWT-based session management (30-day sessions)
- User profiles with settings and activity history
- Per-user data isolation (view history, favorites)

### Ad Management

- Create, edit, delete, and archive ads
- Multiple image uploads with gallery view
- Ad promotion and featured listings
- Seller dashboard with statistics (views, contacts)
- Related ads and seller's other listings

### Search & Discovery

- Full-text search across titles and descriptions
- Advanced filtering (price range, location, category, condition, deal type, date)
- Sort options (newest, oldest, price, views)
- Category browsing with icons
- Search history and suggestions

### User Experience

- Favorites system with localStorage persistence
- Per-user view history (recently viewed ads)
- In-app messaging system
- Responsive design (mobile-first, works on all devices)
- Loading animations and toast notifications

### Additional Features

- Contact tracking (phone/message clicks)
- Ad statistics and analytics
- Dark theme support (settings)
- Image optimization with Next.js Image component

