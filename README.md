# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture, server-side rendering, session-based and JWT authentication via Passport.js, and MongoDB Atlas for data persistence.

## Technologies

- Node.js + Express.js 5
- ES Modules
- PUG (templates for `/`, `/authors`)
- EJS (templates for `/articles`)
- Passport.js + passport-local
- express-session
- jsonwebtoken + bcrypt
- cookie-parser
- dotenv
- Mongoose + MongoDB Atlas

---

## Clone & Setup

```bash
git clone https://github.com/grynevych89/ExpressHillel.git
cd ExpressHillel
npm install
cp .env.example .env
# Fill in MONGODB_URI in .env
npm run seed   # populate articles collection (run once)
npm run dev
```

Server runs at `http://localhost:3000`

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm start`     | Start server (production)                |
| `npm run dev`   | Start server with auto-reload on changes |
| `npm run seed`  | Seed articles collection in MongoDB      |

## Environment Variables

```env
PORT=3000
AUTH_ENABLED=true
STATIC_PATH=public
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

---

## Features

### MongoDB Atlas
- Articles are stored and fetched from MongoDB Atlas
- Users (auth) are registered and stored in MongoDB Atlas
- Graceful error page (503) when database is unavailable

### Self-Test on Startup
- When the server starts and connects to MongoDB, it automatically runs 12 tests covering all CRUD operations
- Results are displayed on the home page (`/`) under the navigation cards
- Test documents are created with a `__test__` prefix and deleted after each test — real data is not affected
- Tests logged to console with ✓/✗ per test

### Articles CRUD (full)
- **Read** with projection (select which fields MongoDB returns)
- **Insert One / Insert Many**
- **Update One (PATCH) / Update Many / Replace One (PUT)**
- **Delete One / Delete Many** (by selected IDs)

### Theme
- Light/dark toggle on every page
- Saved in `theme` cookie via `POST /theme`
- Only persisted if `cookie_consent=accepted`

### Cookie Consent
- Banner shown on first visit
- Accept — enables cookie persistence
- Decline — removes `theme` and `token` cookies

### JWT Authentication
- Register/login sets a JWT in an httpOnly cookie
- `jwtMiddleware` validates token from cookie or `Authorization: Bearer` header

### Passport Authentication
- Local strategy using email + password
- Sessions stored server-side via `express-session`

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

| Method | Route                    | Description                               |
|--------|--------------------------|-------------------------------------------|
| GET    | `/`                      | Home page + self-test results             |
| GET    | `/authors`               | Authors list (static data)                |
| GET    | `/authors/:authorId`     | Author detail                             |
| GET    | `/articles`              | Articles list from MongoDB. Supports `?search=keyword` and `?fields=title,author` |
| GET    | `/articles/:articleId`   | Article detail from MongoDB               |

### Articles API (JWT required)

#### Read

```
GET /articles
GET /articles?search=express          — partial title search (case-insensitive)
GET /articles?fields=title,author     — projection: return only selected fields
```

---

| Method | Route                  | Description                                        | Response                                              |
|--------|------------------------|----------------------------------------------------|-------------------------------------------------------|
| POST   | `/articles`            | Insert one. Body: `{title, author, date, content}` | `{ "article": { "_id": "...", "title": "...", ... } }` |
| POST   | `/articles/bulk`       | Insert many. Body: array of articles               | `{ "inserted": 2, "articles": [...] }`                |
| PATCH  | `/articles/:id`        | Update one. Body: fields to update (`$set`)        | `{ "article": { "_id": "...", "title": "...", ... } }` |
| PATCH  | `/articles/many?author=name` | Update many by author (partial match). Body: fields to set | `{ "matched": 3, "modified": 3 }` |
| PUT    | `/articles/:id`        | Replace one. Body: `{title, author, date, content}` (all required) | `{ "article": { ... } }` |
| DELETE | `/articles/:id`        | Delete one                                         | `{ "message": "Article deleted", "article": { ... } }` |
| DELETE | `/articles/many`       | Delete many. Body: `{ "ids": ["...", "..."] }`     | `{ "deleted": 2 }`                                    |

---

### JWT Auth

| Method | Route            | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/auth/register` | Register, hash password, set JWT cookie  |
| POST   | `/auth/login`    | Login, verify password, set JWT cookie   |
| POST   | `/auth/logout`   | Clear JWT cookie                         |
| GET    | `/auth/me`       | Return current user (JWT required)       |

### Passport Auth

| Method | Route                     | Description                             |
|--------|---------------------------|-----------------------------------------|
| POST   | `/auth/passport/register` | Register and auto-login via session     |
| POST   | `/auth/passport/login`    | Login via Passport local strategy       |
| POST   | `/auth/passport/logout`   | Destroy session, clear session cookie   |
| GET    | `/auth/passport/me`       | Return current user (session required)  |
| GET    | `/protected`              | Protected route (session required)      |

---

### Theme

| Method | Route    | Description                         |
|--------|----------|-------------------------------------|
| GET    | `/theme` | Return current theme from cookie    |
| POST   | `/theme` | Save theme to cookie (light / dark) |

---

## Project Structure

```
ExpressHillel/
├── public/
│   ├── css/styles.css
│   ├── js/
│   │   ├── articles.js
│   │   ├── fakeArticles.js
│   │   ├── auth-modal.js
│   │   └── cookie-consent.js
│   └── favicon.ico
├── src/
│   ├── app.js
│   ├── config.js
│   ├── db.js
│   ├── passportConfig.js
│   ├── sessionConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── passportAuthController.js
│   │   ├── themeController.js
│   │   ├── rootController.js
│   │   ├── authorsController.js
│   │   └── articlesController.js
│   ├── data/
│   │   ├── authors.js
│   │   └── seed.js
│   ├── middlewares/
│   │   ├── index.js
│   │   ├── accessMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorHandlers.js
│   │   ├── passportMiddleware.js
│   │   ├── jwtMiddleware.js
│   │   ├── currentUserMiddleware.js
│   │   ├── themeMiddleware.js
│   │   ├── logRequestsMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── Article.js
│   │   └── User.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── themeRoutes.js
│   │   ├── rootRoutes.js
│   │   ├── authorsRoutes.js
│   │   └── articlesRoutes.js
│   ├── services/
│   │   └── userService.js
│   ├── tests/
│   │   └── runTests.js
│   └── views/
│       ├── root/index.pug
│       ├── authors/
│       │   ├── index.pug
│       │   └── detail.pug
│       ├── articles/
│       │   ├── index.ejs
│       │   └── detail.ejs
│       ├── mixins/_mixins.pug
│       ├── partials/
│       │   ├── _authHeader.ejs
│       │   └── _authModal.ejs
│       ├── error.ejs
│       └── 404.pug
├── server.js
├── .env
├── .env.example
└── package.json
```
