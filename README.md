# Role Flow Server

A role-based access control (RBAC) Express.js server built with TypeScript, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Default Admin](#default-admin)

## 🎯 Project Overview

Role Flow is a backend API server that manages user roles, permissions, and projects with a comprehensive authentication system. It supports admin-based user invitations, JWT token management, and role-based access control.

## 🛠 Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Logging:** Winston with daily rotation
- **Security:** Helmet, CORS, Rate Limiting
- **HTTP Monitoring:** Morgan
- **Code Quality:** ESLint, Prettier

## 🏗 Project Architecture

### Directory Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server initialization & error handling
├── app/
│   ├── modules/           # Feature modules (Auth, User, Project, Invite)
│   │   ├── Auth/
│   │   │   ├── auth.model.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.constant.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.route.ts
│   │   ├── User/
│   │   ├── Project/
│   │   └── Invite/
│   └── routes/            # Route aggregation
├── config/                # Configuration files
│   ├── config.ts          # Environment config
│   └── cors.config.ts     # CORS settings
├── errors/                # Error handling
│   ├── api-error.ts       # Custom error class
│   └── handlers/          # Error handlers for different error types
├── logger/                # Logging setup
│   ├── app.logger.ts      # Winston logger
│   └── request.logger.ts  # Morgan HTTP logger
├── middlewares/           # Express middlewares
│   ├── global-error-handler.ts
│   ├── validate-auth.ts
│   ├── validate-request.ts
│   ├── rate-limiter.ts
│   └── not-found.ts
├── seeds/                 # Database seeders
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

### Module Architecture (Feature-Based)

Each module follows this structure:

```
Module/
├── module.model.ts        # Mongoose schema & model
├── module.interface.ts    # TypeScript interfaces
├── module.constant.ts     # Constants & enums
├── module.validation.ts   # Zod validation schemas
├── module.service.ts      # Business logic
├── module.controller.ts   # Route handlers
└── module.route.ts        # Route definitions
```

### Error Handling Flow

```
Request → Route Handler (catchAsync)
         ↓
Service Layer (Business Logic)
         ↓
Error Thrown
         ↓
Global Error Handler
         ↓
Error Type Classification
├── ZodError → handleZodError
├── ValidationError → handleValidationError
├── CastError → handleCastError
├── Duplicate (11000) → handleDuplicateError
├── ApiError → Custom error response
└── Generic Error → Default error response
```

### Authentication Flow

```
Login Request
     ↓
Validate Credentials (bcrypt compare)
     ↓
Generate JWT Tokens (access & refresh)
     ↓
Set Secure Cookies
     ↓
Return Tokens

Protected Route Request
     ↓
Extract Token (Cookie or Authorization header)
     ↓
Verify JWT Token
     ↓
Fetch User from Database
     ↓
Validate User Status & Role
     ↓
Attach User to Request
     ↓
Proceed to Handler
```

## 📦 Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd role-flow-server
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables** (see [Environment Variables](#environment-variables))

```bash
cp .env.sample .env
```

4. **Start the server**

```bash
# Development mode with hot reload
pnpm dev

# Production build
pnpm build

# Run built application
pnpm start
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=mongodb://localhost:27017
DB_NAME=role_flow

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_PASS_RESET_SECRET=your_password_reset_secret_here

# JWT Expiration
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_PASS_RESET_EXPIRES_IN=15m

# Security
BCRYPT_SALT_ROUNDS=10

# SMTP (Optional - for email)
SMTP_EMAIL_USER=your_email@gmail.com
SMTP_EMAIL_PASS=your_app_password
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint               | Description                       | Auth Required |
| ------ | ---------------------- | --------------------------------- | ------------- |
| POST   | `/login`               | User login with email & password  | ❌            |
| POST   | `/invite`              | Admin invites user (role-based)   | ✅ ADMIN      |
| POST   | `/register-via-invite` | User registers using invite token | ❌            |

### Users (`/api/users`)

| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| GET    | `/`           | Get all users      | ✅ ADMIN      |
| PATCH  | `/:id/role`   | Update user role   | ✅ ADMIN      |
| PATCH  | `/:id/status` | Update user status | ✅ ADMIN      |

### Projects (`/api/projects`)

| Method | Endpoint | Description                  | Auth Required |
| ------ | -------- | ---------------------------- | ------------- |
| GET    | `/`      | Get all projects             | ❌            |
| POST   | `/`      | Create project               | ❌            |
| PATCH  | `/:id`   | Update project               | ✅ ADMIN      |
| DELETE | `/:id`   | Delete project (soft delete) | ✅ ADMIN      |

## ✨ Features

### Authentication & Authorization

- ✅ JWT-based authentication (access & refresh tokens)
- ✅ Role-based access control (RBAC)
- ✅ Admin-based user invitation system
- ✅ Secure password hashing with bcrypt
- ✅ Token stored in HTTP-only cookies
- ✅ Token extraction from cookies or Authorization header

### User Management

- ✅ User registration via invite
- ✅ User status management (ACTIVE/INACTIVE)
- ✅ User role management (ADMIN/MANAGER/STAFF)
- ✅ Admin user auto-seeding on startup

### Project Management

- ✅ Create, read, update, delete projects
- ✅ Soft delete with status tracking (ACTIVE/ARCHIVED/DELETED)
- ✅ Project ownership tracking via createdBy field
- ✅ Timestamp tracking (createdAt/updatedAt)

### Invite Management

- ✅ Generate invitation tokens (32-byte hex)
- ✅ 24-hour token expiration
- ✅ Accept/reject invite tracking
- ✅ Role assignment during invite

### Error Handling

- ✅ Centralized error handling with typed responses
- ✅ Zod validation error formatting
- ✅ MongoDB error mapping (validation, cast, duplicate)
- ✅ Comprehensive error stack traces in development
- ✅ Custom ApiError class with status codes

### Security

- ✅ Helmet security headers (HSTS, noSniff, referrerPolicy)
- ✅ CORS with origin whitelist
- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Request IP extraction
- ✅ Cookie security (httpOnly, secure, sameSite:strict)
- ✅ Password hashing with bcrypt
- ✅ XPoweredBy header removal

### Logging

- ✅ Winston logger with multiple transports
- ✅ Daily rotating log files by level (error, warn, info, http)
- ✅ Colored console output for development
- ✅ Morgan HTTP request logging
- ✅ Date formatting with date-fns
- ✅ ANSI color stripping for file logs

### Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint with TypeScript support
- ✅ Prettier code formatting
- ✅ Compression middleware
- ✅ Request payload size limiting (16kb for JSON)
- ✅ Request validation middleware

## 👤 Default Admin

The server automatically seeds an admin user on startup if one doesn't exist:

- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Role:** `ADMIN`
- **Status:** `ACTIVE`

> ⚠️ **Important:** Change the default admin password immediately in production!

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure environment variables by creating `.env` file

3. Start the server:

   ```bash
   pnpm dev
   ```

4. The API will be available at `http://localhost:3000`

5. Check server status at `GET http://localhost:3000/`

## 📝 License

MIT

## 👨‍💻 Author

Ibrahim Khalil

- Email: iibrahiim.dev@gmail.com
- Website: https://iibrahim-dev.vercel.app/
