import express from 'express';
import cookieParser from 'cookie-parser';
import pug from 'pug';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import passport from 'passport';
import { configurePassport } from './passportConfig.js';
import sessionMiddleware from './sessionConfig.js';
import middlewares, { notFound, handleError } from './middlewares/index.js';
import router from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

configurePassport();

const app = express();

// Template engines
app.engine('pug', pug.__express);
app.engine('ejs', ejs.__express);
app.set('views', join(__dirname, 'views'));

// Parsing & cookies
app.use(express.static(join(__dirname, '..', process.env.STATIC_PATH || 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session & auth
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// App middleware & routes
app.use(...middlewares);
app.use(router);

// Error handlers
app.use(notFound);
app.use(handleError);

export default app;
