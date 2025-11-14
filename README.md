# Guesthouse Booking Backend

This package contains the Express + Prisma backend that powers the Guesthouse LIFF booking flow.

## Available scripts

- `npm install` - install dependencies
- `npm run dev` - start local development server with ts-node-dev
- `npm run build` - compile TypeScript to `build/`
- `npm start` - run compiled server (after `npm run build`)
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - apply migrations in deployment environments
- `npm run prisma:seed` - seed baseline room data with the default rooms

## Prisma workflow

1. `npx prisma db push` or `npx prisma migrate dev --name init` to sync the schema locally once a PostgreSQL URL is available.
2. Run `npm run prisma:seed` after the database is ready to populate the three room types (single / double / family).
3. Use `npm run prisma:migrate` inside Render once migrations should be applied to production.

## Environment variables

Duplicate `.env.example` -> `.env` and fill in the values for:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - optional server port (defaults to 4000)
- `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET`, `HOST_OWNER_USER_ID` - required for LINE Messaging notifications; if omitted, the API runs but skips push messages

Further implementation details (API routes, booking validation, and LINE notifications) will be added in the upcoming steps.
