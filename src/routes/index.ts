import express, { NextFunction, Response, Request } from 'express';
import { isLoggedIn } from './../middleware/passport';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('home');
}); // gets all authors

router.get('/dashboard', isLoggedIn, (req: Request, res: Response) => {
  res.render('dashboard');
});

export default router;
