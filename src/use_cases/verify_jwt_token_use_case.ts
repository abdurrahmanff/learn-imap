import AuthTokenManager from '../services/auth_token_manager';

class VerifyJWTTokenUseCase {
  private readonly authTokenManager = new AuthTokenManager();

  public readonly execute = async (token: string) => {
    return this.authTokenManager.verifyToken(token);
  };
}

export default VerifyJWTTokenUseCase;
