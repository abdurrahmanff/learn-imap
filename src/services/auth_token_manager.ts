import JWT from 'jsonwebtoken';

class AuthTokenManager {
  private readonly jwt = JWT;
  private readonly secret = 'secret';

  public readonly generateToken = async (payload: {
    [key: string]: string;
  }): Promise<string> => {
    return this.jwt.sign(payload, this.secret, { expiresIn: '7d' });
  };

  public readonly verifyToken = async (token: string) => {
    return this.jwt.verify(token, this.secret);
  };
}

export default AuthTokenManager;
