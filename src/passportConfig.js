import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import authUsers from './data/authUsers.js';

const configurePassport = () => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = authUsers.find(u => u.email === email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, { id: user.id, email: user.email });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    try {
      const user = authUsers.find(u => u.id === id);
      if (!user) return done(null, false);
      done(null, { id: user.id, email: user.email });
    } catch (err) {
      done(err);
    }
  });
};

export { configurePassport };
