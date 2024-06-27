import ImapClient from '../databases/imap/client';
import MailRepository from '../repositories/mail';

class GetMailListFromBoxUseCase {
  private readonly mailRepository = new MailRepository();

  public readonly execute = async (payload: ClientPayload) => {
    const client = new ImapClient(payload);
    const mails: Mail[] = [];

    client.imap.once('ready', async () => {
      const result = await this.mailRepository.getMailListFromBox(client);
      mails.push(...result);
      client.imap.end();
    });
    client.imap.connect();

    return new Promise((resolve) => {
      client.imap.once('close', () => {
        resolve(mails);
      });
    });
  };
}

export default GetMailListFromBoxUseCase;
