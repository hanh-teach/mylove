import { Router } from 'express';
import { videoController } from '../controllers/videoController';
import { validateGenerateVideo } from '../validators/videoValidator';

const router = Router();

router.post('/generate-video', validateGenerateVideo, (req, res, next) => {
  videoController.generateVideo(req, res, next).catch(next);
});

export default router;
