# Ticket Tracker

A small full-stack Ticket Tracker application built with a C# ASP.NET Core backend and a Next.js frontend.

## Project Structure

- `TicketTracker.Api/` - ASP.NET Core backend
- `frontend/` - Next.js frontend
- `TicketTracker.sln` - .NET solution

## Prerequisites

- .NET SDK
- Node.js LTS
- npm

## Running the Backend

From the project root:

```bash
cd TicketTracker.Api
dotnet run
```

The backend provides:

```text
GET /health
```

A successful request returns:

```text
Healthy
```

with HTTP status `200 OK`.

## Running the Frontend

From the project root:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

## Tests

Automated tests will be added in a later milestone.

## Milestone 0 Status

- [x] ASP.NET Core backend runs
- [x] `GET /health` returns `200 OK`
- [x] Next.js frontend runs
- [x] README created
- [ ] Automated tests