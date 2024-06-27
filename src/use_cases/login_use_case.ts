import AuthTokenManager from '../services/auth_token_manager';

class LoginUseCase {
  private readonly authTokenManager = new AuthTokenManager();

  public readonly execute = async (payload: {
    [key: string]: string;
  }): Promise<string> => {
    return this.authTokenManager.generateToken(payload);
  };
}

export default LoginUseCase;
