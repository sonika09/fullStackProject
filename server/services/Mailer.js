const SibApiV3Sdk = require("sib-api-v3-sdk");
const keys = require("../config/keys");

class EmailService {
  constructor() {
    // Initialize Brevo API Client
    this.defaultClient = SibApiV3Sdk.ApiClient.instance;
    this.apiKey = this.defaultClient.authentications["api-key"];
    this.apiKey.apiKey = keys.brevoEmailKey;

    // Create instance for sending emails
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendEmail(survey, emailTemplate) {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Configure the email details
    sendSmtpEmail.subject = survey.subject;
    sendSmtpEmail.htmlContent = emailTemplate;
    sendSmtpEmail.sender = { name: "Emaily", email: "sonikasoni0517@gmail.com" };
    sendSmtpEmail.to = survey.recipients.map((recipient) => ({
      email: recipient.email,
    }));
    sendSmtpEmail.replyTo = { email: "sonikasoni0909@gmail.com.com", name: "Support" };
    sendSmtpEmail.headers = { "Custom-Header": "Survey-Email" };

    try {
      // Send the email using Brevo API
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Email service error");
    }
  }
}

module.exports = new EmailService(); // Export as an instance
