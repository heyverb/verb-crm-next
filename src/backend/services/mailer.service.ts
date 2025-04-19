import { sendEmailOtp } from "@/backend/templates/otp/SendOtp";
import * as nodemailer from "nodemailer";
import { Transporter, SendMailOptions } from "nodemailer";

export default class MailService {
  public mailTransporter: Transporter | undefined;
  private readonly host: string;
  private readonly port: number;
  private readonly secure: boolean = true;
  private readonly auth: {
    user: string;
    pass: string;
  };

  constructor() {
    this.host = process.env.SMTP_HOST!;
    this.port = +process.env.SMTP_PORT!;
    this.auth = {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    };
  }

  async transporter() {
    try {
      if (this.mailTransporter) {
        return this.mailTransporter;
      }

      this.mailTransporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: this.secure,
        auth: this.auth,
      });

      return this.mailTransporter;
    } catch (error) {
      console.log("Error creating transporter", error);
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    const HtmlOtpTemplate = sendEmailOtp(otp);
    try {
      const mail = await this.transporter();
      const res: SendMailOptions = await mail?.sendMail({
        from: '"OTP for VERB" <contact@wayverb.com>',
        to,
        subject: "OTP Verification",
        html: HtmlOtpTemplate,
      });
      return res;
    } catch (error: any) {
      if (error.message === "No recipients defined") {
        throw new Error("Email not found or invalid");
      }
      throw new Error("Error sending email");
    }
  }

  async sendEmail() {
    try {
      const mail = await this.transporter();
      const res: SendMailOptions = await mail?.sendMail({
        from: '"Hello from VERB" <contact@wayverb.com>', // sender address
        to: "abhinavthakur@gmail.com , shrmatwinkle246@gmail.com", // list of receivers
        subject: "Subject", // Subject line
        text: "", // plain text body
        html: "", // html body
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async sendEmailNotfication() {}
}
