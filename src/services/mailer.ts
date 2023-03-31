import nodemailer from 'nodemailer';
import config from '../config';
import { Logger } from '../utils/logger';

class Email {
  private owner;
  private GmailOwner;
  private transporter;
  private GmailTransporter;

  constructor() {
    this.owner = {
      name: config.ETHEREAL_USERNAME,
      address: config.ETHEREAL_EMAIL
    };

    this.GmailOwner = {
      name: config.GMAIL_USERNAME,
      address: config.GMAIL_EMAIL
    };

    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.ETHEREAL_EMAIL,
        pass: config.ETHEREAL_PASSWORD
      }
    });

    this.GmailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.GMAIL_EMAIL,
        pass: config.GMAIL_PASSWORD
      }
    });
  }

  async sendEmail(dest: string, subject: string, content: string) {
    const mailOptions = {
      from: this.owner,
      to: dest,
      subject,
      html: content
    };

    Logger.info(`Sending email to ${dest}`);
    const response = await this.transporter.sendMail(mailOptions);
    return response;
  }

  async sendGmail(dest: string, subject: string, content: string, attachments?: any) {
    const mailOptions = {
      from: this.GmailOwner,
      to: dest,
      subject,
      html: content,
      attachments: attachments || []
    };

    Logger.info(`Sending gmail to ${dest}`);
    const response = await this.GmailTransporter.sendMail(mailOptions);
    return response;
  }
}

export const EmailService = new Email();
