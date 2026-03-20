# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture, middleware integration, and template engines (PUG & EJS).

## Technologies

- Node.js
- Express.js 5
- ES Modules
- dotenv
- PUG (template engine for `/users`)
- EJS (template engine for `/articles`)

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
AUTH_ENABLED=false         # true — /users requires Authorization header
ACCESS_TOKEN_ENABLED=false # true — /articles requires X-Access-Token header
STATIC_PATH=public         # path to static files directory
```

---

## Template Engines

| Route                  | Engine | Template                          |
|------------------------|--------|-----------------------------------|
| `/users`               | PUG    | `src/views/users/index.pug`       |
| `/users/:userId`       | PUG    | `src/views/users/detail.pug`      |
| `/articles`            | EJS    | `src/views/articles/index.ejs`    |
| `/articles/:articleId` | EJS    | `src/views/articles/detail.ejs`   |
| `/`                    | PUG    | `src/views/root/index.pug`        |

Static assets are served from the `public/` directory (`public/css/styles.css`).

---

## Middlewares

| Middleware           | Applied to                                         | Description                                                          |
|----------------------|----------------------------------------------------|----------------------------------------------------------------------|
| `logRequests`        | All routes (global)                                | Logs method, URL, and timestamp of every request                     |
| `basicAuth`          | All `/users` routes                                | Checks for `Authorization` header; returns 401 if missing (when `AUTH_ENABLED=true`) |
| `validateUserInput`  | `POST /users`                                      | Checks for `username` and `password` in body; returns 400 if missing |
| `checkArticleAccess` | All `/articles` routes                             | Checks for `x-access-token` header; returns 403 if missing (when `ACCESS_TOKEN_ENABLED=true`) |

---

## Routes

| Method | Route                  | Middleware                                | Response                                |
|--------|------------------------|-------------------------------------------|-----------------------------------------|
| GET    | `/`                    | logRequests                               | Home page with navigation               |
| GET    | `/users`               | logRequests, basicAuth                    | HTML list of users (PUG)                |
| POST   | `/users`               | logRequests, basicAuth, validateUserInput | Post users route                        |
| GET    | `/users/:userId`       | logRequests, basicAuth                    | HTML user detail page (PUG)             |
| PUT    | `/users/:userId`       | logRequests, basicAuth                    | Put user by Id route: {userId}          |
| DELETE | `/users/:userId`       | logRequests, basicAuth                    | Delete user by Id route: {userId}       |
| GET    | `/articles`            | logRequests, checkArticleAccess           | HTML list of articles (EJS)             |
| POST   | `/articles`            | logRequests, checkArticleAccess           | Post articles route                     |
| GET    | `/articles/:articleId` | logRequests, checkArticleAccess           | HTML article detail page (EJS)          |
| PUT    | `/articles/:articleId` | logRequests, checkArticleAccess           | Put article by Id route: {articleId}    |
| DELETE | `/articles/:articleId` | logRequests, checkArticleAccess           | Delete article by Id route: {articleId} |

---

## Testing with Postman

1. Open Postman
2. Base URL: `http://localhost:3000`

### Root
- **GET** `http://localhost:3000/`

### Users

> If `AUTH_ENABLED=true` — add header: `Authorization: Bearer token`

- **GET** `http://localhost:3000/users`
- **POST** `http://localhost:3000/users` — body (JSON): `{ "username": "john", "password": "1234" }`
- **GET** `http://localhost:3000/users/1`
- **PUT** `http://localhost:3000/users/1`
- **DELETE** `http://localhost:3000/users/1`

### Articles

> If `ACCESS_TOKEN_ENABLED=true` — add header: `x-access-token: token`

- **GET** `http://localhost:3000/articles`
- **POST** `http://localhost:3000/articles`
- **GET** `http://localhost:3000/articles/1`
- **PUT** `http://localhost:3000/articles/1`
- **DELETE** `http://localhost:3000/articles/1`

---

## Project Structure

```
ExpressHillel/
├── public/
│   └── css/
│       └── styles.css
├── src/
│   ├── controllers/
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   ├── data/
│   │   ├── users.js
│   │   └── articles.js
│   ├── middlewares/
│   │   ├── loggerMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── validateMiddleware.js
│   │   └── accessMiddleware.js
│   ├── routes/
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   └── articlesRoutes.js
│   ├── views/
│   │   ├── root/
│   │   │   └── index.pug
│   │   ├── users/
│   │   │   ├── index.pug
│   │   │   └── detail.pug
│   │   └── articles/
│   │       ├── index.ejs
│   │       └── detail.ejs
│   └── app.js
├── .env
├── .env.example
├── server.js
└── package.json
```
