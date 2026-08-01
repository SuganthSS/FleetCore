# FleetCore Database Configuration & Architecture

This document specifies the database foundation, connectivity flows, Prisma setup, and migration policies for FleetCore.

---

## 🏛️ Database Architecture

FleetCore utilizes **Neon PostgreSQL**, a serverless, multi-tenant serverless PostgreSQL database designed for scalable cloud-native workloads.

- **Primary Storage**: Neon PostgreSQL
- **ORM**: Prisma ORM v5+
- **Driver / Pooling**: Direct connection & pooled connection strings via Neon pooler (`sslmode=require`).

---

## 🔌 Connection Flow & Singleton Pattern

To prevent connection exhaustions during development due to hot reloading (Fast Refresh/ts-node-dev), standard Prisma singleton pattern is enforced.

```
       +------------------------------------+
       |       Express Node.js Server       |
       +-----------------+------------------+
                         |
             +-----------v-----------+
             |  Prisma Singleton     |
             |  (globalThis guard)   |
             +-----------+-----------+
                         |
            +------------v------------+
            |  Neon PostgreSQL DB     |
            |  (Pooling & Direct URL) |
            +-------------------------+
```

---

## ⚙️ Environment Variables

- **`DATABASE_URL`**: Pooled connection string used by the runtime application client.
- **`DATABASE_DIRECT_URL`**: Direct non-pooled connection string used for executing DDL schema migrations (`prisma migrate`).

```env
DATABASE_URL=postgresql://user:password@ep-placeholder.region.aws.neon.tech/fleetcore?sslmode=require
DATABASE_DIRECT_URL=postgresql://user:password@ep-placeholder.region.aws.neon.tech/fleetcore?sslmode=require
```

---

## 🛠️ Prisma Configuration Structure

The schema configuration is defined in `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

---

## 🚀 Future Migration Strategy

1. **Development Schema Modifications**: Add or update Prisma models in `schema.prisma`.
2. **Migration Generation**: Execute `npx prisma migrate dev --name <migration-name>` locally.
3. **Production Deployment**: Apply pending SQL migrations using `npx prisma migrate deploy` in CI/CD release pipelines.
