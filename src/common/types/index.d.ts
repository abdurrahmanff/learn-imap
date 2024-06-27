import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Locals {
      user?: JwtPayload;
      isAuthenticated?: boolean;
    }
  }

  interface Mail {
    [key: string]: any;
  }

  interface MailBox extends BaseBox {
    attribs: string[];
    children: MailBox[];
    parentName?: string | null;
  }

  interface BaseBox {
    name: string;
    path: string;
  }

  interface ClientPayload {
    email: string;
    password: string;
    host: string;
  }

  interface SearchByMessageIdPayload extends ClientPayload {
    messageId: string;
  }
}
