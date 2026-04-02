# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture, middleware integration, template engines (PUG & EJS), cookie-based theme preferences, and JWT authentication.

## Technologies

- Node.js
- Express.js 5
- ES Modules
- dotenv
- PUG (template engine for `/`, `/users`)
- EJS (template engine for `/articles`)
- cookie-parser
- jsonwebtoken
- bcrypt

---

## Clone & Setup

```bash
git clone https://github.com/grynevych89/ExpressHillel.git
cd ExpressHillel
npm install
cp .env.example .env
npm run dev
```

Server runs at `http://localhost:3000`

## Scripts

| Command       | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Start server (production)                |
| `npm run dev` | Start server with auto-reload on changes |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
AUTH_ENABLED=false         # true — JWT required for /users and /articles mutations
STATIC_PATH=public         # path to static files directory
JWT_SECRET=your-secret-key # secret used to sign JWT tokens
```

---

## Features

### Favicon
All HTML pages (PUG & EJS) include `<link rel="icon" href="/favicon.ico">`. The file is served from `public/favicon.ico`.

### Theme (Cookies)
- A light/dark toggle is present on every page
- Selected theme is saved in a `theme` cookie (30-day expiry) via `POST /theme`
- Theme is read server-side and applied as `data-theme` attribute on `<html>`
- Cookie consent banner is shown on first visit with Accept / Decline options

### JWT Authentication
- `POST /auth/register` — creates a user, hashes password with bcrypt, returns JWT in httpOnly cookie
- `POST /auth/login` — verifies credentials, returns JWT in httpOnly cookie
- `POST /auth/logout` — clears the JWT cookie
- `GET /auth/me` — returns current user (requires valid JWT)
- Protected routes check for JWT in cookie or `Authorization: Bearer` header
- When `AUTH_ENABLED=true` and no token is present, pages show a blurred overlay with a login prompt

---

## Middlewares

| Middleware                | Applied to          | Description                                          |
|---------------------------|---------------------|------------------------------------------------------|
| `logRequestsMiddleware`   | All routes (global) | Logs method, URL, and timestamp of every request     |
| `cookieParser`            | All routes (global) | Parses cookies from requests                         |
| `themeMiddleware`         | All routes (global) | Reads `theme` cookie, sets `res.locals.theme`        |
| `currentUserMiddleware`   | All routes (global) | Decodes JWT cookie, sets `res.locals.currentUser`    |
| `jwtMiddleware`           | Protected mutations | Verifies JWT, returns 401 if missing or invalid      |
| `validateUserInput`       | `POST /users`       | Checks for `username` and `password` in body         |

---

## Routes

### Pages

| Method | Route                  | Auth required | Description                                    |
|--------|------------------------|---------------|------------------------------------------------|
| GET    | `/`                    | —             | Home page                                      |
| GET    | `/users`               | —             | Users list (blurred if not logged in)          |
| GET    | `/users/:userId`       | —             | User detail (blurred if not logged in)         |
| GET    | `/articles`            | —             | Articles list (blurred if not logged in)       |
| GET    | `/articles/:articleId` | —             | Article detail (blurred if not logged in)      |

### Auth

| Method | Route            | Description                                   |
|--------|------------------|-----------------------------------------------|
| POST   | `/auth/register` | Register, hash password, set JWT cookie       |
| POST   | `/auth/login`    | Login, verify password, set JWT cookie        |
| POST   | `/auth/logout`   | Clear JWT cookie                              |
| GET    | `/auth/me`       | Return current user (JWT required)            |

### Theme

| Method | Route    | Description                          |
|--------|----------|--------------------------------------|
| GET    | `/theme` | Return current theme from cookie     |
| POST   | `/theme` | Save theme to cookie (light / dark)  |

### API (JWT required when `AUTH_ENABLED=true`)

| Method | Route                  | Description      |
|--------|------------------------|------------------|
| POST   | `/users`               | Create user      |
| PUT    | `/users/:userId`       | Update user      |
| DELETE | `/users/:userId`       | Delete user      |
| POST   | `/articles`            | Create article   |
| PUT    | `/articles/:articleId` | Update article   |
| DELETE | `/articles/:articleId` | Delete article   |

---

## Testing with Postman

Base URL: `http://localhost:3000`

### Register & Login
```
POST /auth/register
Body (JSON): { "username": "alice", "password": "secret123" }

POST /auth/login
Body (JSON): { "username": "alice", "password": "secret123" }
```
Both return a JWT stored in an httpOnly cookie automatically.

### Theme
```
GET  /theme
POST /theme
Body (JSON): { "theme": "dark" }
```

### Protected routes (when AUTH_ENABLED=true)
The JWT cookie is sent automatically by the browser. For Postman — copy the `token` cookie value and pass it as:
```
Authorization: Bearer <token>
```

---

## Project Structure

```
ExpressHillel/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth-modal.js
│   │   └── cookie-consent.js
│   └── favicon.ico
├── src/
│   ├── config.js                        # shared constants (JWT, bcrypt, theme)
│   ├── controllers/
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   ├── articlesController.js
│   │   ├── authController.js
│   │   └── themeController.js
│   ├── data/
│   │   ├── users.js
│   │   └── articles.js
│   ├── middlewares/
│   │   ├── index.js                     # aggregates global middlewares
│   │   ├── logRequestsMiddleware.js
│   │   ├── themeMiddleware.js
│   │   ├── currentUserMiddleware.js
│   │   ├── jwtMiddleware.js
│   │   └── validateMiddleware.js
│   ├── routes/
│   │   ├── index.js                     # aggregates all routes
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   ├── articlesRoutes.js
│   │   ├── authRoutes.js
│   │   └── themeRoutes.js
│   ├── views/
│   │   ├── root/
│   │   │   └── index.pug
│   │   ├── users/
│   │   │   ├── index.pug
│   │   │   └── detail.pug
│   │   ├── articles/
│   │   │   ├── index.ejs
│   │   │   └── detail.ejs
│   │   ├── mixins/
│   │   │   └── _mixins.pug              # PUG mixins: authHeader, authModal
│   │   ├── partials/
│   │   │   ├── _authHeader.ejs
│   │   │   └── _authModal.ejs
│   │   └── 404.pug
│   └── app.js
├── .env
├── .env.example
├── server.js
└── package.json
```
