const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('./config/keys')

const app= express()

passport.use(new GoogleStrategy({
    clientID:keys.googleClientID,
    googleClientSecret:keys.googleClientSecret,
    callbackURL:'/auth/google/callback'
},(accessToken)=>{
console.log('accessToken', accessToken)
}))

app.get('/auth/google', passport.authenticate('google', {
    scope:['profile', 'email']
}))

const PORT = process.env.PORT || 5000
console.log(PORT)
app.listen(PORT)

// http://localhost:5000/

// process.env.PORT - when we run our application on production otherwise in development mode we use by default 5000

//https://fullstackproject-1-yalc.onrender.com/ - backend live for this url
