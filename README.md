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

### MongoDB
- Articles and users are stored in MongoDB (Atlas or local container)
- Graceful error page (503) when database is unavailable via `dbCheckMiddleware`

### Self-Test on Startup
- When the server starts and connects to MongoDB, it automatically runs 14 tests covering all CRUD operations, cursor iteration, and aggregation pipeline
- Results are displayed on the home page (`/`) side by side with the Articles Statistics block
- Test documents are created with a `__test__` prefix and deleted after each test — real data is not affected
- Tests logged to console with ✓/✗ per test

### Cursors
- `GET /articles/stream` iterates documents using a MongoDB cursor (`Model.find().cursor()`) with `for await...of` instead of loading everything into memory
- Suitable for large collections

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
| `handleError`                 | Central error handler — 400 for ValidationError, 500 otherwise; GET requests render `error.ejs`, all others return JSON |

---

## Services

| Service          | Exports                                                          | Description                                            |
|------------------|------------------------------------------------------------------|--------------------------------------------------------|
| `userService`    | `findByEmail`, `findById`, `createUser`, `registerUser`          | User lookup, creation, and registration with duplicate check |
| `tokenService`   | `signToken`, `verifyToken`, `setTokenCookie`, `clearTokenCookie` | All JWT operations in one place                        |
| `articleService` | `buildRegexFilter`, `buildSearchFilter`, `getStats`              | Reusable query helpers and aggregation pipeline        |

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
│   ├── config.js
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
│   │   ├── studentDB.mongosh.js           # mongosh script: CRUD, aggregation, indexes on studentDB
│   │   ├── studentDB.json                 # final state of assignments collection after script run
│   │   └── studentDB.output.txt           # console output from the last script execution
│   ├── middlewares/
│   │   ├── index.js
│   │   ├── asyncHandler.js            # wraps async handlers, forwards errors
│   │   ├── dbCheckMiddleware.js       # 503 if MongoDB not connected
│   │   ├── errorHandlers.js           # notFound, handleError, notFoundError
│   │   ├── passportMiddleware.js
│   │   ├── jwtMiddleware.js
│   │   ├── currentUserFromPassportMiddleware.js
│   │   ├── currentUserFromJWTMiddleware.js
│   │   ├── themeMiddleware.js
│   │   ├── logRequestsMiddleware.js
│   │   └── validateMiddleware.js      # validateFields(fields[]) factory
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
│   │   ├── articleService.js          # buildRegexFilter, buildSearchFilter, getStats (aggregation)
│   │   ├── tokenService.js            # signToken, verifyToken, setTokenCookie, clearTokenCookie
│   │   └── userService.js             # findByEmail, createUser, registerUser
│   ├── tests/
│   │   └── runTests.js                # 14 tests: CRUD + cursor + aggregation
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
