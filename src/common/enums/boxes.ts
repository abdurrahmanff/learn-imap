const boxes: {
  [key: string]: BaseBox;
} = {
  INBOX: {
    name: 'INBOX',
    path: 'INBOX',
  },
  ARCHIVE: {
    name: 'Archive',
    path: 'INBOX.Archive',
  },
  SPAM: {
    name: 'spam',
    path: 'INBOX.spam',
  },
  TRASH: {
    name: 'Trash',
    path: 'INBOX.Trash',
  },
  SENT: {
    name: 'Sent',
    path: 'INBOX.Sent',
  },
  JUNK: {
    name: 'Junk',
    path: 'INBOX.Junk',
  },
  DRAFTS: {
    name: 'Drafts',
    path: 'INBOX.Drafts',
  },
};

export default boxes;
