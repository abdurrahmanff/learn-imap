import SendMailService from '../services/send_mail';

class SendMailUseCase {
  private readonly service = new SendMailService();

  async execute(payload: SendMailPayload) {
    return this.service.send(payload);
  }
}

export default SendMailUseCase;
