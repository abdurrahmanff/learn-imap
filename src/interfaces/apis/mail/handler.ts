import { NextFunction, Request, Response } from 'express';
import SearchMailByMessageIdUseCase from '../../../use_cases/search_mail_by_message_id_use_case';
import GetMailBoxesUseCase from '../../../use_cases/get_mail_boxes_use_case';
import GetMailListFromBoxUseCase from '../../../use_cases/get_mail_list_use_case';
import SendMailUseCase from '../../../use_cases/send_mail_use_case';

class MailHandler {
  getMailListHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { user } = res.locals;
    const getMailListUseCase = new GetMailListFromBoxUseCase();
    const mailList = await getMailListUseCase.execute({
      email: user!.email,
      password: user!.password,
      host: user!.host,
    });
    return res.status(200).send({
      success: true,
      message: 'Get mail list success.',
      data: mailList,
    });
  };

  searchMailByMessageIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { user } = res.locals;
    const { messageId } = req.query;
    const searchMailByMessageIdUseCase = new SearchMailByMessageIdUseCase();
    const mailList = await searchMailByMessageIdUseCase.execute({
      email: user!.email,
      password: user!.password,
      host: user!.host,
      messageId: messageId as string,
    });
    return res.status(200).send({
      success: true,
      message: 'Search mail by message id success.',
      data: mailList,
    });
  };

  getMailBoxesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { user } = res.locals;
    const getMailBoxesUseCase = new GetMailBoxesUseCase();
    const mailBoxes = await getMailBoxesUseCase.execute({
      email: user!.email,
      password: user!.password,
      host: user!.host,
    });
    return res.status(200).send({
      success: true,
      message: 'Get mail boxes success.',
      data: mailBoxes,
    });
  };

  sendMailHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    const mail = req.body;

    const sendMailUseCase = new SendMailUseCase();
    const result = await sendMailUseCase.execute({
      email: user!.email,
      password: user!.password,
      host: user!.host,
      mail,
    });

    return res.status(200).send({
      success: true,
      message: 'Send mail success.',
      data: result,
    });
  };
}

export default MailHandler;
