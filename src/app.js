import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import rootRoutes from './routes/rootRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';
import { logRequests } from './middlewares/loggerMiddleware.js';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.engine('pug', require('pug').__express);
app.engine('ejs', require('ejs').__express);
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, '..', process.env.STATIC_PATH || 'public')));
app.use(express.json());
app.use(logRequests);

app.use('/', rootRoutes);
app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);

app.use((err, req, res, next) => {
  res.status(400).send('Invalid request body');
});

export default app;
