import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

class MailerClient {
  public transporter: Transporter;

  constructor({ email, host, password }: ClientPayload) {
    this.transporter = createTransport({
      host,
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  async sendMail(mail: SendMailOptions) {
    return this.transporter.sendMail(mail);
  }
}

export default MailerClient;
