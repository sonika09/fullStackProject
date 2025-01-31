const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("./models/User");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const keys = require("./config/keys");
const cookie = require("cookie-session");
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

// http://localhost:5000/

// process.env.PORT - when we run our application on production otherwise in development mode we use by default 5000

//https://fullstackproject-1-yalc.onrender.com/ - backend live for this url
// sonikasoni0517 - username mongodb
// M7sb0hPKwR4WF6hV - password
//connection string - mongodb+srv://sonikasoni0517:<db_password>@cluster0.cyghq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
