# SupportFlow

SupportFlow is a frontend concept for managing customer support tickets.

The application allows support agents to create, search, filter, update, discuss, and delete customer requests through a compact dashboard interface.

## Features

- Dashboard with live ticket statistics
- Ticket search, filtering, and sorting
- Ticket creation with form validation
- Detailed ticket view
- Status and priority management
- Assignee selection
- Internal ticket comments
- Ticket deletion
- Persistent state using localStorage
- Responsive interface
- Empty and validation states

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Lucide React
- ESLint
- CSS
- localStorage

## Main User Flow

1. Open the dashboard
2. View current ticket statistics
3. Browse and filter support tickets
4. Create a new ticket
5. Assign a support agent
6. Change its status and priority
7. Add internal comments
8. Delete the ticket when necessary

## Project Structure

```text
src/
├── components/
├── context/
├── data/
├── layouts/
├── pages/
├── types/
├── App.tsx
├── App.css
└── main.tsx