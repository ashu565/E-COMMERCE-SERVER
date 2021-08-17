const nodemailer = require("nodemailer");
const AppError = require("../utils/AppError");
class Email {
  constructor(user, message) {
    this.to = user.email;
    this.name = user.first_name;
    this.from = "Louis World";
    this.message = message;
  }

  newTransporter() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    // Preparing mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: this.message,
    };
    // Creating transporter and sending mail using
    await this.newTransporter().sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log(err);
      }
      if (res) {
      }
    });
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
