COMPLETE SALON MANAGEMENT SYSTEM

Project Plan & Technical Specification

Multi-Branch | MERN Stack | Web + Mobile

Version 1.1 | October 2026

1. Project Overview
This document outlines the complete plan for building a production-ready, multi-branch Salon Management System using the MERN stack (MongoDB, Express.js, React, Node.js) along with React Native for mobile applications.

The system enables a salon owner to manage multiple branches/locations from a single platform. It includes a powerful admin dashboard, customer-facing website, and mobile apps for both customers and staff.

1.1 Target Users & Interfaces
Interface	Technology	Primary Users	Purpose
Admin Dashboard	React + Vite + Tailwind	Owner / Manager	Full control, reports, multi-branch settings
Customer Website	Next.js	Clients	Online booking, profile, history
Mobile Apps	React Native (Expo)	Clients + Staff	Booking + daily operations
2. Multi-Branch Support (Core Capability)
Multi-branch support is treated as a first-class feature from day one. The system is designed so that a single owner account can manage multiple physical locations with independent operations while maintaining centralized control and reporting.

2.1 Multi-Branch Feature Matrix
Feature	Description	Priority
Multi-Branch Management	Create, edit, activate/deactivate multiple branches under one owner account	Must
Branch-specific Services	Different service menu, prices, and durations per branch	Must
Branch-specific Staff	Staff can be assigned to one or multiple branches	Must
Independent Calendars	Real-time availability and booking calendar per branch	Must
Branch Inventory	Separate stock tracking per branch + stock transfer between branches	Must
Branch-wise POS & Billing	All invoices and sales are tied to a specific branch	Must
Role-based Branch Access	Owner sees all branches; Manager/Receptionist sees only assigned branches	Must
Consolidated Dashboard	Owner can view total revenue and switch between individual branch views	Must
Customer Multi-Branch Booking	Customers can select any branch while booking an appointment	Must
Cross-branch Reporting	Compare performance metrics between branches	Should
Staff Transfer	Move staff or allow multi-branch staff assignments	Should
3. Technology Stack
3.1 Backend
Node.js + Express.js (or NestJS for stronger structure)
MongoDB + Mongoose ODM
JWT + Refresh Tokens + Role-based Access Control
Socket.io for real-time calendar updates (rooms scoped by branchId)
Cloudinary / AWS S3 for media storage
Razorpay / Stripe for payments
Nodemailer + Twilio / WhatsApp Business API for notifications
Redis (recommended) for caching, sessions, and rate limiting
3.2 Frontend (Web)
Admin Dashboard: React 18/19 + Vite + Tailwind CSS + shadcn/ui
Customer Website: Next.js 14+
State Management: TanStack Query + Zustand (or Redux Toolkit)
Calendar: FullCalendar or custom drag-and-drop solution
3.3 Mobile
React Native + Expo
React Navigation + shared TypeScript types with backend
3.4 DevOps & Tooling
TypeScript across the entire stack (strongly recommended)
Monorepo: Turborepo or Nx for shared packages
Docker + Docker Compose
MongoDB Atlas
CI/CD: GitHub Actions | Hosting: Vercel/Netlify (frontend) + Railway/Render/AWS (backend)
4. Core Modules
The system is organized into the following functional modules:

Authentication & User Management (roles: Super Admin, Owner, Manager, Stylist, Receptionist, Customer)
Salon & Branch Management
Services & Categories (global + branch-specific overrides)
Appointment Scheduling & Online Booking (real-time, conflict prevention)
Client CRM (history, notes, formulas, preferences, allergies)
POS & Billing (services + retail, tips, packages, memberships, tax support)
Inventory / Stock Management (per branch + transfers)
Staff Management (schedules, commissions, performance, attendance)
Notifications (Email, SMS, WhatsApp, Push)
Marketing & Loyalty (packages, memberships, gift cards, campaigns)
Analytics & Reports (consolidated + branch-wise)
Reviews & Ratings
5. Database Design – Multi-Branch Focus
Every operational document (Appointment, Invoice, Inventory movement, etc.) carries a branchId. Key collections:

Salon – Owner-level entity
Branch – Linked to Salon (name, address, working hours, status)
User – Contains branchIds array + role
Service – Can be global or branch-specific
StaffAvailability – Per branch
Appointment – Must include branchId + staffId + serviceId
ClientProfile – Shared across branches with branch-specific history
Product / Inventory / ProductStock – Stock levels per branch
Transaction / Invoice – Always tied to a branch
Package / Membership / GiftCard
Review, NotificationLog, CommissionRule
Important: Use compound indexes on (branchId + date), (branchId + staffId), (branchId + status), etc. for performance.

6. Development Phases & Timeline
Realistic timeline for a solid v1 (solo developer or small team): 3.5 – 5 months.

Phase 1 – Foundation + Multi-Branch Core (4 weeks)
Project setup (monorepo, TypeScript, CI)
Authentication system (JWT, roles, refresh tokens)
Salon + Branch CRUD
Staff assignment to branches
Service management (global services + branch overrides)
Phase 2 – Booking Engine (3–4 weeks)
Branch selection in booking flow
Independent real-time availability engine per branch
Conflict prevention & slot locking
Admin + Customer calendars
Customer website + mobile booking with branch choice
Phase 3 – Operations (4 weeks)
Client CRM with cross-branch history
Branch-wise POS & invoicing
Inventory management + stock transfer between branches
Staff schedules, attendance & commission tracking
Phase 4 – Analytics & Advanced Features (3 weeks)
Consolidated + branch-wise dashboards
Cross-branch comparison reports
Packages, Memberships, Gift Cards, Loyalty
Notifications, Marketing campaigns, Reviews
Phase 5 – Polish & Production (2–3 weeks)
Mobile apps (Customer + Staff)
Security hardening, rate limiting, audit logs
Testing (unit, integration, e2e)
Deployment, monitoring (Sentry), documentation
7. Architecture Notes for Multi-Branch
Always filter data by branchId on the backend — never trust the frontend.
Use middleware to verify that the logged-in user has access to the requested branch.
Socket.io rooms must be scoped by branchId for real-time updates.
Owner role can access all branches; other roles are restricted to assigned branches only.
Start with a modular monolith. Extract microservices later only if needed (booking, payment, notification services).
8. Feature Priority Summary
Must Have (MVP)
Multi-branch management & branch selection
Online booking with real-time slots per branch
Staff calendar & availability
Client history & CRM
Basic POS & invoicing
Role-based access control
Email / SMS notifications
Should Have
Inventory + stock transfer
Commission tracking
Packages / Memberships / Gift Cards
Analytics & cross-branch reports
Mobile apps (Customer + Staff)
Nice to Have
WhatsApp Business integration
AI-powered upselling / rebooking suggestions
Advanced marketing automation
Multi-language support
9. Immediate Next Steps
Finalize scope: Confirm single-owner multi-branch (current plan) or full multi-tenant SaaS.
Decide on TypeScript (recommended) vs plain JavaScript.
Set up the monorepo structure and authentication system first.
Design detailed MongoDB schemas with proper indexes.
Build the appointment availability engine carefully (this is the most critical core logic).
Create UI wireframes in Figma for Admin Dashboard, Customer Website, and Mobile Apps.
— End of Document —

This plan can be updated as requirements evolve. Keep this document as the single source of truth for the project.