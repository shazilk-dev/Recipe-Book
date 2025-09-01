# Kind Kitchen (Recipe Book)

A full‑stack MERN (MongoDB, Express, React, Redux Toolkit, Node) application for managing personal recipes with authentication, search, filtering, favorites, and CRUD operations.

## Features

- User authentication (signup & login) with hashed passwords + JWT
- Protected recipe create / update / delete endpoints
- Recipe CRUD (title, ingredients array, instructions, category, image URL, favorite flag)
- Search & category filtering client-side
- Favorite toggle (heart icon) persisted locally & via state
- Responsive UI built with React + TailwindCSS
- Drawer form for creating & editing recipes (dynamic ingredients, validation, image preview)
- Detailed recipe page with structured layout
- Clean component architecture (Button, Input with show/hide password, Drawer, RecipeCard, etc.)
- Local persistence for favorites & cached recipes (localStorage)

## Tech Stack

| Layer    | Tech                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Redux Toolkit, React Router v7, Framer Motion, lucide-react icons |
| Backend  | Node.js, Express, Mongoose, JWT, bcryptjs, CORS, Morgan                                                    |
| Database | MongoDB                                                                                                    |

## Project Structure (simplified)

```
client/
  src/
    app/store.ts
    features/
      auth/authSlice.ts
      recipes/recipesSlice.ts
    components/ (UI + layout)
    pages/ (Login, Signup, Home, RecipeDetail, About, etc.)
    routes/
server/
  src/
    models/ (recipe.model.js, user.model.js)
    controllers/ (recipe.controller.js, auth.controller.js)
    routes/ (recipe.routes.js, auth.routes.js)
    middleware/ (auth.js)
    db/ (index.js)
    app.js / index.js
```

## Getting Started

### 1. Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### 2. Clone

```bash
git clone <your-repo-url>
cd recipe-book
```

### 3. Install Dependencies

Install server & client packages:

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Environment Variables (Server)

Create `server/.env`:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=supersecret_dev_key_change
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 5. Run Development

In two terminals:

```bash
# Terminal 1 (server)
cd server
npm run dev

# Terminal 2 (client)
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Auth Flow

- Signup: `POST /api/v1/auth/signup` → returns `{ token, user }`
- Login: `POST /api/v1/auth/login` → returns `{ token, user }`
- Token stored in localStorage (`token`) and attached to protected recipe mutations.
- Logout clears auth + local user.

### Test Credentials (example)

You can create a new user via Signup, or use values you previously registered. No seed user is hardcoded.

Request body examples:

```json
POST /api/v1/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test1234"
}
```

```json
POST /api/v1/auth/login
{
  "email": "test@example.com",
  "password": "test1234"
}
```

## API Summary

Base URL: `http://localhost:4000/api/v1`

| Method | Endpoint     | Auth | Description       |
| ------ | ------------ | ---- | ----------------- |
| POST   | /auth/signup | No   | Create user       |
| POST   | /auth/login  | No   | Login user        |
| GET    | /recipes     | No   | List recipes      |
| GET    | /recipes/:id | No   | Get single recipe |
| POST   | /recipes     | Yes  | Create recipe     |
| PATCH  | /recipes/:id | Yes  | Update recipe     |
| DELETE | /recipes/:id | Yes  | Delete recipe     |

Auth header for protected calls:

```
Authorization: Bearer <token>
```

## Recipe Object Shape

```json
{
  "id": "<string>",
  "name": "Spaghetti Carbonara",
  "ingredients": [
    "Spaghetti",
    "Eggs",
    "Parmesan Cheese",
    "Pancetta",
    "Black Pepper"
  ],
  "instructions": "Boil pasta...",
  "imageUrl": "https://...",
  "category": "Italian",
  "favorite": false
}
```

## 🛠 Development Notes

- Passwords hashed with bcrypt (10 salt rounds)
- JWT default expiry 7d (configurable)
- Mongoose schema adds virtual `id` and strips `_id` & password in JSON
- Favorites currently stored locally (not persisted in DB per user)
- Error handling is minimal; extend global handler for production

## Future Improvements

- Per-user favorite persistence
- Pagination & server-side filtering
- Image upload (S3 / Cloudinary)
- Role-based authorization (admin)
- Refresh token rotation
- E2E & unit tests (Jest / Vitest)

## Quick Manual Test Steps

1. Start server & client.
2. Sign up a new user.
3. Create a recipe (requires token automatically in UI).
4. Toggle favorite (heart icon) on list & view filtering behavior.
5. Edit then delete a recipe; confirm UI state updates.
6. Logout and attempt to create a recipe → should be blocked (401).

## Scripts

Server:

```bash
npm run dev   # nodemon
npm start     # production
```

Client:

```bash
npm run dev
npm run build
npm run preview
```

## License

ISC (adjust as needed).

---

Built for learning & practice. Enjoy cooking with code! 🍝
