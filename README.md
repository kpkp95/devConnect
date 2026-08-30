# devConnect

A full-stack networking app built for connecting people professionally. The project includes:

- Frontend: React + Vite + Redux + Tailwind + DaisyUI
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT stored in an HttpOnly cookie
- Core features: login/signup, profile editing, feed, connection requests, and connections

## Project structure

```bash
devConnect/
├── devConnect-front/   # React frontend
├── devConnect-back/    # Express backend
├── package.json        # Root package file
└── skills-lock.json    # Skill lock metadata
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
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

## DaisyUI note

DaisyUI is currently installed at the workspace root package level in the repository, not inside the frontend folder.

If you later want to keep it in the frontend project itself, run:

```bash
cd devConnect-front
npm install -D daisyui
```

## Run the app

### 1) Install dependencies

```bash
cd devConnect-back
npm install

cd ../devConnect-front
npm install
```

### 2) Start backend

```bash
cd devConnect-back
npm run dev
```

### 3) Start frontend

```bash
cd devConnect-front
npm run dev
```

The frontend usually runs on:

- http://localhost:5173

The backend usually runs on:

- http://localhost:3000

## Environment setup

Create a `.env` file inside `devConnect-back` with your local MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/devConnect
```

Example local setup:

```bash
cd devConnect-back
copy NUL .env
```

Then paste:

```env
MONGO_URI=mongodb://localhost:27017/devConnect
```

If you later add other secrets, keep them in this file and do not commit it to Git.

## Main app flow

- User signs up or logs in
- JWT is stored in an HttpOnly cookie
- User can view and update profile
- Feed shows suggested users
- Users can send connection requests
- Requests can be reviewed and accepted or ignored
- Connected users appear in the connections page

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

This project is for local development and learning. If you want to deploy it later, add proper environment variables, security hardening, and production hosting setup.
