import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { SECRET_TOKEN } from "../config";
import passport from "passport";
import { User } from "../models";

export const configureJwtStrategy = () => {
  const jwtOptions = {
    secretOrKey: SECRET_TOKEN,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new JwtStrategy(jwtOptions, (payload, done) => {
      User.findById(payload.userId, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};

export const generateToken = (payload) => {
  const token = jwt.sign(payload, SECRET_TOKEN);
  return token;
};

export const authenticateJwt = passport.authenticate("jwt", { session: false });
