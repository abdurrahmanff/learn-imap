import MailBoxService from '../services/mail_box';

class SearchMailByMessageIdUseCase {
  private readonly mailBoxService = new MailBoxService();

  public readonly execute = async (payload: SearchByMessageIdPayload) => {
    const mails = await this.mailBoxService.searchAllBoxes(
      { ...payload },
      payload.messageId,
    );
    return mails;
  };
}

export default SearchMailByMessageIdUseCase;
