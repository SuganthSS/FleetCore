# FleetCore

## SPEC-001: Project Foundation & Repository Setup

- **Title**: Project Foundation & Repository Setup
- **Version**: 1.0.0
- **Date**: 2026-08-02
- **Phase**: Phase 1 - Foundation
- **Objective**: Create the complete, production-ready foundation and infrastructure for the FleetCore project across frontend, backend, ML microservice, Docker, and GitHub Actions CI/CD workflows without business logic or database models.

---

## 📝 Complete Implementation Prompt

```text
# FleetCore - Prompt 001
## Project Foundation & Repository Setup

You are a Senior Software Architect and Principal Full Stack Engineer.

Your task is to create the complete production-ready foundation for the FleetCore project.

This is NOT a prototype.
This is NOT an MVP scaffold.

Everything must follow enterprise software engineering best practices.

-------------------------------------------------------
PROJECT NAME
-------------------------------------------------------

FleetCore

AI Powered Fleet Management Platform

-------------------------------------------------------
TECH STACK (FROZEN)
-------------------------------------------------------

Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Redux Toolkit
- TanStack Query
- React Hook Form
- Zod
- Axios
- React Router
- Lucide React
- Recharts
- Socket.IO Client
- DayJS

Backend

- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.IO
- JWT
- bcryptjs
- Multer
- Winston
- Morgan
- Swagger
- Zod

ML

- Python 3.11
- FastAPI
- Scikit Learn
- XGBoost
- spaCy

Deployment

Frontend
- Vercel

Backend
- Render

ML
- Render

Database
- Neon PostgreSQL

Redis
- Upstash Redis

Storage
- Cloudinary

-------------------------------------------------------
OBJECTIVE
-------------------------------------------------------

Create the complete project foundation only.

DO NOT implement business features.

DO NOT implement authentication.

DO NOT implement APIs.

DO NOT create database models.

DO NOT create UI pages.

Only build the project infrastructure.

-------------------------------------------------------
CREATE THE FOLLOWING STRUCTURE
-------------------------------------------------------

fleetcore/

    frontend/

    backend/

    ml/

    docs/

    prompts/

    .github/

        workflows/

-------------------------------------------------------
FRONTEND
-------------------------------------------------------

Initialize a React + TypeScript + Vite application.

Configure

Tailwind CSS

Shadcn UI

Redux Toolkit

TanStack Query

React Router

Axios

Lucide

Recharts

Socket.IO Client

DayJS

React Hook Form

Zod

Create scalable folder architecture.

Example

src/

components/

layouts/

pages/

features/

hooks/

services/

store/

routes/

contexts/

types/

utils/

assets/

styles/

config/

-------------------------------------------------------
BACKEND
-------------------------------------------------------

Initialize

Node

Express

TypeScript

Prisma

Socket.IO

Swagger

Winston

Morgan

JWT packages

bcrypt

Zod

Multer

Create enterprise folder structure

src/

config/

controllers/

routes/

middlewares/

services/

repositories/

models/

interfaces/

types/

utils/

constants/

socket/

jobs/

docs/

validators/

-------------------------------------------------------
ML
-------------------------------------------------------

Create FastAPI project

api/

models/

training/

datasets/

utils/

tests/

requirements.txt

README.md

-------------------------------------------------------
CONFIGURATION
-------------------------------------------------------

Create

.editorconfig

.prettierrc

.prettierignore

.eslintrc

.gitignore

.env.example

README.md

LICENSE

-------------------------------------------------------
README
-------------------------------------------------------

Create professional README containing

Project overview

Architecture

Tech stack

Folder structure

Getting started

Development setup

Deployment overview

-------------------------------------------------------
ENVIRONMENT FILES
-------------------------------------------------------

Create sample environment variables

Frontend

Backend

ML

Only placeholders

No secrets

-------------------------------------------------------
DOCKER
-------------------------------------------------------

Create

Dockerfile

for

frontend

backend

ml

Also create

docker-compose.yml

Development only.

-------------------------------------------------------
GITHUB
-------------------------------------------------------

Create GitHub Actions workflow

Run

Lint

Build

Tests

on every push and pull request.

-------------------------------------------------------
CODE QUALITY
-------------------------------------------------------

Configure

ESLint

Prettier

Strict TypeScript

Absolute imports

Alias configuration

-------------------------------------------------------
OUTPUT REQUIREMENTS
-------------------------------------------------------

Everything must compile.

No placeholder folders.

No TODO comments.

No fake code.

Everything must be production ready.

-------------------------------------------------------
AFTER COMPLETING
-------------------------------------------------------

1. Verify everything builds successfully.

2. Fix every compile error.

3. Ensure zero TypeScript errors.

4. Ensure zero lint errors.

5. Create the first Git commit with the message:

chore: initialize FleetCore project foundation

6. Push all changes to the connected GitHub repository.

7. At the end, provide a summary of:
- Created folders
- Installed dependencies
- Configurations completed
- Any assumptions made


-------------------------------------------------------
GITHUB REPOSITORY
-------------------------------------------------------

The GitHub repository for this project already exists.

Repository URL:

https://github.com/SuganthSS/FleetCore

If the repository is not cloned locally:

1. Clone the repository.
2. Create the project inside this repository.
3. Preserve the Git history.

If it is already cloned:

Use the existing repository.

Never initialize a new Git repository.

Never overwrite Git history.

-------------------------------------------------------
GIT WORKFLOW
-------------------------------------------------------

After successfully completing the implementation:

1. Verify the project builds successfully.
2. Verify there are no TypeScript errors.
3. Verify there are no lint errors.
4. Stage all changes.
5. Create a commit using exactly:

chore: initialize FleetCore project foundation

6. Push to the origin main branch.

If push fails:

- Explain the reason.
- Do not retry destructively.
- Preserve all local commits.

Finally provide:

- Commit hash
- Branch name
- Files changed
- Build status
- Push status
```

---

## 🎯 Expected Deliverables

- **Frontend App**: React 18 + TypeScript + Vite project configured with Tailwind CSS, Redux Toolkit, TanStack Query, React Router, Socket.IO Client, Axios, Lucide React, Recharts, DayJS, React Hook Form, and Zod.
- **Backend App**: Node.js 20 + Express + TypeScript server with Prisma ORM setup, Socket.IO, Winston logger, Swagger docs, Morgan, JWT, bcryptjs, Multer, and Zod.
- **ML Engine**: Python 3.11 + FastAPI service structure with endpoint health test, Pydantic, Scikit-Learn, XGBoost, and spaCy specifications.
- **Root Configurations**: `.editorconfig`, `.prettierrc`, `.prettierignore`, `.gitignore`, `.env.example`, `docker-compose.yml`, `README.md`, `LICENSE`, and `.github/workflows/ci.yml`.

---

## 📌 Notes

- Spec-001 established the foundational infrastructure for FleetCore without introducing business logic or feature domain implementations.
