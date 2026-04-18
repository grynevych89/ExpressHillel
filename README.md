# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture, server-side rendering, session-based and JWT authentication via Passport.js, and MongoDB for data persistence. Runs locally or fully containerized via Docker Compose.

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
- Mongoose + MongoDB Atlas / local MongoDB
- Docker + Docker Compose

---

## Clone & Setup

```bash
git clone https://github.com/grynevych89/ExpressHillel.git
cd ExpressHillel
```

### Option A — Docker (recommended)

```bash
cp .env.example .env
# Fill in JWT_SECRET and SESSION_SECRET in .env
docker-compose up --build
docker-compose exec app npm run seed   # seed local MongoDB (run once)
```

Server runs at `http://localhost:3000`. MongoDB runs in a container — no external Atlas URI needed.

### Option B — Local (Node.js)

```bash
npm install
cp .env.example .env
# Fill in all variables including MONGODB_URI (Atlas or local)
npm run seed   # populate articles collection (run once)
npm run dev
```

## Scripts

| Command                               | Description                                    |
|---------------------------------------|------------------------------------------------|
| `npm start`                           | Start server (production)                      |
| `npm run dev`                         | Start server with auto-reload on changes       |
| `npm run seed`                        | Seed articles collection in MongoDB            |
| `docker-compose up --build`           | Build images and start all containers          |
| `docker-compose up`                   | Start containers (images already built)        |
| `docker-compose down`                 | Stop and remove containers                     |
| `docker-compose exec app npm run seed`| Seed MongoDB inside the running container      |

## Environment Variables

```env
PORT=3000
AUTH_ENABLED=true
STATIC_PATH=public
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> When running via Docker Compose, `MONGODB_URI` is set automatically to the local `mongo` container — only `JWT_SECRET` and `SESSION_SECRET` are required in `.env`.

---

## Features

### Docker
- Full Docker Compose setup: `app` (Express) + `mongo` (MongoDB) containers
- `app` connects to `mongo` via `MONGODB_URI: mongodb://mongo:27017/expresshillel`
- Code is mounted via volume (`.:/app`) — changes reflect instantly without rebuild
- `node --watch` runs inside the container for auto-reload on file changes
- `mongo_data` named volume persists MongoDB data between container restarts
- `depends_on` ensures `mongo` starts before `app`

### MongoDB / Mongoose
- Articles and users are stored in MongoDB via **Mongoose** models
- Graceful error page (503) when database is unavailable via `dbCheckMiddleware`
- Mongoose schemas include validation, indexes, static methods, instance methods, and timestamps

### Self-Test on Startup
- When the server starts and connects to MongoDB, it automatically runs **40 tests** across 4 suites
- Results are displayed on the home page (`/`) grouped by suite with pass/fail counters
- Test documents are created with a `__test__` prefix and deleted after each run — real data is not affected
- Tests logged to console with ✓/✗ per test

| Suite | Tests | What is covered |
|---|---|---|
| General | 1 | DB connection |
| Article CRUD | 13 | find, create, update, replace, insertMany, updateMany, delete, cursor, aggregation |
| Article Model | 10 | `findByTitle`, `findByAuthor`, `getSummary`, timestamps, validation |
| User | 16 | model, `comparePassword`, `getPublicProfile`, `findByEmail`, validation, `register`, `authenticate` |

### Cursors
- `GET /articles/stream` iterates documents using a MongoDB cursor (`Model.find().cursor()`) with `for await...of` instead of loading everything into memory

### Aggregation
- `GET /articles/stats` runs a multi-stage aggregation pipeline returning total articles, unique authors, average content length, and per-author breakdown sorted by article count
- Statistics block is also rendered on the home page (`/`)

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
- All JWT operations (sign, verify, set/clear cookie) encapsulated in `tokenService`

### Passport Authentication
- Local strategy using email + password
- Sessions stored server-side via `express-session`

---

## Models

### Article

| Field | Type | Validation |
|---|---|---|
| `title` | String | required, trim, minlength 3, maxlength 200 |
| `author` | String | required, trim, minlength 2, maxlength 100 |
| `date` | String | required |
| `content` | String | required, minlength 10 |

**Indexes:** `{ title: "text" }`, `{ author: 1 }`, `{ date: -1 }`

**Static methods:**
- `findByTitle(searchTerm)` — case-insensitive title search
- `findByAuthor(author)` — case-insensitive author search
- `findByFieldCaseInsensitive(field, value)` — shared base for both above

**Instance methods:**
- `getSummary()` — returns `{ _id, title, author, date, contentPreview, createdAt, updatedAt }`

---

### User

| Field | Type | Validation |
|---|---|---|
| `email` | String | required, unique, lowercase, trim, regex format |
| `password` | String | required, minlength 6, `select: false` |

**Pre-save hook:** hashes password with bcrypt before saving (only when modified).

**Static methods:**
- `findByEmail(email)` — finds by email, normalises to lowercase

**Instance methods:**
- `comparePassword(candidate)` — bcrypt comparison
- `getPublicProfile()` — returns `{ id, email, createdAt, updatedAt }` without password

---

## Middlewares

| Middleware                    | Description                                                        |
|-------------------------------|--------------------------------------------------------------------|
| `themeMiddleware`             | Reads `theme` cookie, sets `res.locals.theme`                      |
| `currentUserFromPassport`     | Sets `res.locals.currentUser` from Passport session (`req.user`)   |
| `currentUserFromJWT`          | Sets `res.locals.currentUser` from JWT cookie (fallback)           |
| `logRequestsMiddleware`       | Logs method, URL, and timestamp of every request                   |
| `dbCheckMiddleware`           | Returns 503 if MongoDB is not connected; applied to all article routes |
| `jwtMiddleware`               | Validates JWT, returns 401 if missing or invalid                   |
| `passportAuth`                | Checks `req.isAuthenticated()`, returns 401 if not                 |
| `validateFields(fields[])`    | Factory — validates required fields in request body, returns 400   |
| `asyncHandler(fn)`            | Wraps async route handlers, forwards errors to `handleError`       |
| `notFound`                    | 404 handler — renders `404.pug`                                    |
| `handleError`                 | Central error handler — handles `ValidationError` (400 + field details), `CastError` (400), duplicate key `11000` (409), custom `err.status`; GET requests render `error.ejs`, all others return JSON |

---

## Services

| Service          | Exports                                                                   | Description                                                      |
|------------------|---------------------------------------------------------------------------|------------------------------------------------------------------|
| `userService`    | `findByEmail`, `findById`, `create`, `register`, `authenticate`           | User lookup, creation, registration with duplicate check, and credential verification |
| `tokenService`   | `signToken`, `verifyToken`, `setTokenCookie`, `clearTokenCookie`          | All JWT operations in one place                                  |
| `articleService` | `buildRegexFilter`, `buildSearchFilter`, `getStats`, `getAll`, `getById`, `create`, `createMany`, `updateById`, `replaceById`, `updateMany`, `deleteById`, `deleteMany`, `stream` | Full CRUD abstraction layer + query helpers + aggregation |

---

## Routes

### Pages

| Method | Route                  | Description                                                                       |
|--------|------------------------|-----------------------------------------------------------------------------------|
| GET    | `/`                    | Home page — self-test results (left) + articles statistics (right)                |
| GET    | `/authors`             | Authors list (static data)                                                        |
| GET    | `/authors/:authorId`   | Author detail                                                                     |
| GET    | `/articles`            | Articles list from MongoDB. Supports `?search=keyword` and `?fields=title,author` |
| GET    | `/articles/:articleId` | Article detail from MongoDB                                                       |

### Articles — Cursor & Aggregation (public)

#### `GET /articles/stream`

Iterates through the articles collection using a **MongoDB cursor** (`Model.find().cursor()`) with a `for await...of` loop instead of loading all documents into memory at once.

Optional query parameter:
- `?search=keyword` — filter by title (case-insensitive)

**Example:**
```
GET /articles/stream?search=node
```

```json
{
  "total": 2,
  "articles": [
    { "_id": "...", "title": "Node.js Basics", "author": "Alice", "date": "2024-01-01", "content": "..." },
    { "_id": "...", "title": "Node.js Advanced", "author": "Bob", "date": "2024-03-15", "content": "..." }
  ]
}
```

---

#### `GET /articles/stats`

Runs a **MongoDB aggregation pipeline** across the articles collection.

Pipeline stages:
1. `$group` by `author` — counts articles, computes average content length and latest date
2. `$sort` by `articleCount` descending
3. `$group` into a single summary — totals + per-author array
4. `$project` — removes `_id`, rounds numeric values

**Example:**
```
GET /articles/stats
```

```json
{
  "totalArticles": 10,
  "uniqueAuthors": 4,
  "avgContentLength": 174,
  "perAuthor": [
    { "author": "John Doe",  "articleCount": 3, "avgContentLength": 210, "latestDate": "2024-05-01" },
    { "author": "Alex Brown", "articleCount": 2, "avgContentLength": 180, "latestDate": "2024-04-15" }
  ]
}
```

---

### Articles API (JWT required)

```
GET /articles
GET /articles?search=express          — partial title search (case-insensitive)
GET /articles?fields=title,author     — projection: return only selected fields
```

| Method | Route                        | Description                                         | Response                                               |
|--------|------------------------------|-----------------------------------------------------|--------------------------------------------------------|
| POST   | `/articles`                  | Insert one. Body: `{title, author, date, content}`  | `{ "article": { "_id": "...", ... } }`                 |
| POST   | `/articles/bulk`             | Insert many. Body: array of articles                | `{ "inserted": 2, "articles": [...] }`                 |
| PATCH  | `/articles/:id`              | Update one. Body: fields to update (`$set`)         | `{ "article": { "_id": "...", ... } }`                 |
| PATCH  | `/articles/many?author=name` | Update many by author (partial match)               | `{ "matched": 3, "modified": 3 }`                      |
| PUT    | `/articles/:id`              | Replace one. Body: `{title, author, date, content}` | `{ "article": { ... } }`                               |
| DELETE | `/articles/:id`              | Delete one                                          | `{ "message": "Article deleted", "article": { ... } }` |
| DELETE | `/articles/many`             | Delete many. Body: `{ "ids": ["...", "..."] }`      | `{ "deleted": 2 }`                                     |

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
│   ├── config.js                      # constants: JWT, session, theme, VALIDATION_RULES, ERROR_MESSAGES
│   ├── db.js                          # connectDB + isDbConnected
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
│   │   ├── seed.js
│   │   ├── studentDB.mongosh.js
│   │   ├── studentDB.json
│   │   └── studentDB.output.txt
│   ├── middlewares/
│   │   ├── index.js
│   │   ├── asyncHandler.js
│   │   ├── dbCheckMiddleware.js
│   │   ├── errorHandlers.js           # notFound, handleError, notFoundError
│   │   ├── passportMiddleware.js
│   │   ├── jwtMiddleware.js
│   │   ├── currentUserFromPassportMiddleware.js
│   │   ├── currentUserFromJWTMiddleware.js
│   │   ├── themeMiddleware.js
│   │   ├── logRequestsMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── Article.js                 # schema, validation, indexes, static + instance methods
│   │   └── User.js                    # schema, validation, pre-save hash, static + instance methods
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── themeRoutes.js
│   │   ├── rootRoutes.js
│   │   ├── authorsRoutes.js
│   │   └── articlesRoutes.js
│   ├── services/
│   │   ├── articleService.js          # CRUD layer + buildRegexFilter + getStats
│   │   ├── tokenService.js            # signToken, verifyToken, setTokenCookie, clearTokenCookie
│   │   └── userService.js             # findByEmail, findById, create, register, authenticate
│   ├── tests/
│   │   ├── runTests.js                # orchestrator: runs all suites, collects results
│   │   ├── article.crud.js            # 13 tests: CRUD + cursor + aggregation
│   │   ├── article.model.js           # 10 tests: static methods, instance methods, timestamps, validation
│   │   └── user.js                    # 16 tests: User model + userService
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
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.example
└── package.json
```
