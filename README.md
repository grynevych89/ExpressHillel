# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture, server-side rendering, session-based and JWT authentication via Passport.js.

## Technologies

- Node.js + Express.js 5
- ES Modules
- PUG (templates for `/`, `/users`)
- EJS (templates for `/articles`)
- Passport.js + passport-local
- express-session
- jsonwebtoken + bcrypt
- cookie-parser
- dotenv

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

```env
PORT=3000
AUTH_ENABLED=true
STATIC_PATH=public
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

---

## Features

### Theme
- Light/dark toggle on every page
- Saved in `theme` cookie via `POST /theme`
- Only persisted if `cookie_consent=accepted`
- Applied server-side as `data-theme` on `<html>`

### Cookie Consent
- Banner shown on first visit
- Accept — enables cookie persistence
- Decline — removes `theme` and `token` cookies, blocks future persistence

### JWT Authentication
- Register/login sets a JWT in an httpOnly cookie
- `jwtMiddleware` validates token from cookie or `Authorization: Bearer` header

### Passport Authentication
- Local strategy using email + password
- Sessions stored server-side via `express-session`
- Session ID stored in httpOnly `connect.sid` cookie
- `passportAuth` middleware protects session-based routes

---

## Middlewares

| Middleware              | Description                                          |
|-------------------------|------------------------------------------------------|
| `themeMiddleware`       | Reads `theme` cookie, sets `res.locals.theme`        |
| `currentUserMiddleware` | Sets `res.locals.currentUser` from session or JWT    |
| `logRequestsMiddleware` | Logs method, URL, and timestamp of every request     |
| `jwtMiddleware`         | Validates JWT, returns 401 if missing or invalid     |
| `passportAuth`          | Checks `req.isAuthenticated()`, returns 401 if not   |
| `validateUserInput`     | Validates email and password presence in body        |
| `notFound`              | 404 handler — renders `404.pug`                      |
| `badRequest`            | 400 handler — catches invalid request body errors    |

---

## Routes

### Pages

| Method | Route                  | Description                               |
|--------|------------------------|-------------------------------------------|
| GET    | `/`                    | Home page                                 |
| GET    | `/users`               | Users list                                |
| GET    | `/users/:userId`       | User detail                               |
| GET    | `/articles`            | Articles list                             |
| GET    | `/articles/:articleId` | Article detail                            |

### JWT Auth

| Method | Route            | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/auth/register` | Register, hash password, set JWT cookie  |
| POST   | `/auth/login`    | Login, verify password, set JWT cookie   |
| POST   | `/auth/logout`   | Clear JWT cookie                         |
| GET    | `/auth/me`       | Return current user (JWT required)       |

### Passport Auth

| Method | Route                     | Description                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | `/auth/passport/register` | Register and auto-login via session          |
| POST   | `/auth/passport/login`    | Login via Passport local strategy            |
| POST   | `/auth/passport/logout`   | Destroy session, clear session cookie        |
| GET    | `/auth/passport/me`       | Return current user (session required)       |
| GET    | `/protected`              | Protected route (session required)           |

### Theme

| Method | Route    | Description                         |
|--------|----------|-------------------------------------|
| GET    | `/theme` | Return current theme from cookie    |
| POST   | `/theme` | Save theme to cookie (light / dark) |

### API (JWT required when `AUTH_ENABLED=true`)

| Method | Route                  | Description    |
|--------|------------------------|----------------|
| POST   | `/users`               | Create user    |
| PUT    | `/users/:userId`       | Update user    |
| DELETE | `/users/:userId`       | Delete user    |
| POST   | `/articles`            | Create article |
| PUT    | `/articles/:articleId` | Update article |
| DELETE | `/articles/:articleId` | Delete article |

---

## Testing with Postman

Base URL: `http://localhost:3000`

### JWT Register & Login
```
POST /auth/register
POST /auth/login
Body (JSON): { "email": "user@test.com", "password": "secret123" }
```

### Passport Register & Login
```
POST /auth/passport/register
POST /auth/passport/login
Body (JSON): { "email": "user@test.com", "password": "secret123" }
```
Session cookie (`connect.sid`) is set automatically. Use it for subsequent requests.

### Protected route
```
GET /protected
Cookie: connect.sid=<value>
```

### Theme
```
POST /theme
Body (JSON): { "theme": "dark" }
```

---

## Project Structure

```
ExpressHillel/
├── public/
│   ├── css/styles.css
│   ├── js/
│   │   ├── auth-modal.js
│   │   └── cookie-consent.js
│   └── favicon.ico
├── src/
│   ├── app.js
│   ├── config.js
│   ├── passportConfig.js
│   ├── sessionConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── passportAuthController.js
│   │   ├── themeController.js
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   ├── data/
│   │   ├── authUsers.js
│   │   ├── users.js
│   │   └── articles.js
│   ├── middlewares/
│   │   ├── index.js
│   │   ├── errorHandlers.js
│   │   ├── passportMiddleware.js
│   │   ├── jwtMiddleware.js
│   │   ├── currentUserMiddleware.js
│   │   ├── themeMiddleware.js
│   │   ├── logRequestsMiddleware.js
│   │   └── validateMiddleware.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── themeRoutes.js
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   └── articlesRoutes.js
│   ├── services/
│   │   └── userService.js
│   └── views/
│       ├── root/index.pug
│       ├── users/
│       │   ├── index.pug
│       │   └── detail.pug
│       ├── articles/
│       │   ├── index.ejs
│       │   └── detail.ejs
│       ├── mixins/_mixins.pug
│       ├── partials/
│       │   ├── _authHeader.ejs
│       │   └── _authModal.ejs
│       └── 404.pug
├── server.js
├── .env
├── .env.example
└── package.json
```
