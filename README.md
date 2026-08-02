<a name="readme-top"></a>

# 📄 DocDocGo

A full-stack **AI-powered multi-tenant SaaS document management and analysis platform** built with **Next.js, TypeScript, Prisma, PostgreSQL, Clerk Authentication, Google Gemini, and Vercel Blob Storage**.

DocDocGo enables organizations to securely upload, version, analyze, and interact with documents using AI-powered summarization, sentiment analysis, and contextual question answering. The platform provides organization-based workspaces, role-based access control, secure cloud storage, and intelligent document insights through Google Gemini.

🌐 **Live Demo:** https://doc-doc-go.vercel.app/

# Table of Contents

<!--ts-->

* [Implementation](#implementation)

  * [Authentication](#1-authentication)
  * [Dashboard](#2-dashboard)
  * [Document Upload](#3-document-upload)
  * [AI Document Analysis](#4-ai-document-analysis)
  * [Invite Members](#5-invite-members)
  * [Switch Organizations](#6-switch-organizations)
* [Features](#features)
* [Technologies & Frameworks](#technologies--frameworks)
* [Project Structure](#project-structure)
* [System Architecture](#system-architecture)
* [How It Works](#how-it-works)
* [Environment Variables](#environment-variables)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Database Setup](#database-setup)
* [Run Locally](#run-locally)
* [Deployment](#deployment)
* [Security](#security)
* [Future Improvements](#future-improvements)

<!--te-->

# Implementation

## 1. Authentication

Secure authentication powered by **Clerk**, supporting organization-based workspaces and role-based access control.

Users can:
* Sign up and sign in securely.
* Create organizations.
* Join organizations through invite links.
* Manage members with organization-specific permissions.

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/600f5565-1f63-4f51-a968-1b5c909263af"/>
</p>

## 2. Dashboard

Each organization has an isolated workspace where members can securely manage documents.

Features include:
* View uploaded documents
* Access AI reports
* Delete documents
* Organization-specific storage

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/001009fe-4999-4976-934d-1ff1bddd5ae3"/>
</p>

## 3. Document Upload

Supported formats:
* PDF
* DOCX
* TXT
* Markdown

Uploaded files are securely stored using **Vercel Blob Storage**.

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/398212c2-f0ed-4a3d-9334-25ea6152d755"/>
</p>

## 4. AI Document Analysis

Documents are processed using **Google Gemini** to generate:
* 📄 AI-generated summaries
* 😊 Sentiment analysis
* 💬 Interactive document Q&A

The extracted text is processed server-side before being sent to Gemini.

Users can also download the generated AI report.

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/dccb174a-7c0b-4c25-b0f1-9fe53bf4192f"/>
</p>

## 5. Invite Members

Organization admins can invite new members through Clerk's organization management.

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/362fa079-aa42-4dff-8b14-6c46597bab1c"/>
</p>

## 6. Switch Organizations

Users can seamlessly switch between multiple organizations while maintaining isolated workspaces.

<p align="center">
<img width="100%" src="https://github.com/user-attachments/assets/a7a068a1-234f-4e9d-8aab-2c180d5e89e8"/>
</p>

# Features

* 🔐 Multi-tenant organization support
* 👥 Role-based access control
* 📄 Secure document upload
* ☁️ Cloud storage with Vercel Blob
* 📝 Multi-version document history
* 🤖 AI-powered document summarization
* 😊 Sentiment analysis
* 💬 Interactive document question answering
* ⚡ Server-side text extraction
* 🚀 Next.js App Router architecture
* 📥 Downloadable AI reports
* 🔄 Organization switching

# Technologies & Frameworks

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=nextdotjs\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge\&logo=shadcnui\&logoColor=white)

### Backend

![Next.js](https://img.shields.io/badge/Next.js_Route_Handlers-000000?style=for-the-badge\&logo=nextdotjs\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge\&logo=postgresql\&logoColor=white)

### Authentication

![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge)

### AI & Storage

![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge\&logo=google\&logoColor=white)
![Vercel Blob](https://img.shields.io/badge/Vercel_Blob-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Neon](https://img.shields.io/badge/Neon_PostgreSQL-00E599?style=for-the-badge&logo=neon&logoColor=white)

# Project Structure

```text
DocDocGo
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── organization/
│   ├── sign-in/
│   └── sign-up/
│
├── components/
├── lib/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
├── types/
├── middleware.ts
├── package.json
└── README.md
```

# System Architecture

```text
                     Browser
                        │
                Next.js App Router
                        │
        ┌───────────────┼──────────────┐
        │               │              │
     Clerk Auth      Prisma ORM    Gemini AI
        │               │
        │          PostgreSQL
        │
  Vercel Blob Storage
```

# How It Works
1. User signs in using Clerk.
2. Creates or joins an organization.
3. Uploads a document.
4. File is stored in Vercel Blob Storage.
5. Text is extracted on the server.
6. Google Gemini analyzes the document.
7. AI generates:

   * Summary
   * Sentiment Analysis
   * Question Answering
8. Results are displayed in the dashboard and can be downloaded.

# Environment Variables

Create a `.env` file in the project root.
```env
DATABASE_URL=
GEMINI_API_KEY=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

# Prerequisites

* Node.js 20+
* npm
* PostgreSQL
* Clerk Account
* Google AI Studio API Key
* Vercel Blob Storage Token

# Installation

Clone the repository.
```bash
git clone https://github.com/Jasz-rgb/DocDocGo.git
cd DocDocGo
```

Install dependencies.
```bash
npm install
```

# Database Setup

Generate Prisma Client.
```bash
npx prisma generate
```

Run migrations.
```bash
npx prisma migrate dev
```

(Optional) Launch Prisma Studio.
```bash
npx prisma studio
```

# Run Locally

Start the development server.
```bash
npm run dev
```

Visit
```text
http://localhost:3000
```

# Deployment

The application is deployed using a modern cloud-native stack:
* **Frontend & Backend:** **Vercel**
* **Database:** **Neon PostgreSQL**
* **Authentication:** **Clerk**
* **Cloud Storage:** **Vercel Blob Storage**
* **AI Services:** **Google Gemini**

To build the application locally:
```bash
npm run build
```

To run the production build locally:
```bash
npm start
```

> **Note:** Before deploying to Vercel, configure all required environment variables, including your Clerk credentials, Neon PostgreSQL connection string, Google Gemini API key, and Vercel Blob Storage token.

# Security

* Clerk Authentication
* Organization-based multi-tenancy
* Role-based access control
* Server-side AI processing
* Secure cloud storage
* Environment-variable-based secret management

# Future Improvements

* OCR support for scanned documents
* Semantic document search
* AI-powered document comparison
* RAG-powered document chat
* Real-time collaborative editing
* Audit logs
This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project under the terms of the MIT License.
