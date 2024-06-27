import { NextFunction, Request, Response } from 'express';
import VerifyJWTTokenUseCase from '../../use_cases/verify_jwt_token_use_case';
import { JwtPayload } from 'jsonwebtoken';

class AuthMiddleware {
  public static async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const verifyJWTTokenUseCase = new VerifyJWTTokenUseCase();

    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }

      const decoded = await verifyJWTTokenUseCase.execute(token.split(' ')[1]);
      res.locals.user = decoded as JwtPayload;
      res.locals.isAuthenticated = true;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}

export default AuthMiddleware;
