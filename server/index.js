const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser=require('body-parser')
require("./models/User");
require('./models/Survey')
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const billingRoutes = require("./routes/billingRoutes");
const surveyRoutes = require("./routes/surveyRoutes");

const app = express();

app.use(bodyParser.json())
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
billingRoutes(app)
surveyRoutes(app)

if(process.env.NODE_ENV==='production'){
  // express will serve up production assets
  // like our main.js or main.css file
  app.use(express.static('client/build'))

  //express will serve up the index.html file
  // if it does not recognize the route
  const path = require('path')
  app.get('*', (req,res)=>{
  req.resolveFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
