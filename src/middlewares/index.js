import { logRequestsMiddleware } from './logRequestsMiddleware.js';
import { themeMiddleware } from './themeMiddleware.js';
import { currentUserFromPassport } from './currentUserFromPassportMiddleware.js';
import { currentUserFromJWT } from './currentUserFromJWTMiddleware.js';
import { passportAuth } from './passportMiddleware.js';
import { notFound, handleError, notFoundError } from './errorHandlers.js';

export { passportAuth, notFound, handleError, notFoundError };
export default [themeMiddleware, currentUserFromPassport, currentUserFromJWT, logRequestsMiddleware];
