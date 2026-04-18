import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findByEmail, findById } from './services/userService.js';

const configurePassport = () => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user.getPublicProfile());
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findById(id);
      if (!user) return done(null, false);
      done(null, user.getPublicProfile());
    } catch (err) {
      done(err);
    }
  });
};

export { configurePassport };
