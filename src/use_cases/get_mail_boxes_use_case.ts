import ImapClient from '../databases/imap/client';
import MailRepository from '../repositories/mail';

class GetMailBoxesUseCase {
  private readonly mailRepository = new MailRepository();

  public readonly execute = async (payload: ClientPayload) => {
    const client = new ImapClient(payload);
    const mailBoxes: MailBox[] = [];

    client.imap.once('ready', async () => {
      const result = await this.mailRepository.getMailBoxes(client);
      mailBoxes.push(...result);
      client.imap.end();
    });
    client.imap.connect();

    return new Promise((resolve) => {
      client.imap.once('close', () => {
        resolve(mailBoxes);
      });
    });
  };
}

export default GetMailBoxesUseCase;
