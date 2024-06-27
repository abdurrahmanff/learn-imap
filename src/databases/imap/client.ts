import Imap from 'node-imap';

class ImapClient {
  public imap: Imap;

  constructor({ email, host, password }: ClientPayload) {
    this.imap = new Imap({
      user: email,
      password,
      host,
      port: 993,
      tls: true,
    });
  }
}

export default ImapClient;
