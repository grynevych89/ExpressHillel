import express from 'express';
import rootRoutes from './routes/rootRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';
import { logRequests } from './middlewares/loggerMiddleware.js';

const app = express();

app.use(express.json());
app.use(logRequests);

app.use('/', rootRoutes);
app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);

app.use((err, req, res, next) => {
  res.status(400).send('Invalid request body');
});

export default app;
