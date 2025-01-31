const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("./models/User");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongoURI);

authRoutes(app);
const PORT = process.env.PORT || 5000;
console.log(PORT);
app.listen(PORT);
