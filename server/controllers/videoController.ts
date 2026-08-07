import { Request, Response, NextFunction } from 'express';
import { videoService } from '../services/videoService';
import { logger } from '../services/loggerService';
import { taskRepository } from '../repositories/taskRepository';
import { aiRouter } from '../utils/aiRouter';

export class VideoController {
  public async generateVideo(req: Request, res: Response, next: NextFunction) {
    const traceId = req.traceId || 'N/A';
    const user = (req.headers['x-user-email'] as string) || 'anonymous';

    try {
      const { title, message, scene, bgStyle, musicTrack, placedItems } = req.body;

      // Check which provider is routed
      const { provider, isFallbackToPreview } = aiRouter.routeVideo();

      if (provider.name === 'Agnes' && !isFallbackToPreview) {
        // Create an in-memory task
        const task = await taskRepository.createTask('pending');
        logger.info(`[VideoController] Created background task for Agnes AI video generation: ${task.taskId}`, { traceId, user });

        // Fire and forget the video generation in the background
        (async () => {
          try {
            await taskRepository.updateTask(task.taskId, { status: 'processing' });

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

            await taskRepository.updateTask(task.taskId, {
              status: 'completed',
              result
            });
            logger.info(`[VideoController] Background task ${task.taskId} completed successfully.`, { traceId, user });
          } catch (error: any) {
            logger.exception(error, {
              traceId,
              user,
              module: 'VideoController:BackgroundTask',
              api: 'POST /api/generate-video',
              taskId: task.taskId,
              originalError: error.message
            });

            await taskRepository.updateTask(task.taskId, {
              status: 'failed',
              error: error.message || 'Unknown error occurred during background video generation.'
            });
          }
        })();

        // Return 202 Accepted immediately
        return res.status(202).json({
          taskId: task.taskId,
          statusUrl: `/api/tasks/${task.taskId}`
        });
      }

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

      return res.json(result);
    } catch (error: any) {
      return next(error);
    }
  }

  public getTaskStatus(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    const task = taskRepository.getTask(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`
      });
    }

    return res.json(task);
  }
}

export const videoController = new VideoController();
