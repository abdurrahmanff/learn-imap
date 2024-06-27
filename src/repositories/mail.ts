import { MailBoxes } from 'node-imap';
import { simpleParser } from 'mailparser';
import boxes from '../common/enums/boxes';
import ImapClient from '../databases/imap/client';

class MailRepository {
  private readonly parseMail = async (buffer: string, mail: Mail) => {
    const parsed = await simpleParser(buffer);
    Object.entries(parsed).forEach(([key, value]) => {
      if (key === 'headers') {
        mail.headers = Object.fromEntries(value.entries());
        return;
      } else if (key === 'headerLines') {
        return;
      } else {
        mail[key] = value;
        return;
      }
    });
    return mail;
  };

  private readonly parseBoxes = (boxes: MailBoxes) => {
    const parsedBoxes: MailBox[] = [];

    for (const key of Object.keys(boxes)) {
      if (boxes[key].attribs.indexOf('\\HasChildren') > -1) {
        const children = this.parseBoxes(boxes[key].children);

        // Path name is [parentName].[childName]
        parsedBoxes.push({
          name: key,
          attribs: boxes[key].attribs,
          path: key,
          children: children,
        });
      } else {
        parsedBoxes.push({
          name: key,
          attribs: boxes[key].attribs,
          path: key,
          children: [],
        });
      }
    }

    return parsedBoxes;
  };

  private readonly openBox = async (
    client: ImapClient,
    boxPath: string = 'INBOX',
    callback: (...args: any[]) => void,
  ) => {
    client.imap.openBox(boxPath, true, callback);
  };

  public readonly getMailBoxes = async (
    client: ImapClient,
  ): Promise<MailBox[]> => {
    let mailBoxes: MailBoxes;

    client.imap.getBoxes((err, boxes) => {
      if (err) throw err;
      mailBoxes = boxes;
      client.imap.emit('done');
    });

    return new Promise((resolve) => {
      client.imap.once('done', () => {
        resolve(this.parseBoxes(mailBoxes));
      });
    });
  };

  public readonly getMailListFromBox = async (
    client: ImapClient,
    boxPath?: string,
  ): Promise<Mail[]> => {
    const mailList: Mail[] = [];

    this.openBox(client, boxPath, (err, box) => {
      if (err) throw err;
      const f = client.imap.seq.fetch('1:*', {
        bodies: '',
        struct: true,
      });

      f.on('message', (msg, seqno) => {
        const mail: Mail = {};
        mail.seqno = seqno;

        msg.once('attributes', (attrs) => {
          mail.attributes = attrs;
        });

        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', async () => {
            this.parseMail(buffer, mail);
            mailList.push(mail);
          });
        });
      });
      f.once('end', () => {
        client.imap.emit('done');
      });
    });

    return new Promise((resolve) => {
      client.imap.once('done', () => {
        resolve(mailList);
      });
    });
  };

  public readonly searchMailInBoxByMessageId = async (
    client: ImapClient,
    boxPath: string,
    messageId: string,
  ): Promise<Mail[]> => {
    const mailList: Mail[] = [];

    this.openBox(client, boxPath, (err, box) => {
      if (err) throw err;
      client.imap.search(
        ['ALL', ['HEADER', 'MESSAGE-ID', messageId]],
        (err, results) => {
          if (err) throw err;
          if (!results.length) {
            client.imap.closeBox(() => {});
            client.imap.emit('done');
            return;
          }

          const f = client.imap.fetch(results, {
            bodies: '',
            struct: true,
          });

          f.on('message', (msg, seqno) => {
            const mail: Mail = {};
            mail.seqno = seqno;

            msg.once('attributes', (attrs) => {
              mail.attributes = attrs;
            });

            msg.on('body', (stream) => {
              let buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', async () => {
                this.parseMail(buffer, mail);
                mailList.push(mail);
              });
            });
          });

          f.once('end', () => {
            client.imap.closeBox(() => {});
            client.imap.emit('done');
            return;
          });
        },
      );
    });

    return new Promise((resolve) => {
      client.imap.on('done', () => {
        resolve(mailList);
      });
    });
  };
}

export default MailRepository;
