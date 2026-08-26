# TicketTracker

A full-stack ticket management application built with ASP.NET Core Web API, Entity Framework Core, PostgreSQL, and Next.js.

## Tech Stack

* **Backend:** ASP.NET Core Web API (.NET 10)
* **Database:** PostgreSQL
* **ORM:** Entity Framework Core
* **Authentication:** JWT
* **Frontend:** Next.js, React, TypeScript
* **Testing:** xUnit, Vitest, React Testing Library

## How to Run

### 1. Backend

From the project root:

```powershell
cd TicketTracker.Api
dotnet run
```

The API runs at:

```text
http://localhost:5087
```

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend should be running before using features that communicate with the API.

## Testing

### Backend tests

From the project root:

```powershell
dotnet test
```

The backend test verifies that a user cannot retrieve another user's ticket.

### Frontend tests

From the `frontend` directory:

```powershell
npm test
```

The frontend test verifies registration form validation when required fields are empty.

## Completed Milestones

* **Milestone 1:** Backend foundation and database setup
* **Milestone 2:** Authentication and ticket API
* **Milestone 3:** Frontend authentication and protected routes
* **Milestone 4:** Frontend ticket experience
* **Milestone 5:** Backend and frontend tests, README documentation, and polish

## Future Improvements

## Future Improvements and Trade-offs

With more time, I would improve the UI styling and add features such as ticket filtering and sorting. I would also add more automated tests for ticket creation and status updates. I chose to keep the implementation simple and focused on the required milestones so that the main end-to-end functionality could be completed and tested reliably.


## Authentication

Users can register and log in through the frontend. Successful login stores a JWT, which is sent with authenticated API requests. Protected ticket routes require authentication, and logging out clears the stored session.
