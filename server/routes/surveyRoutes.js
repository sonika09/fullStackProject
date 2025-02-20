const requireLogin = require("../middleware/requireLogin");
const requireCredits = require("../middleware/requireCredits");
const surveyTemplate = require("../services/emailTemplate/surveyTemplate");
const EmailService = require("../services/Mailer"); // Import EmailService
const mongoose = require("mongoose");
const Survey = mongoose.model("surveys");

// module.exports = (app) => {
//   app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
//     const { title, subject, body, recipients } = req.body;

//     const survey = new Survey({
//       title,
//       subject,
//       body,
//       recipients: recipients
//         .split(",")
//         .map((email) => ({ email: email.trim() })),
//       _user: req.user.id,
//       dateSent: Date.now(),
//     });
   
//     // const mailer = new Mailer (survey, surveyTemplate(survey))
//     // await mailer.send()
//     // await survey.save()
//     //      req.user.credits -=1
//   // await req.user.save()


//     try {
//       // Send email via EmailService
//      await EmailService.sendEmail(survey, surveyTemplate(survey));
//       // Save the survey after email is sent
//      await survey.save();
//      req.user.credits -=1
//      const user = await req.user.save()
//      res.status(200).json({ message: "Survey created and email sent successfully" });
//     await res.send(user)
//     } catch (error) {
//       console.error("Error sending email:", error);
//       res.status(500).json({ error: "Email sending failed" });
//     }
//   });
// };

module.exports = (app) => {
app.get('/api/surveys/thanks', (req,res)=>{
  res.send('thank you for your feedback')
})


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
        user
      });

    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Email sending failed" });
    }
  });
};