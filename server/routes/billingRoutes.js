const keys = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const stripe = require("stripe")(keys.stripePublishableKey);

module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    try {
      if (!req.body.id) {
        return res.status(400).send({ error: "Payment source is required." });
      }

      const charge = await stripe.charges.create({
        amount: 500, // $5
        currency: "usd",
        description: "$5 for 5 credits",
        source: req.body.id, // Ensure this is a valid Stripe token
      });

      if (!req.user) {
        return res.status(401).send({ error: "User not authenticated" });
      }

      req.user.credits += 5;
      const user = await req.user.save();

      res.send(user);
    } catch (error) {
      console.error("Stripe Charge Error:", error);
      res.status(500).send({ error: error.message });
    }
  });
};
