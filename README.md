# Kedai POS

Point-of-sale API built with **Bun**, **Elysia**, and **PostgreSQL**.

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

- API → http://localhost:3000
- OpenAPI docs → http://localhost:3000/openapi

## API Documentation & Testing

### OpenAPI / Swagger
The API documentation is automatically generated and accessible at [http://localhost:3000/openapi](http://localhost:3000/openapi).

### Insomnia
We provide a pre-configured Insomnia collection for testing. You can import the following file into Insomnia:
- [Insomnia_2026-05-08.yaml](Insomnia_2026-05-08.yaml)

**Features of the Insomnia collection:**
- **Automated Workflow**: Automatically saves the ID of newly created products, add-ons, and orders into environment variables.
- **Test Scripts**: Includes `afterResponse` scripts to verify status codes.
- **Fail Scenarios**: Includes tests for failure cases (e.g., insufficient funds).

## Local Development

Prerequisites: **Bun** and **PostgreSQL 18**.
Before run command below, make sure you already create database with name `kedai_pos`

```bash
bun install
cp .env.example .env   # then edit DATABASE_HOST / credentials as needed
bun run db:migrate
bun run dev
```

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `bun run dev`        | Start API with watch mode      |
| `bun run db:migrate` | Apply pending SQL migrations   |
| `bun run db:seed`    | Seed the database              |
| `bun run lint`       | Run ESLint                     |

## Environment Variables

All variables are defined in `.env` (copy from `.env.example`).

| Variable            | Description                          |
| ------------------- | ------------------------------------ |
| `DATABASE_USER`     | PostgreSQL username                  |
| `DATABASE_PASSWORD` | PostgreSQL password                  |
| `DATABASE_NAME`     | PostgreSQL database name             |
| `DATABASE_HOST`     | Database host (`localhost` or `db`)  |
| `DATABASE_PORT`     | Database port (default `5432`)       |
| `PORT`              | HTTP port (default `3000`)           |

> Inside Docker Compose, `DATABASE_HOST` is automatically set to `db` (the container name).

## Database Schema
You can view the database schema in [ER Diagram](https://dbdiagram.io/d/kedai-69f9a50cddb9320fdcda9d7a).

Migrations live in `migrations/` and are tracked in the `_migrations` table.

| Table                | Description                          |
| -------------------- | ------------------------------------ |
| `products`           | Menu items with auto-generated SKU   |
| `add_ons`            | Toppings and size options            |
| `product_add_ons`    | Links products to their add-ons      |
| `orders`             | Orders with status tracking          |
| `order_items`        | Line items within an order           |
| `order_item_add_ons` | Add-ons applied to an order item     |
| `payments`           | Payment records per order            |

To create a new migration, add a timestamped `.sql` file in `migrations/` and run `bun run db:migrate`.

## Project Structure

```
src/
  index.ts              # Elysia entry point
  lib/database.ts       # Database connection pool
scripts/
  migrate.ts            # Migration runner
migrations/             # SQL migration files
compose.yaml            # Docker Compose (db + migrate + app)
Dockerfile              # Production build
```
