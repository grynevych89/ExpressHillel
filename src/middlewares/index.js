import { logRequestsMiddleware } from './logRequestsMiddleware.js';
import { themeMiddleware } from './themeMiddleware.js';
import { currentUserMiddleware } from './currentUserMiddleware.js';
import { passportAuth } from './passportMiddleware.js';
import { notFound, badRequest } from './errorHandlers.js';

export { passportAuth, notFound, badRequest };
export default [themeMiddleware, currentUserMiddleware, logRequestsMiddleware];
