import { Router } from 'express';
import MailHandler from './handler';
import AuthMiddleware from '../../middlewares/auth_middleware';

const router = Router();
const handler = new MailHandler();

router.get('/', AuthMiddleware.verifyToken, handler.getMailListHandler);
router.get(
  '/search',
  AuthMiddleware.verifyToken,
  handler.searchMailByMessageIdHandler,
);
router.get('/boxes', AuthMiddleware.verifyToken, handler.getMailBoxesHandler);
router.post('/send', AuthMiddleware.verifyToken, handler.sendMailHandler);

export default router;
