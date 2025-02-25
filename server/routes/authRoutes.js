const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000"); // Explicitly redirect to frontend
  });

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("http://localhost:3000/surveys"); // Explicitly redirect to frontend
    }
  );

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
