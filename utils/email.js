const sgMail = require("@sendgrid/mail");

class Email {
  constructor(user, message) {
    this.to = user.email;
    this.name = user.first_name;
    this.from = `${process.env.EMAIL_FROM}`;
    this.message = message;
  }

  async send(subject) {
    // Preparing mail options
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: this.message,
      html: `<strong>${this.message}</strong>`,
    };
    // Creating transporter and sending mail using
    sgMail
      .send(mailOptions)
      .then(() => console.log("Email Sent"))
      .catch((err) => console.log("Error in sending mail", err));
  }
  async sendPasswordResetMessage() {
    await this.send("Your Password Reset Token is valid for next 10 minutes");
  }
  async sendWelcomeMessage() {
    await this.send(
      "WELCOME TO THE LOUIS WORLD,INDIA'S GREATEST E-COMMERCE APP"
    );
  }
}

module.exports = Email;
