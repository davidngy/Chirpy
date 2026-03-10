# Chirpy

Chirpy is a simple HTTP server that allows users to create and retrieve short messages ("chirps"), similar to tweets.

---

## Motivation

Chirpy was built to practice and internalize backend development concepts such as API design, authentication flows, and database integration.

The project was created as part of a Boot.dev course and served as a great opportunity to strengthen my backend fundamentals and learn how to structure and design backend applications in a clean and maintainable way.

---

## Features

### Chirp Management

* Create chirps
* Retrieve all chirps
* Retrieve a single chirp
* Delete a chirp
* Filter chirps by author
* Sort chirps by creation date

### Authentication

* User registration
* Login with access tokens
* Refresh token system
* Token revocation

### User Management

* Update user credentials
* Upgrade user accounts via webhook events

### System Features

* Health check endpoint
* API request metrics tracking
* Metrics reset endpoint
* Static frontend hosting
* Automatic database migrations on startup

---

## Tech Stack

* **TypeScript**
* **Node.js**
* **Express**
* **PostgreSQL**
* **Drizzle ORM**

---

## Installation

Clone the repository:

```bash
git clone https://github.com/davidngy/Chirpy
cd Chirpy
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root based on `.env.example`.

Example:

```
PORT=8080
PLATFORM=dev
DB_URL=postgres://user:password@localhost:5432/chirpy
SECRET=your_jwt_secret
POLKA_KEY=your_webhook_secret
```

Start the development server:

```bash
npm run dev
```

The server will start at:

```
http://localhost:8080
```

---

## API Examples

### Create Chirp

```
POST /api/chirps
```

Request body:

```json
{
  "body": "Hello world"
}
```

Response:

```json
{
  "id": "chirp-id",
  "body": "Hello world",
  "userId": "user-id",
  "createdAt": "2026-03-09T12:00:00Z",
  "updatedAt": "2026-03-09T12:00:00Z"
}
```

---

### Get Chirps

```
GET /api/chirps
```

Optional query parameters:

```
/api/chirps?authorId=user-id
/api/chirps?sort=desc
```

Example response:

```json
[
  {
    "id": "chirp-id",
    "body": "Hello world",
    "userId": "user-id",
    "createdAt": "2026-03-09T12:00:00Z",
    "updatedAt": "2026-03-09T12:00:00Z"
  }
]
```

---

### Login

```
POST /api/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:

```json
{
  "id": "user-id",
  "token": "access-token",
  "refreshToken": "refresh-token",
  "email": "user@example.com",
  "isChirpyRed": true,
  "createdAt": "2026-03-09T12:00:00Z",
  "updatedAt": "2026-03-09T12:00:00Z"
}
```

---

### Refresh Token

```
POST /api/refresh
```

Header:

```
Authorization: Bearer <refresh_token>
```

Response:

```json
{
  "token": "new-access-token"
}
```

---

## Author

David Nguyen
