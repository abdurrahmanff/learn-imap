import { Router } from 'express';
import AuthHandler from './handler';

const router = Router();
const handler = new AuthHandler();

router.post('/', handler.loginHandler);

export default router;
