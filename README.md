# FleetCore - AI Powered Fleet Management Platform

FleetCore is an enterprise-grade, AI-powered fleet management platform designed for real-time tracking, predictive maintenance, route optimization, driver behavior analytics, and operational efficiency.

---

## 🏗️ System Architecture

FleetCore follows a modern microservices-inspired / modular architecture:

```
                      +-------------------+
                      |   React Frontend  |
                      |   (Vite + TS)     |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
  +--------------------+                +--------------------+
  | Node.js / Express  | <--- HTTP ---> |   FastAPI ML Engine|
  | Backend (REST/WS)  |                |   (Python/XGBoost) |
  +----------+---------+                +--------------------+
             |
     +-------+-------+
     |               |
     v               v
+----------+   +-----------+
| Neon PG  |   | Upstash   |
| Database |   | Redis     |
+----------+   +-----------+
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React
- **State Management**: Redux Toolkit, TanStack Query (React Query)
- **Forms & Validation**: React Hook Form, Zod
- **Real-time & Charts**: Socket.IO Client, Recharts
- **HTTP & Dates**: Axios, DayJS

### Backend
- **Runtime & Framework**: Node.js 20, Express.js, TypeScript
- **ORM & Database**: Prisma ORM, PostgreSQL (Neon)
- **Caching & Real-time**: Upstash Redis, Socket.IO
- **Auth & Security**: JWT, bcryptjs
- **File Upload & Docs**: Multer, Swagger UI (`swagger-ui-express`)
- **Logging & Validation**: Winston, Morgan, Zod

### Machine Learning
- **Framework & Runtime**: Python 3.11, FastAPI, Uvicorn
- **ML Core**: Scikit-learn, XGBoost, spaCy, Pandas, NumPy
- **Validation**: Pydantic

---

## 📁 Repository Structure

```
fleetcore/
├── frontend/             # React + Vite + TypeScript application
│   ├── src/
│   │   ├── assets/       # Static media assets
│   │   ├── components/   # Reusable UI components (Shadcn UI)
│   │   ├── config/       # Frontend configuration & env rules
│   │   ├── contexts/     # React Context providers
│   │   ├── features/     # Feature-based domain modules
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Application page layouts
│   │   ├── pages/        # Route page views
│   │   ├── routes/       # React Router setup
│   │   ├── services/     # API services & Axios instances
│   │   ├── store/        # Redux Toolkit store & slices
│   │   ├── styles/       # Global CSS & Tailwind styles
│   │   ├── types/        # TypeScript interfaces & types
│   │   └── utils/        # Utility helper functions
│   └── ...
├── backend/              # Node.js + Express + TypeScript service
│   ├── src/
│   │   ├── config/       # Environment & database configs
│   │   ├── constants/    # System constants & enums
│   │   ├── controllers/  # Request handler controllers
│   │   ├── docs/         # OpenAPI / Swagger specs
│   │   ├── interfaces/   # TS Interfaces
│   │   ├── jobs/         # Background worker jobs
│   │   ├── middlewares/  # Express middlewares (error, auth, validation)
│   │   ├── models/       # Database models / Prisma bindings
│   │   ├── repositories/ # Data access layer repositories
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Business logic services
│   │   ├── socket/       # Socket.IO event handlers & gateways
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Logger, helpers & utilities
│   │   └── validators/   # Zod schema validators
│   └── ...
├── ml/                   # FastAPI Machine Learning Microservice
│   ├── api/              # FastAPI routers & endpoints
│   ├── datasets/         # Training & validation datasets
│   ├── models/           # Trained model artifacts (.pkl, .json)
│   ├── tests/            # Pytest suite for ML endpoints
│   ├── training/         # Model training & pipeline scripts
│   └── utils/            # ML preprocessing & evaluation helpers
├── docs/                 # System documentation & specs
├── prompts/              # AI prompt engineering templates
├── docker-compose.yml    # Development multi-container environment setup
└── README.md             # Project documentation
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optional for full stack containerized setup)

### Setup via Docker Compose
```bash
docker-compose up --build
```

### Setup Manually

#### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

#### 2. Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

#### 3. ML Engine
```bash
cd ml
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

---

## 🚢 Deployment Overview

- **Frontend**: Deployed on **Vercel**
- **Backend**: Deployed on **Render**
- **ML Engine**: Deployed on **Render**
- **Database**: Managed **Neon PostgreSQL**
- **Redis**: Managed **Upstash Redis**
- **Storage**: **Cloudinary**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
