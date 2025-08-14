import { Router } from 'express';
import { CheckInController } from '../controllers/CheckInController';
import { authMiddleware } from '../middleware/authMiddleware';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';

export function createCheckInRoutes(checkInController: CheckInController): Router {
  const router = Router();

  // Apply rate limiting to all check-in routes
  router.use(rateLimitMiddleware);

  // Check-in attendee (demo mode - auth disabled)
  router.post('/checkin', (req, res) => {
    checkInController.checkInAttendee(req, res);
  });

  // Get attendance report (demo mode - auth disabled)
  router.get('/attendance/:eventId', (req, res) => {
    checkInController.getAttendanceReport(req, res);
  });

  // Validate QR code (public endpoint for scanning)
  router.get('/validate-qr/:qrCode', (req, res) => {
    checkInController.getAttendeeByQrCode(req, res);
  });

  return router;
}
