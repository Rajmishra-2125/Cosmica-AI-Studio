# Cosmica AI Studio

> **Next-Generation Digital Asset Management & AI-Powered Transformation Platform**

A comprehensive SaaS productivity platform designed for creators, developers, and teams to seamlessly manage, transform, and compress digital media assets through an intelligent, unified workspace powered by AI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Routes & Endpoints](#api-routes--endpoints)
- [Core Features Detailed](#core-features-detailed)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Cosmica AI Studio** is a modern web application that empowers teams to manage digital assets efficiently. It combines the power of:

- **Next.js 16** - Modern React framework with server-side rendering
- **Cloudinary** - Advanced cloud-based image and video processing
- **Clerk** - Enterprise-grade authentication and user management
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database

The platform provides a centralized hub for all digital asset workflows, enabling users to upload, transform, compress, and optimize their media content with minimal effort.

---

## ✨ Key Features

### 1. **Social Share Studio**
- Intelligent image asset management and transformation
- Dynamic image cropping and resizing using Cloudinary's optimization engine
- Multi-format export for social media platforms
- Real-time preview and adjustments

### 2. **Video Compression Engine**
- High-efficiency video compression up to 70MB file size
- Advanced codec optimization while preserving visual quality
- Supports multiple video formats
- Progress tracking and status monitoring
- Automatic quality adjustment

### 3. **Enterprise Security**
- Clerk-powered authentication with multi-factor options
- Role-based access control (RBAC)
- Secure token management and validation
- Server-side middleware protection
- Isolated schema adapter endpoints
- Data encryption at rest and in transit

### 4. **AI-Powered Image Processing**
- **Background Removal**: Automated background removal with transparency preservation
- **Object Removal**: Generative AI-powered object removal with custom prompts
- **Image Upscaling**: Intelligent 4K upscaling to enhance image resolution
- **Smart Transformations**: Real-time preview and batch processing

### 5. **Asset Management Dashboard**
- Centralized media library with filtering and search
- Batch operations for bulk asset management
- Storage analytics and usage tracking
- Asset versioning and history

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend** | React, Next.js | 19.2.4, 16.2.6 |
| **Language** | TypeScript | 5+ |
| **Styling** | Tailwind CSS, DaisyUI | 4, 5.5.20 |
| **State Management** | Zustand | 5.0.14 |
| **Authentication** | Clerk NextJS | 7.4.2 |
| **Database** | PostgreSQL, Prisma | 8.21.0, 7.8.0 |
| **Media Processing** | Cloudinary, Next-Cloudinary | 2.10.0, 6.17.5 |
| **HTTP Client** | Axios | 1.16.1 |
| **UI Components** | Tabler Icons React | 3.44.0 |
| **Utilities** | Dayjs, Filesize, Motion | Latest |
| **Linting** | ESLint | 9+ |

---

## 📁 Project Structure

```
Cosmica-AI-Studio/
├── app/
│   ├── (app)/                          # Protected app routes (authenticated)
│   │   ├── home/                       # Dashboard and home page
│   │   ├── social-share/               # Social media asset management
│   │   └── video-share/                # Video management interface
│   ├── (auth)/                         # Authentication routes (public)
│   │   ├── sign-in/                    # Login page
│   │   └── sign-up/                    # Registration page
│   ├── api/                            # RESTful API endpoints
│   │   ├── image-upload/               # Image upload handler
│   │   ├── video-upload/               # Video upload and compression
│   │   ├── bg-remove/                  # Background removal processing
│   │   ├── object-remove/              # Object removal AI processing
│   │   ├── upscale/                    # Image upscaling service
│   │   ├── manage-image/               # Image manipulation endpoints
│   │   ├── manage-pdf/                 # PDF processing
│   │   └── videos/                     # Video library retrieval
│   ├── components/                     # Reusable UI components
│   │   └── ui/                         # Shadcn/UI components
│   ├── lib/                            # Utility functions and configs
│   ├── store/                          # Zustand state stores
│   ├── layout.tsx                      # Root layout with Clerk provider
│   ├── page.tsx                        # Landing page
│   ├── globals.css                     # Global styles and Tailwind
│   └── favicon.ico                     # App icon
├── components/                          # Global components
│   └── ui/                              # Reusable UI component library
├── prisma/
│   └── schema.prisma                   # Database schema definitions
├── public/                              # Static assets
├── types/                               # TypeScript type definitions
├── generated/                           # Auto-generated Prisma client
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── next.config.ts                       # Next.js configuration
├── postcss.config.mjs                  # PostCSS configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── eslint.config.mjs                   # ESLint rules
└── prisma.config.ts                    # Prisma configuration
```

---

## 🔌 API Routes & Endpoints

### Authentication Routes

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `/sign-in` | GET | Public | User login page |
| `/sign-up` | GET | Public | User registration page |

### Application Routes

| Route | Type | Protection | Description |
|-------|------|-----------|-------------|
| `/` | GET | Public | Landing page with feature showcase |
| `/home` | GET | Protected | Main dashboard and workspace |
| `/social-share` | GET | Protected | Social media asset studio |
| `/video-share` | GET | Protected | Video management interface |

### API Endpoints

#### **Image Management**

**POST** `/api/image-upload`
- **Purpose**: Upload and store images to Cloudinary
- **Authentication**: Required (Clerk)
- **Request Body**:
  ```json
  {
    "file": "File object (FormData)"
  }
  ```
- **Response**:
  ```json
  {
    "publicId": "string (Cloudinary public ID)"
  }
  ```
- **Limits**: Maximum 10MB file size
- **Folder**: `digi-cloudinary/images`

**POST** `/api/bg-remove`
- **Purpose**: Remove background from images using AI
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "publicId": "string (required)",
    "webhook": "string (optional - callback URL)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "publicId": "string",
    "status": "processing",
    "resultUrl": "string (transformed image URL)",
    "message": "string"
  }
  ```
- **Processing**: Asynchronous (uses eager_async)
- **Format Output**: PNG with transparency

**POST** `/api/object-remove`
- **Purpose**: Remove specific objects from images using generative AI
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "publicId": "string (required)",
    "prompt": "string (required - object description)",
    "webhook": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "publicId": "string",
    "prompt": "string",
    "status": "processing",
    "batchId": "string",
    "resultUrl": "string"
  }
  ```
- **Processing**: Asynchronous with webhook support

**POST** `/api/manage-image`
- **Purpose**: Apply transformations to existing images
- **Authentication**: Required
- **Features**: Cropping, resizing, filtering, format conversion

**POST** `/api/upscale`
- **Purpose**: Upscale images to higher resolution (4K)
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "publicId": "string (required)",
    "webhook": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "publicId": "string",
    "status": "processing",
    "batchId": "string",
    "resultUrl": "string (upscaled image URL)"
  }
  ```
- **Processing**: Asynchronous with batch tracking

#### **Video Management**

**POST** `/api/video-upload`
- **Purpose**: Upload and compress videos to Cloudinary
- **Authentication**: Required (Clerk)
- **Request Body** (FormData):
  ```json
  {
    "file": "File object (required)",
    "title": "string",
    "description": "string",
    "originalSize": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string (CUID)",
    "title": "string",
    "description": "string",
    "publicId": "string",
    "originalSize": "string",
    "compressedSize": "string",
    "duration": "number (seconds)",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
  ```
- **Features**:
  - Maximum file size: 70MB
  - Automatic quality optimization
  - Format: MP4 with auto quality
  - Metadata storage in database

**GET** `/api/videos`
- **Purpose**: Retrieve all videos from database
- **Authentication**: Not required
- **Response**: Array of video objects
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "publicId": "string",
      "originalSize": "string",
      "compressedSize": "string",
      "duration": "number",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ]
  ```
- **Sorting**: By creation date (descending)

#### **PDF Management**

**POST** `/api/manage-pdf`
- **Purpose**: Process and manipulate PDF documents
- **Authentication**: Required
- **Features**: Compression, conversion, metadata extraction

---

## 🎨 Core Features Detailed

### Social Share Studio

The Social Share Studio is designed for content creators who need to rapidly produce assets optimized for various social media platforms.

**Capabilities:**
- Automatic image cropping and resizing for platform-specific dimensions
- Real-time preview with multiple format options
- One-click export to various social media formats
- Batch processing for multiple assets
- Template management for consistent branding

**Supported Platforms:**
- Instagram (Feed, Stories, Reels)
- Twitter/X (Header, Post, Profile)
- LinkedIn (Cover, Post)
- Facebook (Cover, Post)
- TikTok (Video optimized)

### Video Compression Engine

Advanced video processing with intelligent compression algorithms.

**Processing Pipeline:**
1. File validation (size and format checks)
2. Format normalization to MP4
3. Quality analysis and optimization
4. Codec selection (H.264 for maximum compatibility)
5. Compression with quality preservation
6. Metadata extraction (duration, codec info)
7. Database persistence

**Quality Levels:**
- Auto-adjust based on source quality
- Maintains visual fidelity
- Reduces file size by 50-70%
- Supports up to 70MB files

### AI-Powered Image Processing

#### Background Removal
- Pixel-perfect edge detection
- Transparency preservation (PNG format)
- Webhook notifications for completion
- Batch processing support

#### Object Removal
- Natural language prompt support
- Generative AI-powered inpainting
- Context-aware content filling
- Multiple iteration support

#### Image Upscaling
- 4K resolution enhancement
- AI-driven super-resolution
- Detail preservation
- Batch processing capability

---

## 🗄️ Database Schema

### Video Model

```prisma
model Video {
  id             String   @id @default(cuid())           // Unique identifier
  title          String                                  // Video title
  description    String?                                 // Optional description
  publicId       String                                  // Cloudinary public ID
  originalSize   String                                  // Original file size
  compressedSize String                                  // Compressed file size
  duration       Float?                                  // Duration in seconds
  createdAt      DateTime @default(now())               // Creation timestamp
  updatedAt      DateTime @updatedAt                    // Last update timestamp
}
```

**Database**: PostgreSQL with Prisma ORM  
**Connection**: Adapter: `@prisma/adapter-pg`

---

## 🔐 Authentication & Security

### Clerk Integration

The application uses **Clerk NextJS (v7.4.2)** for robust authentication:

**Features:**
- Multi-factor authentication (MFA)
- Social login (Google, GitHub, etc.)
- Password management
- Session management
- CSRF protection
- Rate limiting

**Protected Routes:**
- All routes under `app/(app)/*` require authentication
- Public routes: `/`, `/sign-in`, `/sign-up`

**Implementation:**
```typescript
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Data Security

**Best Practices:**
- Server-side middleware validation
- Environment variable isolation
- Secure token transmission (HTTPS only)
- Input sanitization
- SQL injection prevention (via Prisma)
- CORS configuration
- Rate limiting on API endpoints

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ or v20+
- **npm/yarn/pnpm**: Latest version
- **PostgreSQL**: v12+ (local or cloud-hosted)
- **Git**: For version control

### Quick Start

#### 1. Clone Repository

```bash
git clone https://github.com/Rajmishra-2125/Cosmica-AI-Studio.git
cd Cosmica-AI-Studio
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/cosmica

# Application Environment
NODE_ENV=development
```

#### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

#### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📝 Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | string | Yes | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | string | Yes | Cloudinary API key for uploads |
| `CLOUDINARY_API_SECRET` | string | Yes | Cloudinary API secret (server-only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | string | Yes | Public Cloudinary cloud name |
| `CLERK_SECRET_KEY` | string | Yes | Clerk secret for server operations |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | string | Yes | Clerk public key for frontend |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | string | Yes | Sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | string | Yes | Sign-up page URL |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | string | Yes | Redirect after sign-in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | string | Yes | Redirect after sign-up |
| `DATABASE_URL` | string | Yes | PostgreSQL connection string |
| `NODE_ENV` | string | No | Environment (development/production) |

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run ESLint
npm run lint

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Code Quality

- **Linting**: ESLint with Next.js configuration
- **TypeScript**: Full type safety with strict mode
- **Code Formatting**: Configured for consistency
- **Pre-commit Hooks**: Recommended for linting before commits

### Database Management

```bash
# View database in GUI
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Check migrations status
npx prisma migrate status
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Connect repository
vercel link

# Set environment variables in Vercel dashboard
# Deploy
vercel --prod
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t cosmica-ai-studio .
docker run -p 3000:3000 --env-file .env.local cosmica-ai-studio
```

### Environment Setup for Production

- Use managed PostgreSQL (AWS RDS, Railway, Supabase)
- Enable HTTPS only
- Configure CORS appropriately
- Set up monitoring and logging
- Enable rate limiting
- Use CDN for static assets

---

## ✅ Best Practices

### Frontend Development

1. **Component Organization**
   - Keep components small and focused
   - Use reusable component patterns
   - Document complex components

2. **State Management**
   - Use Zustand for global state
   - Keep state as local as possible
   - Use React Context for shared data

3. **Performance**
   - Image optimization with Cloudinary
   - Code splitting and lazy loading
   - Memoization for expensive computations

### API Development

1. **Error Handling**
   - Consistent error response format
   - Proper HTTP status codes
   - Detailed error messages for debugging

2. **Security**
   - Validate all inputs
   - Authenticate protected routes
   - Sanitize user input
   - Use HTTPS only

3. **Rate Limiting**
   - Implement on upload endpoints
   - Prevent abuse
   - Return 429 for rate limits

### Database Management

1. **Schema Design**
   - Use proper data types
   - Add indexes on frequently queried fields
   - Include timestamps

2. **Query Optimization**
   - Use Prisma select for specific fields
   - Implement pagination
   - Use database indexes

3. **Backup Strategy**
   - Regular automated backups
   - Test restore procedures
   - Keep backup history

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For support, email: [your-email@example.com]  
Issues: [GitHub Issues](https://github.com/Rajmishra-2125/Cosmica-AI-Studio/issues)

---

## 🙌 Acknowledgments

- **Cloudinary** - Advanced media transformation and optimization
- **Clerk** - Authentication and user management
- **Next.js** - React framework and development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Next-generation ORM

---

## 📊 Project Status

- ✅ Initial development complete
- ✅ Core features implemented
- 🔄 Continuous improvements and optimizations
- 📋 Future enhancements: Batch operations, advanced analytics, API integrations

---

**Last Updated**: June 2, 2026  
**Language Composition**: TypeScript (94.7%), CSS (4.9%), JavaScript (0.4%)  
**Repository**: [Rajmishra-2125/Cosmica-AI-Studio](https://github.com/Rajmishra-2125/Cosmica-AI-Studio)

---

## Quick Links

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
