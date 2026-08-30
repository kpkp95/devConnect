# devConnect Backend

This is the Express backend for the devConnect application. It handles authentication, user data, profile updates, request review, and connection logic.

## Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev
```

The server runs on:

```bash
http://localhost:3000
```

## Environment variables

Create a `.env` file in this folder:

```env
MONGO_URI=mongodb://localhost:27017/devConnect
```

## Main API routes

- `POST /signup`
- `POST /login`
- `POST /logout`
- `GET /profile/view`
- `PATCH /profile/edit`
- `PATCH /profile/password`
- `GET /feed`
- `GET /user/requests`
- `POST /request/send/:status/:userId`
- `POST /request/review/:status/:requestId`

## Notes

- Passwords are hashed before saving.
- JWT tokens are sent via HttpOnly cookies.
- Requests are protected with auth middleware.

## Start with production mode

```bash
npm run start
```
