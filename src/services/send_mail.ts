import boxes from '../common/enums/boxes';
import ImapClient from '../databases/imap/client';
import MailerClient from '../databases/nodemailer/client';
import MailRepository from '../repositories/mail';

class SendMailService {
  private readonly mailRepository = new MailRepository();

  readonly send = async ({ mail, ...cred }: SendMailPayload) => {
    const mailerClient = new MailerClient(cred);

    const messageId = `<${crypto.randomUUID()}@wooblazz.com>`;
    mail.headers = {
      ...mail.headers,
      'Message-ID': messageId,
    };
    const result = await mailerClient.sendMail(mail);

    const imapClient = new ImapClient(cred);

    imapClient.imap.once('ready', async () => {
      await this.mailRepository.saveMailToBox(
        imapClient,
        boxes.SENT.path,
        mail,
        ['Seen'],
      );
      imapClient.imap.end();
    });
    imapClient.imap.connect();

    return result;
  };
}

export default SendMailService;
