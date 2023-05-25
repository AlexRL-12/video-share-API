import express from "express";
import morgan from "morgan";
import multer from "multer";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import "./config/passport";

import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(multer({ dest: "./uploads" }).single("image"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "somesecretkey",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(indexRoutes);
app.use(authRoutes);

app.use("/uploads", express.static("./uploads"));

export default app;
