# Pega 25.1 Learning App - Feature Documentation

## Overview
A comprehensive Next.js-based learning platform for mastering Pega 25.1, featuring user authentication, content management, premium subscriptions, and admin controls.

**Base URL**: 
- Production: https://pega-learning-app1.vercel.app/
- Development: `http://localhost:3000`

---

## 🔐 Authentication & User Management

### User Registration
- **Route**: `/register`
- **Method**: POST to `/api/auth/register`
- **Description**: New users can create an account with name, email, and password
- **Features**:
  - Password hashing with bcrypt
  - Email validation
  - Automatic admin notification for approval requests
  - Admin email (`pegatraining.exilent2@gmail.com`) is auto-approved
- **Access**: Public

### User Login
- **Route**: `/login`
- **Method**: POST via NextAuth
- **Description**: Credentials-based authentication using NextAuth v5
- **Features**:
  - Session management
  - Approval status check (non-admin users must be approved)
  - Error handling for pending approvals
- **Access**: Public (redirects authenticated users)

### Password Reset
- **Routes**: 
  - `/forgot-password` - Request password reset
  - `/reset-password` - Complete password reset
- **API Endpoints**:
  - POST `/api/auth/forgot-password` - Sends reset email
  - POST `/api/auth/reset-password` - Resets password with token
- **Features**:
  - Email-based reset token generation
  - Token expiration handling
  - Secure password reset flow
- **Access**: Public

### Session Management
- **Provider**: NextAuth v5
- **Features**:
  - Persistent sessions
  - JWT token management
  - Session refresh
  - Protected route middleware
- **Access**: Automatic for authenticated users

---

## 📚 Learning Content Management

### Homepage / Learning Path
- **Route**: `/`
- **Description**: Main landing page with learning path overview
- **Features**:
  - Personalized welcome message for logged-in users
  - Hero section with animated background
  - Topic cards grid showing all available modules
  - Quick access to first lesson
  - Topic count and preview of sub-topics
- **Access**: Authenticated users only

### Topic Navigation Sidebar
- **Component**: `AppSidebar`
- **Description**: Collapsible sidebar navigation with full topic hierarchy
- **Features**:
  - Expandable/collapsible topic sections
  - Active page highlighting
  - User profile section at bottom
  - Sign out functionality
  - Admin controls (add/delete topics)
- **Access**: Visible to all authenticated users

### Learning Content Viewer
- **Route**: `/learn/[topicId]/[subTopicId]`
- **Component**: `TopicViewer`
- **Description**: Main content viewing interface for individual lessons
- **Features**:
  - Four content tabs:
    1. **Introduction** - Overview and basics
    2. **Explanation** - Detailed explanation with PPT download support
    3. **Implementation** - Step-by-step code/instructions
    4. **Example & Use Case** - Real-world scenarios
  - Rich HTML content rendering
  - Premium content gating
  - In-place editing for admins
- **Access**: Authenticated users (premium content requires subscription)

### Content API
- **Endpoint**: POST `/api/content`
- **Description**: Update content for sub-topics
- **Fields Supported**:
  - `title` - Sub-topic title
  - `introduction` - Introduction content
  - `explanation` - Explanation content
  - `implementation` - Implementation steps
  - `example` - Example content
  - `pptUrl` - PowerPoint file URL
- **Access**: Admin only

### Topics API
- **Endpoint**: `/api/topics`
- **Methods**:
  - POST - Create new topic section
  - DELETE - Delete topic section (cascades to sub-topics)
- **Access**: Admin only

### Sub-topics API
- **Endpoint**: `/api/subtopics`
- **Methods**:
  - POST - Create new sub-topic
  - DELETE - Delete sub-topic
- **Access**: Admin only

---

## 💎 Premium Features & Subscription

### Premium Content
- **Description**: Selected topics/sub-topics marked as premium
- **Features**:
  - `isPremium` flag on sub-topics
  - Access control based on user subscription status
  - Upgrade prompts for non-premium users
- **Access**: Requires premium subscription

### Upgrade Page
- **Route**: `/upgrade`
- **Description**: Subscription upgrade interface
- **Features**:
  - Stripe Checkout integration
  - $49 lifetime access pricing
  - Success/cancel handling
  - Session update after payment
- **Access**: Authenticated users

### Stripe Checkout
- **Endpoint**: POST `/api/subscription/checkout`
- **Description**: Creates Stripe checkout session
- **Features**:
  - One-time payment ($49.00)
  - Lifetime access model
  - Email capture
  - Success/cancel URL handling
- **Access**: Authenticated users

### Stripe Webhook
- **Endpoint**: POST `/api/webhooks/stripe`
- **Description**: Handles Stripe payment events
- **Features**:
  - Payment verification
  - Automatic premium status update
  - Webhook signature verification
- **Access**: Stripe only (webhook secret required)

### Upgrade API
- **Endpoint**: POST `/api/subscription/upgrade`
- **Description**: Manually upgrade user to premium (alternative to webhook)
- **Access**: Authenticated users

---

## 👨‍💼 Admin Features

### Admin Dashboard - User Approvals
- **Route**: `/admin/approvals`
- **Description**: Manage pending user registration approvals
- **Features**:
  - List of unapproved users
  - Approve user button
  - User details display (name, email, signup date)
  - Real-time updates
- **Access**: Admin only (`pegatraining.exilent2@gmail.com`)

### Admin Approvals API
- **Endpoint**: `/api/admin/approvals`
- **Methods**:
  - GET - Fetch pending approval requests
  - POST - Approve user registration
- **Access**: Admin only

### Content Management (Admin UI)
- **Location**: Sidebar and Topic Viewer
- **Features**:
  - **Add Topic Section**: Create new learning modules
  - **Add Sub-topic**: Add lessons to existing topics
  - **Edit Content**: In-place rich text editing
  - **Delete Topics**: Remove topic sections
  - **Delete Sub-topics**: Remove individual lessons
  - **Upload Files**: PPT file uploads via Vercel Blob
- **Access**: Admin only

### File Upload API
- **Endpoint**: POST `/api/upload`
- **Description**: Upload files (PPT, images, etc.) to Vercel Blob storage
- **Features**:
  - Unique filename generation
  - Public access URLs
  - Admin-only access control
- **Access**: Admin only

---

## 🎨 UI/UX Features

### Design System
- **Framework**: Tailwind CSS v4
- **Features**:
  - Gradient backgrounds
  - Glassmorphism effects
  - Smooth animations (Framer Motion)
  - Responsive design
  - Dark mode ready (theme colors defined)

### Animations
- **Library**: Framer Motion
- **Features**:
  - Sidebar expand/collapse animations
  - Page transitions
  - Hover effects
  - Loading states
  - Pulse animations

### Responsive Layout
- **Sidebar**: Fixed width (320px) on desktop, hidden on mobile
- **Content Area**: Flexible, max-width container
- **Grid Layout**: Responsive topic cards (1-3 columns)

### Visual Feedback
- **Active States**: Highlighted current page/topic
- **Hover Effects**: Interactive elements
- **Loading States**: Spinners and disabled states
- **Error Messages**: User-friendly error displays

---

## 🛠️ Technical Features

### Framework & Stack
- **Next.js**: Version 16.1.1 (App Router)
- **React**: Version 19.2.3
- **TypeScript**: Full type safety
- **Node.js**: Latest LTS

### Database
- **ORM**: Prisma 5.10.0
- **Database**: PostgreSQL (production) / SQLite (development)
- **Models**:
  - `User` - User accounts and authentication
  - `TopicSection` - Learning modules
  - `SubTopic` - Individual lessons

### Authentication
- **Provider**: NextAuth v5 (beta)
- **Strategy**: Credentials-based
- **Session**: JWT tokens
- **Middleware**: Route protection

### Rich Text Editing
- **Editor**: TipTap (React)
- **Features**:
  - Link support
  - Placeholder text
  - Underline formatting
  - Starter kit extensions

### File Storage
- **Provider**: Vercel Blob Storage
- **Features**:
  - Public file URLs
  - Unique filename generation
  - Admin-only uploads

### Email Service
- **Providers**: Nodemailer / Resend
- **Features**:
  - Admin notifications
  - Password reset emails
  - User approval notifications

### Payment Processing
- **Provider**: Stripe
- **Features**:
  - Checkout sessions
  - Webhook handling
  - One-time payments
  - Payment verification

---

## 📁 File Structure

### Key Directories
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── learn/             # Learning content pages
│   └── [auth-pages]/      # Login, register, etc.
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # UI components
├── lib/                   # Utilities and services
├── data/                  # Static topic data (legacy)
└── types/                 # TypeScript definitions
```

### API Routes Structure
```
/api/
├── auth/                  # Authentication endpoints
├── admin/                 # Admin operations
├── content/               # Content management
├── topics/                # Topic CRUD
├── subtopics/            # Sub-topic CRUD
├── subscription/         # Payment/subscription
├── upload/               # File uploads
└── webhooks/             # External webhooks
```

---

## 🔒 Access Control Matrix

| Feature | Public | Authenticated | Premium | Admin |
|---------|--------|--------------|---------|-------|
| Register | ✅ | ❌ | - | - |
| Login | ✅ | ❌ | - | - |
| Forgot Password | ✅ | ❌ | - | - |
| Homepage | ❌ | ✅ | - | ✅ |
| View Content | ❌ | ✅ | Premium content | ✅ |
| Upgrade | ❌ | ✅ | - | ✅ |
| Admin Dashboard | ❌ | ❌ | - | ✅ |
| Content Management | ❌ | ❌ | - | ✅ |
| User Approvals | ❌ | ❌ | - | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (production) or SQLite (development)
- Stripe account (for payments)
- Vercel Blob storage (for file uploads)

### Environment Variables
Required environment variables:
- `DATABASE_URL` - Database connection string
- `AUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application base URL
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- Email service configuration (Nodemailer/Resend)

### Running the Application
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

**Live Production Site**: https://pega-learning-app1.vercel.app/

---

## 📝 Notes

- **Admin Email**: `pegatraining.exilent2@gmail.com` has full admin privileges
- **User Approval**: New registrations require admin approval (except admin email)
- **Premium Content**: Some topics require premium subscription ($49 lifetime)
- **Database**: All content is dynamically loaded from the database
- **Authentication**: Most routes require authentication (except login/register pages)
- **File Uploads**: Admin-only feature using Vercel Blob storage
- **Payment**: Stripe integration for one-time lifetime access payments

---

## 🔄 Recent Updates
- Last deployed: 2026-01-10
- Next.js 16 with App Router
- NextAuth v5 beta
- Prisma ORM for database management
- Stripe integration for payments
- Vercel Blob for file storage
