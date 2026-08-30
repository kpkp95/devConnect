# devConnect

A full-stack professional networking app where users can sign up, build their profile, discover people, and send or manage connection requests.

## Overview

This project is split into two parts:

- Frontend: React + Vite + Redux + Tailwind + DaisyUI
- Backend: Node.js + Express + MongoDB + Mongoose

Core flows include:

- user signup and login
- JWT-based authentication with HttpOnly cookies
- profile viewing and editing
- personalized feed for discovering users
- sending and reviewing connection requests
- display of accepted connections

## Project structure

```bash
devConnect/
├── devConnect-front/   # React frontend
├── devConnect-back/    # Express backend
├── README.md           # Project overview
├── .gitignore          # Git ignore rules
├── package.json        # Root package file (optional cleanup)
├── package-lock.json   # Root lock file (optional cleanup)
├── skills-lock.json    # Tooling metadata
└── .agents/            # Copilot agent settings
```

## Tech stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- DaisyUI

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- cookie-parser
- validator

## Getting started

### 1) Install backend dependencies

```bash
cd devConnect-back
npm install
```

### 2) Install frontend dependencies

```bash
cd ../devConnect-front
npm install
```

### 3) Start the backend

```bash
cd ../devConnect-back
npm run dev
```

### 4) Start the frontend

```bash
cd ../devConnect-front
npm run dev
```

The app usually runs at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Environment setup

Create a `.env` file inside `devConnect-back`:

```env
MONGO_URI=mongodb://localhost:27017/devConnect
```

Example for Windows PowerShell:

```powershell
cd devConnect-back
New-Item .env -ItemType File
```

Then paste the MongoDB connection string above into the file.

> Keep this file local and do not commit it to Git.

## Main user flow

- Sign up or log in
- Receive a secure JWT cookie
- View and update profile data
- Browse feed suggestions
- Send connection requests
- Accept or ignore incoming requests
- See connected users in the connections page

## Useful commands

```bash
# Backend
cd devConnect-back
npm run dev
npm run start

# Frontend
cd devConnect-front
npm run dev
npm run build
npm run preview
```

## Notes

- Passwords are hashed before being stored in MongoDB.
- Auth is handled via HttpOnly cookies.
- This project is intended for local development and learning, but it is structured so it can later be adapted for deployment with proper environment variables and security hardening.

## Future improvements

- real image upload instead of URL-only photo input
- stronger validation and form UX
- improved notification system
- deploy-ready production config
- optional chat or messaging feature
