import boxes from '../common/enums/boxes';
import ImapClient from '../databases/imap/client';
import MailRepository from '../repositories/mail';

class MailBoxService {
  private readonly mailrepository = new MailRepository();

  readonly searchAllBoxes = async (
    clientPayload: ClientPayload,
    messageId: string,
  ): Promise<Mail[]> => {
    const mailList: Mail[] = [];
    const client = new ImapClient(clientPayload);

    client.imap.once('ready', async () => {
      for (const box of Object.values(boxes)) {
        const mails = await this.mailrepository.searchMailInBoxByMessageId(
          client,
          box.path,
          messageId,
        );
        mailList.push(...mails);
      }

      client.imap.end();
    });
    client.imap.connect();

    return new Promise((resolve) => {
      client.imap.once('close', () => {
        resolve(mailList);
      });
    });
  };
}

export default MailBoxService;
