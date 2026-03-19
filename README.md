# Express Hillel — Homework

REST API server built with Node.js + Express.js using MVC architecture.

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

## Routes

| Method | Route                  | Response                                |
|--------|------------------------|-----------------------------------------|
| GET    | `/`                    | Get root route                          |
| GET    | `/users`               | Get users route                         |
| POST   | `/users`               | Post users route                        |
| GET    | `/users/:userId`       | Get user by Id route: {userId}          |
| PUT    | `/users/:userId`       | Put user by Id route: {userId}          |
| DELETE | `/users/:userId`       | Delete user by Id route: {userId}       |
| GET    | `/articles`            | Get articles route                      |
| POST   | `/articles`            | Post articles route                     |
| GET    | `/articles/:articleId` | Get article by Id route: {articleId}    |
| PUT    | `/articles/:articleId` | Put article by Id route: {articleId}    |
| DELETE | `/articles/:articleId` | Delete article by Id route: {articleId} |

---

## Testing with Postman

1. Open Postman
2. Base URL: `http://localhost:3000`

### Root
- **GET** `http://localhost:3000/`

### Users
- **GET** `http://localhost:3000/users`
- **POST** `http://localhost:3000/users`
- **GET** `http://localhost:3000/users/42`
- **PUT** `http://localhost:3000/users/42`
- **DELETE** `http://localhost:3000/users/42`

### Articles
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
