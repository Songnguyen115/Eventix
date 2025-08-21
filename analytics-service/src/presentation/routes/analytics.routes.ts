import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';

export function createAnalyticsRoutes(analyticsController: AnalyticsController): Router {
  const router = Router();

  // Analytics Events
  router.post('/events', analyticsController.trackEvent.bind(analyticsController));
  router.post('/events/batch', analyticsController.trackBatchEvents.bind(analyticsController));

  // Dashboard Metrics - Simplified
  router.get('/metrics/:eventId', analyticsController.generateMetrics.bind(analyticsController));
  router.get('/dashboard/metrics/:eventId', analyticsController.generateMetrics.bind(analyticsController));
  router.get('/demo/dashboard/:eventId', analyticsController.getDemodashboard.bind(analyticsController));

  // Reports - Simplified
  router.get('/reports/attendance/:eventId', analyticsController.getAttendanceReport.bind(analyticsController));
  router.get('/reports/summary/:eventId', analyticsController.getEventSummaryReport.bind(analyticsController));
  router.get('/reports/stats', analyticsController.getQuickStats.bind(analyticsController));

  // Analytics Summary
  router.get('/events/:eventId/summary', analyticsController.getAnalyticsSummary.bind(analyticsController));

  return router;
}
