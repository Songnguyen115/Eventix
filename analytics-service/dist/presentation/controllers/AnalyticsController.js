"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
class AnalyticsController {
    constructor(trackAnalyticsEventUseCase, generateDashboardMetricsUseCase, generateReportUseCase) {
        this.trackAnalyticsEventUseCase = trackAnalyticsEventUseCase;
        this.generateDashboardMetricsUseCase = generateDashboardMetricsUseCase;
        this.generateReportUseCase = generateReportUseCase;
    }
    async trackEvent(req, res) {
        try {
            const { eventId, eventType, userId, sessionId, metadata } = req.body;
            if (!eventId || !eventType) {
                res.status(400).json({
                    success: false,
                    error: 'eventId and eventType are required'
                });
                return;
            }
            const analyticsEvent = await this.trackAnalyticsEventUseCase.execute({
                eventId,
                eventType: eventType,
                userId,
                sessionId,
                metadata
            });
            res.status(201).json({
                success: true,
                data: analyticsEvent
            });
        }
        catch (error) {
            console.error('Error tracking analytics event:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async trackBatchEvents(req, res) {
        try {
            const { events } = req.body;
            if (!Array.isArray(events) || events.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'events array is required and must not be empty'
                });
                return;
            }
            const analyticsEvents = await this.trackAnalyticsEventUseCase.executeBatch(events);
            res.status(201).json({
                success: true,
                data: analyticsEvents,
                count: analyticsEvents.length
            });
        }
        catch (error) {
            console.error('Error tracking batch analytics events:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async generateMetrics(req, res) {
        try {
            const { eventId, category, period, startDate, endDate } = req.query;
            if (!period || !startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    error: 'period, startDate, and endDate are required'
                });
                return;
            }
            const metrics = await this.generateDashboardMetricsUseCase.execute({
                eventId: eventId,
                category: category,
                period: period,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });
            res.status(200).json({
                success: true,
                data: metrics,
                count: metrics.length
            });
        }
        catch (error) {
            console.error('Error generating dashboard metrics:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getMetricsByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const { period = 'daily', startDate, endDate } = req.query;
            const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate ? new Date(endDate) : new Date();
            const metrics = await this.generateDashboardMetricsUseCase.execute({
                eventId,
                period: period,
                startDate: start,
                endDate: end
            });
            res.status(200).json({
                success: true,
                data: metrics,
                count: metrics.length
            });
        }
        catch (error) {
            console.error('Error getting metrics by event:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getDashboardMetrics(req, res) {
        try {
            const { eventId, period, start, end } = req.query;
            if (!period || !start || !end) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required parameters: period, start, end'
                });
                return;
            }
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid date format'
                });
                return;
            }
            const metrics = await this.generateDashboardMetricsUseCase.execute({
                eventId: eventId,
                period: period,
                startDate,
                endDate
            });
            const groupedMetrics = metrics.reduce((acc, metric) => {
                const category = metric.category || 'other';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(metric);
                return acc;
            }, {});
            res.json({
                success: true,
                data: {
                    metrics,
                    groupedMetrics,
                    summary: {
                        total: metrics.length,
                        byCategory: Object.keys(groupedMetrics).map(category => ({
                            category,
                            count: groupedMetrics[category].length
                        }))
                    }
                }
            });
        }
        catch (error) {
            console.error('Error getting dashboard metrics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get dashboard metrics'
            });
        }
    }
    async generateReport(req, res) {
        try {
            const { reportName, reportType, eventId, filters } = req.body;
            if (!reportName || !reportType) {
                res.status(400).json({
                    success: false,
                    error: 'reportName and reportType are required'
                });
                return;
            }
            const report = await this.generateReportUseCase.execute({
                reportName,
                reportType: reportType,
                eventId,
                generatedBy: req.user?.id || 'system',
                filters
            });
            res.status(201).json({
                success: true,
                data: report
            });
        }
        catch (error) {
            console.error('Error generating report:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getReportStatus(req, res) {
        try {
            const { reportId } = req.params;
            res.status(200).json({
                success: true,
                data: {
                    id: reportId,
                    status: 'COMPLETED',
                    progress: 100
                }
            });
        }
        catch (error) {
            console.error('Error getting report status:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getAnalyticsSummary(req, res) {
        try {
            const { eventId } = req.params;
            const { period = 'daily' } = req.query;
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = new Date();
            const metrics = await this.generateDashboardMetricsUseCase.execute({
                eventId,
                period: period,
                startDate,
                endDate
            });
            const summary = metrics.reduce((acc, metric) => {
                if (!acc[metric.category || 'other']) {
                    acc[metric.category || 'other'] = [];
                }
                acc[metric.category || 'other'].push(metric);
                return acc;
            }, {});
            res.status(200).json({
                success: true,
                data: {
                    eventId,
                    period,
                    summary,
                    totalMetrics: metrics.length,
                    generatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error('Error getting analytics summary:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
