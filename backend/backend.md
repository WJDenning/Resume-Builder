# Backend Documentation – Resume Builder

## Overview

The backend of this Resume Builder application is built using **Node.js and Express** with a **SQLite database** for persistent local storage. It exposes a RESTful API that allows the frontend to create, read, update, and assemble resume-related data such as jobs, skills, education, awards, certifications, and full resume structures.

The backend is designed to run locally and act as a lightweight API server that supports a single-page frontend application.

---

## Technologies Used

- Node.js
- Express.js
- SQLite3
- CORS middleware
- dotenv (for environment configuration)
- Google Gemini API (for AI-powered text suggestions)

---

## Project Structure

backend/
│
├── server.js
├── db.js
│
├── routes/
│   ├── users.routes.js
│   ├── jobs.routes.js
│   ├── skills.routes.js
│   ├── education.routes.js
│   ├── certifications.routes.js
│   ├── awards.routes.js
│   ├── resume.routes.js
│   └── ai.routes.js
│
└── database/
|   |── init.sql
    └── database.sqlite

---

## Database Design

The database is relational and stores resume components in separate tables.

### Core Tables
- users
- jobs
- job_responsibilities
- skills
- education
- certifications
- awards
- resumes
- resume_items (junction table)

### Relationship Model

A resume is assembled dynamically rather than stored as a single document.

- A user has many jobs, skills, education entries, etc.
- A resume references selected items via `resume_items`

This allows flexible, customizable resume generation.

---

## API Design

The backend exposes RESTful endpoints:

### Users
- POST /api/users
- GET /api/users

### Jobs
- POST /api/jobs
- GET /api/jobs

### Skills
- POST /api/skills
- GET /api/skills

### Education / Awards / Certifications
- Standard CRUD-style endpoints

### Resume
- POST /api/resumes
- POST /api/resumes/:id/items
- GET /api/resumes/:id/build

### AI
- POST /api/ai/suggest

---

## Resume Building Logic

The `/api/resumes/:id/build` endpoint:

1. Retrieves selected resume items
2. Resolves references to jobs, skills, education, etc.
3. Queries related tables for full data
4. Aggregates everything into a structured JSON resume object
5. Returns a fully assembled resume for frontend rendering

This allows dynamic, user-specific resume generation.

---

## AI Integration (Google Gemini)

The backend integrates Google Gemini AI through the `/api/ai/suggest` endpoint.

### Purpose
- Improve resume bullet points
- Enhance clarity and professionalism
- Rewrite user-provided text for stronger impact

### Flow
1. Frontend sends raw text
2. Backend forwards prompt to Gemini API
3. Gemini returns improved text
4. Backend sends response back to frontend

---

## AI Usage in Development

Generative AI tools (ChatGPT, GitHub Copilot, and Claude Code) were used during development to assist with:

### Backend Structure
- Designing REST API layout
- Suggesting SQLite schema structure

### Code Assistance
- Generating Express route boilerplate
- Helping structure database queries

### Debugging
- Identifying routing and module import issues
- Resolving SQLite integration problems

### AI Feature Integration
- Designing prompt flow for Gemini API
- Structuring `/api/ai/suggest` endpoint logic

All AI-generated code was reviewed, tested, and modified to ensure correctness and understanding.