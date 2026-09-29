
# EchoGPT Backend

EchoGPT is a backend application for an AI-powered chat platform built with NestJS, PostgreSQL, and TypeORM. It supports user authentication, subscription management, AI provider management, chat history, web search, and administrative features.

## Features

- **Authentication:** JWT access token, refresh token, registration, login, and logout.
- **User Management:** User profiles, role-based access control, and protected routes.
- **Subscription Management:** Subscription plans, user subscriptions, request limits, and usage tracking.
- **AI Provider Management:** Manage AI providers, encrypted API keys, provider status, and health checks.
- **AI Chat:** Chat with supported AI providers, including OpenAI, Anthropic, and Google Gemini.
- **Chat History:** Store and retrieve conversation history.
- **Web Search:** AI-powered web search and search history.
- **Admin Panel:** Dashboard statistics and user management.
- **API Documentation:** Swagger/OpenAPI documentation.

## Tech Stack

- **Backend:** NestJS, Node.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT, Passport, bcrypt
- **API Documentation:** Swagger / OpenAPI
- **AI Providers:** OpenAI, Anthropic, Google Gemini

## Project Structure

```text
src/
├── auth/
├── users/
├── sessions/
├── subscriptions/
├── user-subscriptions/
├── ai-providers/
├── chat/
├── web-search/
├── admin/
├── app.module.ts
└── main.ts
```

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL
- Git

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd echogpt-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=3000

DATABASE_URL=postgresql://username:password@localhost:5432/echogpt

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

AI_PROVIDER_ENCRYPTION_KEY=your_32_byte_hex_key
```

Add any other environment variables required by your application.

**Important:** Never commit your `.env` file or expose API keys and secrets in your repository.

### 4. Set up the database

Create a PostgreSQL database named `echogpt`.

Configure the database connection using the `DATABASE_URL` environment variable.

Run the database migrations:

```bash
npm run migration:run
```

> Make sure the migration scripts are configured in `package.json` before running this command.

### 5. Start the application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

The server will run at:

```text
http://localhost:3000
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

The Swagger documentation includes API endpoints, request parameters, request bodies, response examples, error responses, and authentication requirements.

## Main API Modules

| Module | Description |
|---|---|
| Auth | Registration, login, refresh token, logout |
| Users | User profile and user operations |
| Subscriptions | Subscription plan management |
| User Subscriptions | User plan assignment and usage limits |
| AI Providers | Provider configuration and health checks |
| Chat | AI chat and conversation history |
| Web Search | Search queries and search history |
| Admin | Dashboard statistics and user management |

## Authentication

Protected endpoints require a JWT access token.

Include the token in the request header:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Admin endpoints require an authenticated user with the admin role.

## Database Design

The database uses PostgreSQL and TypeORM.

Core entities include:

- Users
- Sessions
- Subscriptions
- User Subscriptions
- AI Providers
- Chat History
- Web Searches

API usage logging can be added to track request activity and support usage analytics.

## Testing

Run the application in development mode:

```bash
npm run start:dev
```

Use Postman or Swagger UI to test the API endpoints.

## Environment Variables

Create a `.env.example` file containing placeholder values for all required environment variables.

Never include real database credentials, JWT secrets, encryption keys, or AI provider API keys.

## License

This project was developed for educational and assessment purposes.