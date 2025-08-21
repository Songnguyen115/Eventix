"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRoutes = createAnalyticsRoutes;
const express_1 = require("express");
function createAnalyticsRoutes(analyticsController) {
    const router = (0, express_1.Router)();
    router.post('/events', analyticsController.trackEvent.bind(analyticsController));
    router.post('/events/batch', analyticsController.trackBatchEvents.bind(analyticsController));
    router.get('/metrics', analyticsController.generateMetrics.bind(analyticsController));
    router.get('/events/:eventId/metrics', analyticsController.getMetricsByEvent.bind(analyticsController));
    router.post('/reports', analyticsController.generateReport.bind(analyticsController));
    router.get('/reports/:reportId/status', analyticsController.getReportStatus.bind(analyticsController));
    router.get('/events/:eventId/summary', analyticsController.getAnalyticsSummary.bind(analyticsController));
    return router;
}
