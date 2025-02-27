const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const requireLogin = require("../middleware/requireLogin");
const requireCredits = require("../middleware/requireCredits");
const surveyTemplate = require("../services/emailTemplate/surveyTemplate");
const EmailService = require("../services/Mailer"); // Import EmailService
const mongoose = require("mongoose");
const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("thank you for your feedback");
  });

  app.post("/api/surveys/webhooks", async (req, res) => {
    try {
      // Ensure req.body is always an array (convert single object into an array)
      const events = Array.isArray(req.body) ? req.body : [req.body];

      const p = new Path("/api/surveys/:surveyId/:choice");

      const extractedEvents = events.map(({ email, link }) => {
        const match = p.test(new URL(link).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      });

      const compactEvents = _.compact(extractedEvents); // Remove undefined entries
      const uniqueEvents = _.uniqBy(
        compactEvents,
        (e) => `${e.email}-${e.surveyId}`
      );

      console.log("✅ Unique Events:", uniqueEvents);

      for (let { email, choice, surveyId } of uniqueEvents) {
        try {
          const surveyObjectId = new mongoose.Types.ObjectId(surveyId); // Convert to ObjectId

          const result = await Survey.updateOne(
            {
              _id: surveyObjectId,
              "recipients.email": email,
              "recipients.responded": { $ne: true }, // Prevent duplicate responses
            },
            {
              $inc: { [choice]: 1 },
              $set: { "recipients.$.responded": true },
              lastResponded: new Date()
            }
          );

          console.log(`🔄 Update result for ${email}:`, result);
        } catch (error) {
          console.error(
            `❌ Error updating survey response for ${email}:`,
            error
          );
        }
      }

      res.send({ message: "Responses recorded successfully" });
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    try {
      // Send email via EmailService
      await EmailService.sendEmail(survey, surveyTemplate(survey));

      // Save the survey after email is sent
      await survey.save();

      // Deduct credit and save user
      req.user.credits -= 1;
      const user = await req.user.save();

      // Send a single response with user data
      res.status(200).json({
        message: "Survey created and email sent successfully",
        user,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Email sending failed" });
    }
  });
};
