import { NextFunction, Request, Response } from 'express';
import LoginUseCase from '../../../use_cases/login_use_case';

type LoginRequest = Omit<Request, 'body'> & {
  body: { email: string; password: string; host: string };
};

class AuthHandler {
  private readonly loginUseCase = new LoginUseCase();

  public readonly loginHandler = async (
    req: LoginRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password, host } = req.body;
    const token = await this.loginUseCase.execute({
      email,
      password,
      host,
    });
    console.log(token);
    return res.status(201).send({
      success: true,
      message: 'Login success.',
      data: token,
    });
  };
}

export default AuthHandler;
