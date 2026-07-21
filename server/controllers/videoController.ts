import { Request, Response, NextFunction } from 'express';
import { videoService } from '../services/videoService';
import { logger } from '../services/loggerService';

export class VideoController {
  public async generateVideo(req: Request, res: Response, next: NextFunction) {
    const traceId = req.traceId || 'N/A';
    const user = (req.headers['x-user-email'] as string) || 'anonymous';

    try {
      const { title, message, scene, bgStyle, musicTrack, placedItems } = req.body;

      const result = await videoService.generateVideo(
        {
          title,
          message,
          scene,
          bgStyle,
          musicTrack,
          placedItems
        },
        { traceId, user }
      );

      return res.json({
        success: true,
        message: 'Successfully generated greeting card media assets!',
        code: 'SUCCESS',
        data: result,
        errors: null,
        traceId
      });
    } catch (error: any) {
      return next(error);
    }
  }
}

export const videoController = new VideoController();
