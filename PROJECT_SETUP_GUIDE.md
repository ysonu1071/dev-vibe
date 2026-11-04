# Salon Management System – Developer Setup Guide

This guide is created for the salon management project and is designed so that a developer can follow the steps from zero to a working project setup.

The project is planned as:
- Web-first architecture
- Admin dashboard web app first
- Customer website second
- Mobile apps later
- Backend APIs and database in parallel with web foundation
- MongoDB Atlas as the main database

---

## 1. Project Objective

Build a multi-branch salon management platform with the following core responsibilities:
- Salon + branch management
- Service catalog management
- Staff management
- Appointment booking and calendar
- Customer CRM
- Billing and POS
- Inventory and stock transfer
- Dashboard and analytics
- Notifications and marketing
- Mobile app support after core system is stable

---

## 2. Recommended Architecture

### Core stack
- Admin Dashboard: React + Vite + Tailwind CSS + TypeScript
- Customer Website: Next.js + Tailwind CSS + TypeScript
- Mobile Apps: React Native + Expo
- Backend: Node.js + Express.js or NestJS
- Database: MongoDB Atlas
- Real-time updates: Socket.io
- Cache/Rate-limiting: Redis
- Storage: Cloudinary / AWS S3
- Payments: Stripe / Razorpay
- Notifications: Email, SMS, WhatsApp, Push
- DevOps: Docker + GitHub Actions + Vercel/Netlify + Railway/AWS

### Best practice
Use a monorepo for the project to keep shared code, types, and configs centralized.

---

## 3. Prerequisites

Make sure the following are installed before development begins:

- Node.js 20 LTS or higher
- npm or pnpm
- Git
- VS Code
- MongoDB Atlas account
- Optional: Docker Desktop

### Check versions
```bash
node -v
npm -v
git --version
```

---

## 4. Folder Structure to Build

```text
salon-management-system/
├─ apps/
│  ├─ web-admin/
│  ├─ customer-website/
│  ├─ mobile-customer/
│  ├─ mobile-staff/
│  └─ api/
├─ packages/
│  ├─ ui/
│  ├─ config/
│  ├─ types/
│  ├─ utils/
│  └─ validation/
├─ docs/
├─ .gitignore
├─ package.json
├─ turbo.json
├─ README.md
└─ .env.example
```

---

## 5. Step-by-Step Setup

### Step 1: Create project folder
```bash
mkdir salon-management-system
cd salon-management-system
```

Status: [x] Done

### Step 2: Initialize monorepo package manager
Use npm or pnpm. Below is the recommended npm flow.

```bash
npm init -y
npm install -D turbo
```

Then create a root `package.json` with scripts. Example:

```json
{
  "name": "salon-management-system",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

Status: [x] Done

### Step 3: Create `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

Status: [x] Done

---

## 6. Create Admin Dashboard Web App

### Step 4: Create admin app
```bash
npm create vite@latest apps/web-admin -- --template react-ts
```

Then install dependencies:
```bash
cd apps/web-admin
npm install
npm install @tanstack/react-query zustand react-router-dom tailwindcss @tailwindcss/vite
```

Optional admin UI libraries:
```bash
npm install lucide-react clsx
```

### Configure Tailwind
```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add in `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Status: [x] Done

---

## 7. Create Customer Website

### Step 5: Create Next.js customer site
```bash
npx create-next-app@latest apps/customer-website --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Then run:
```bash
cd apps/customer-website
npm install
```

This app will handle:
- salon selection
- service catalog
- branch selection
- booking flow
- profile and booking history
- reviews

Status: [x] Done

---

## 8. Create Backend API

### Step 6: Setup API project
```bash
mkdir -p apps/api
cd apps/api
npm init -y
```

### Install backend dependencies
```bash
npm install express cors dotenv mongoose jsonwebtoken bcryptjs zod socket.io axios
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken
```

### Create TypeScript config
```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"]
}
```

Create source folders:
```bash
mkdir -p src/config src/controllers src/routes src/services src/models src/middleware src/utils
```

### Package scripts
Update `package.json`:
```json
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

Status: [x] Done

---

## 9. Create App Server File

Create `src/server.ts`:
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Salon API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Status: [x] Done

---

## 10. MongoDB Atlas Setup

### Step 7: Create database
- Login to MongoDB Atlas
- Create new cluster
- Create database user
- Configure network access
- Get connection string

### DB credentials to use
Username:
```text
yesdevloper_db_user
```

Password:
```text
T4eQoMrBCY1vLJgp
```

### Connection string format
```text
mongodb+srv://yesdevloper_db_user:T4eQoMrBCY1vLJgp@syeskp.adb9ocp.mongodb.net/
```

### Recommended full environment variable
```env
MONGODB_URI=mongodb+srv://yesdevloper_db_user:T4eQoMrBCY1vLJgp@syeskp.adb9ocp.mongodb.net/salon_management?retryWrites=true&w=majority
JWT_SECRET=super_secret_key_for_salon_project
JWT_REFRESH_SECRET=super_refresh_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### DB connectivity example in Node
```ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

Status: [x] Done

---

## 11. Environment Files

Create root `.env.example` file:
```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://yesdevloper_db_user:T4eQoMrBCY1vLJgp@syeskp.adb9ocp.mongodb.net/salon_management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173

# Frontend web admin
VITE_API_URL=http://localhost:5000

# Customer website
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then create actual `.env` files in each app when needed.

Status: [x] Done

---

## 12. Create Core Modules in Backend

The application should be structured around these modules:

- `auth`
- `users`
- `salons`
- `branches`
- `services`
- `appointments`
- `clients`
- `payments`
- `billing`
- `inventory`
- `staff`
- `notifications`
- `analytics`
- `reviews`
- `marketing`

### Example folder structure
```text
src/
├─ models/
│  ├─ User.ts
│  ├─ Branch.ts
│  ├─ Appointment.ts
│  ├─ Invoice.ts
│  ├─ Product.ts
│  └─ Service.ts
├─ routes/
│  ├─ auth.routes.ts
│  ├─ branch.routes.ts
│  ├─ appointment.routes.ts
│  └─ inventory.routes.ts
├─ controllers/
├─ services/
├─ middleware/
├─ utils/
└─ server.ts
```

Status: [x] Done

---

## 13. Recommended Development Flow

Follow this flow strictly so the project stays manageable:

### Milestone 1 – Authentication + Branch Foundation
- Setup monorepo
- Create admin app and customer website
- Setup backend server
- MongoDB connection
- Auth system with JWT
- Role-based access
- Salon and branch CRUD

### Milestone 2 – Booking Engine
- Service catalog
- Staff assignment
- Availability logic
- Calendar engine
- Booking flow
- Conflict prevention

### Milestone 3 – Operations
- Inventory and POS
- Billing and invoices
- Customer CRM
- Staff schedules and commissions

### Milestone 4 – Growth Features
- Reports and dashboard
- Loyalty and memberships
- Reviews and notifications
- Marketing campaigns

### Milestone 5 – Mobile and APK
- Customer app
- Staff app
- Release builds
- APK packaging

Status: [x] Done

---

## 14. Key Production Rules for the Project

These are critical for project quality:

- Never trust frontend branch selection alone
- Always validate branchId on backend
- Use RBAC and access middleware
- Keep all operations branch-aware
- Use compound indexes in MongoDB
- Use real-time updates only where necessary
- Separate admin and customer experiences
- Use modular code organization
- Build web first; app is second

Status: [x] Done

---

## 15. Recommended Local Run Commands

### Start backend
```bash
cd apps/api
npm install
npm run dev
```

### Start admin dashboard
```bash
cd apps/web-admin
npm install
npm run dev
```

### Start customer website
```bash
cd apps/customer-website
npm install
npm run dev
```

### Build all projects
```bash
npm run build
```

### Lint all projects
```bash
npm run lint
```

Status: [x] Done

---

## 16. Database Design Direction

### Core collections
- salon
- branch
- user
- service
- staff
- appointment
- clientProfile
- invoice
- product
- productStock
- inventoryMovement
- transaction
- notificationLog
- review
- commissionRule
- membership
- giftCard

### Important indexes
```js
branchId: 1,
status: 1,
createdAt: -1
```

```js
branchId: 1,
staffId: 1,
startTime: 1
```

```js
branchId: 1,
customerId: 1,
createdAt: -1
```

Status: [x] Done

---

## 17. Developer Checklist

Use this checklist while building project:

### Setup
- [x] Node installed
- [x] MongoDB Atlas created
- [x] Project folder created
- [x] Monorepo initialized
- [x] Backend created
- [x] Admin dashboard created
- [x] Customer website created
- [x] DB environment variables added

### Backend
- [ ] MongoDB connection working
- [ ] Auth routes created
- [ ] Role-based access added
- [ ] Branch middleware created
- [ ] Appointment CRUD created
- [ ] Inventory module created
- [ ] POS and invoice APIs created
- [ ] Notifications setup

### Frontend
- [ ] Admin dashboard login screen
- [ ] Branch management UI
- [ ] Staff management UI
- [ ] Service catalog UI
- [ ] Booking form UI
- [ ] Customer website pages
- [ ] Reports dashboard

### Production
- [ ] Security review
- [ ] API rate limiting
- [ ] Deployment config
- [ ] GitHub Actions
- [ ] Sentry setup
- [ ] APK build ready

Status: [ ] In progress

---

## 18. Final Recommendation

The best path is:
1. Create monorepo and core backend first
2. Create admin web app and customer website next
3. Validate booking, branch logic, inventory, billing, and staff flow
4. After stable, build mobile apps and APK

This keeps the project clean, scalable, and easier to manage for development teams.

---

## 19. Important Note for DB Connection

Use the database connection exactly like this in environment variables:

```env
MONGODB_URI=mongodb+srv://yesdevloper_db_user:T4eQoMrBCY1vLJgp@syeskp.adb9ocp.mongodb.net/salon_management?retryWrites=true&w=majority
```

This is the correct pattern for MongoDB Atlas connection string usage.

---

## 20. Conclusion

This setup ensures that the project can be started properly by any developer, with a clear path from initialization to production-ready architecture. The most important part is to follow the web-first strategy, validate the booking and branch logic early, and only then move into mobile app and APK release.

This document is intended to act as the execution guide for the project.
