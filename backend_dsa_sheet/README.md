# DSA Sheet Backend

This backend implements the core API for a DSA Sheet web application with secure login, topic and problem management, and persistent user progress tracking.

## Architecture Overview

- Client: React or Angular front-end (not included here) communicates via REST API.
- Server: Node.js + Express handles authentication, topic and problem queries, and progress updates.
- Database: MongoDB stores users, topics, problems, and user progress.
- Deployment: designed for AWS Elastic Beanstalk, ECS, or EC2 behind a load balancer.

## System Design

### Request Flow
1. Student opens the client and submits credentials to `/api/auth/login`.
2. Server validates credentials and returns a JWT.
3. Client includes the JWT in `Authorization: Bearer <token>` for protected requests.
4. Client requests `/api/topics` and `/api/progress` to render the DSA sheet and completed items.
5. When a problem checkbox changes, client sends `/api/progress/toggle`.

### Authentication Mechanism
- JWT tokens are issued at login and valid for 7 days.
- Protected routes use `Authorization: Bearer <token>` header.
- The middleware validates the token and loads the user from MongoDB.

### Progress Tracking Data Flow
- Each completed problem is recorded in `UserProgress`.
- On login, client fetches progress to restore the student’s completed checkbox state.
- Updating a problem toggles or creates the progress record.

### Scalability Considerations
- Stateless API servers can scale horizontally behind a load balancer.
- MongoDB indexes support fast lookups for users, topics, and progress.
- Use AWS managed MongoDB alternatives like DocumentDB or Atlas for high availability.

## Database Schema

### Users
- `_id`
- `name`
- `email`
- `password`
- timestamps
- Index: `email` unique

### Topics
- `_id`
- `title`
- `slug`
- `description`
- `difficulty`
- `resources` (youtube, article, practice)
- `order`
- timestamps
- Index: `slug` unique

### Problems
- `_id`
- `topic` (ref `Topic`)
- `title`
- `description`
- `difficulty`
- `resources`
- `order`
- timestamps
- Index: compound `topic`, `order`

### UserProgress
- `_id`
- `user` (ref `User`)
- `problem` (ref `Problem`)
- `completed`
- timestamps
- Index: compound `user`, `problem` unique

## API Endpoints

### Auth
- `POST /api/auth/register` — register a student
- `POST /api/auth/login` — login and receive JWT
- `GET /api/auth/profile` — get authenticated user profile

### Topics
- `GET /api/topics` — return topics with nested problems
- `GET /api/topics/:id` — return a single topic and its problems

### Progress
- `GET /api/progress` — return the student’s saved progress
- `POST /api/progress/toggle` — mark a problem as completed or not completed

## Installation

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3. Run `npm install`.
4. Run `npm run seed` to insert example data and default student credentials.
5. Run `npm run dev` or `npm start`.

## Default Seed User
- Email: `student@example.com`
- Password: `Password123`

## Deployment Notes
- Use AWS ECS / Elastic Beanstalk or EC2 for deployment.
- Ensure environment variables are configured in the target environment.
- Connect to a production-grade MongoDB instance.

> Live AWS deployment is not created in this code-only environment. The backend is ready for AWS deployment once the repository is pushed and the service is configured.
