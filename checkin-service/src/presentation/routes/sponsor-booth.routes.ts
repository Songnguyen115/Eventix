import { Router } from 'express';
import { SponsorBoothController } from '../controllers/SponsorBoothController';
import { authMiddleware } from '../middleware/authMiddleware';
import { sponsorAuthMiddleware } from '../middleware/sponsorAuthMiddleware';

export function createSponsorBoothRoutes(sponsorBoothController: SponsorBoothController): Router {
  const router = Router();

  // Create new sponsor booth (requires sponsor authentication)
  router.post('/booth', sponsorAuthMiddleware, (req, res) => {
    sponsorBoothController.createBooth(req, res);
  });

  // Update sponsor booth (requires sponsor authentication)
  router.put('/booth/:id', sponsorAuthMiddleware, (req, res) => {
    sponsorBoothController.updateBooth(req, res);
  });

  // Add visitor to booth (requires authentication)
  router.post('/booth/visitor', authMiddleware, (req, res) => {
    sponsorBoothController.addBoothVisitor(req, res);
  });

  // Get booth visitors (requires sponsor authentication)
  router.get('/booth/:boothId/visitors', sponsorAuthMiddleware, (req, res) => {
    sponsorBoothController.getBoothVisitors(req, res);
  });

  // Get booth statistics (requires sponsor authentication)
  router.get('/booth/:boothId/stats', sponsorAuthMiddleware, (req, res) => {
    sponsorBoothController.getBoothStats(req, res);
  });

  return router;
}
