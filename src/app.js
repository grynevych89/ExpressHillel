import express from 'express';
import cookieParser from 'cookie-parser';
import pug from 'pug';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/index.js';
import middlewares from './middlewares/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.engine('pug', pug.__express);
app.engine('ejs', ejs.__express);
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, '..', process.env.STATIC_PATH || 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(...middlewares);

app.use(router);

app.use((req, res) => {
  res.status(404).render('404.pug');
});

app.use((err, req, res, next) => {
  res.status(400).send('Invalid request body');
});

export default app;
