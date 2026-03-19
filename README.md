# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture with middleware integration.

## Technologies

- Node.js
- Express.js 5
- ES Modules
- dotenv

---

## Clone & Setup

```bash
git clone https://github.com/grynevych89/ExpressHillel.git
cd ExpressHillel
npm install
cp .env.example .env
npm start
```

Server runs at `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
```

---

## Middlewares

| Middleware          | Applied to                              | Description                                              |
|---------------------|-----------------------------------------|----------------------------------------------------------|
| `logRequests`       | All routes (global)                     | Logs method, URL, and timestamp of every request         |
| `basicAuth`         | All `/users` and `/users/:userId` routes | Checks for `Authorization` header; returns 401 if missing |
| `validateUserInput` | `POST /users`                           | Checks for `username` and `password` in body; returns 400 if missing |
| `checkArticleAccess`| All `/articles` and `/articles/:articleId` routes | Checks for `x-access-token` header; returns 403 if missing |

---

## Routes

| Method | Route                  | Middleware                              | Response                                |
|--------|------------------------|-----------------------------------------|-----------------------------------------|
| GET    | `/`                    | logRequests                             | Get root route                          |
| GET    | `/users`               | logRequests, basicAuth                  | Get users route                         |
| POST   | `/users`               | logRequests, basicAuth, validateUserInput | Post users route                      |
| GET    | `/users/:userId`       | logRequests, basicAuth                  | Get user by Id route: {userId}          |
| PUT    | `/users/:userId`       | logRequests, basicAuth                  | Put user by Id route: {userId}          |
| DELETE | `/users/:userId`       | logRequests, basicAuth                  | Delete user by Id route: {userId}       |
| GET    | `/articles`            | logRequests, checkArticleAccess         | Get articles route                      |
| POST   | `/articles`            | logRequests, checkArticleAccess         | Post articles route                     |
| GET    | `/articles/:articleId` | logRequests, checkArticleAccess         | Get article by Id route: {articleId}    |
| PUT    | `/articles/:articleId` | logRequests, checkArticleAccess         | Put article by Id route: {articleId}    |
| DELETE | `/articles/:articleId` | logRequests, checkArticleAccess         | Delete article by Id route: {articleId} |

---

## Testing with Postman

1. Open Postman
2. Base URL: `http://localhost:3000`

### Root
- **GET** `http://localhost:3000/`

### Users

> Add header: `Authorization: Bearer token`

- **GET** `http://localhost:3000/users`
- **POST** `http://localhost:3000/users` — body (JSON): `{ "username": "john", "password": "1234" }`
- **GET** `http://localhost:3000/users/42`
- **PUT** `http://localhost:3000/users/42`
- **DELETE** `http://localhost:3000/users/42`

### Articles

> Add header: `x-access-token: token`

- **GET** `http://localhost:3000/articles`
- **POST** `http://localhost:3000/articles`
- **GET** `http://localhost:3000/articles/99`
- **PUT** `http://localhost:3000/articles/99`
- **DELETE** `http://localhost:3000/articles/99`

> Replace `42` and `99` with any other ID to test dynamic route parameters.

---

## Project Structure

```
ExpressHillel/
├── src/
│   ├── controllers/
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   ├── middlewares/
│   │   ├── loggerMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── validateMiddleware.js
│   │   └── accessMiddleware.js
│   ├── routes/
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   └── articlesRoutes.js
│   └── app.js
├── .env
├── .env.example
├── server.js
└── package.json
```
