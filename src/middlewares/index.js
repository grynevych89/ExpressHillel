import { logRequestsMiddleware } from './logRequestsMiddleware.js';
import { themeMiddleware } from './themeMiddleware.js';
import { currentUserMiddleware } from './currentUserMiddleware.js';

export default [themeMiddleware, currentUserMiddleware, logRequestsMiddleware];
