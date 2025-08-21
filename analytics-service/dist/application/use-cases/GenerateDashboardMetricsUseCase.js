"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateDashboardMetricsUseCase = void 0;
const uuid_1 = require("uuid");
class GenerateDashboardMetricsUseCase {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async execute(filters) {
        const metrics = [];
        if (!filters.category || filters.category === 'attendance') {
            const attendanceMetrics = await this.calculateAttendanceMetrics(filters);
            metrics.push(...attendanceMetrics);
        }
        if (!filters.category || filters.category === 'revenue') {
            const revenueMetrics = await this.calculateRevenueMetrics(filters);
            metrics.push(...revenueMetrics);
        }
        if (!filters.category || filters.category === 'engagement') {
            const engagementMetrics = await this.calculateEngagementMetrics(filters);
            metrics.push(...engagementMetrics);
        }
        if (!filters.category || filters.category === 'survey') {
            const surveyMetrics = await this.calculateSurveyMetrics(filters);
            metrics.push(...surveyMetrics);
        }
        return metrics;
    }
    async calculateAttendanceMetrics(filters) {
        const metrics = [];
        metrics.push({
            id: (0, uuid_1.v4)(),
            metricName: 'total_registrations',
            metricValue: 150,
            metricUnit: 'people',
            eventId: filters.eventId,
            category: 'attendance',
            period: filters.period,
            periodStart: filters.startDate,
            periodEnd: filters.endDate,
            calculatedAt: new Date(),
        });
        metrics.push({
            id: (0, uuid_1.v4)(),
            metricName: 'total_checkins',
            metricValue: 120,
            metricUnit: 'people',
            eventId: filters.eventId,
            category: 'attendance',
            period: filters.period,
            periodStart: filters.startDate,
            periodEnd: filters.endDate,
            calculatedAt: new Date(),
        });
        return metrics;
    }
    async calculateRevenueMetrics(filters) {
        const metrics = [];
        metrics.push({
            id: (0, uuid_1.v4)(),
            metricName: 'total_revenue',
            metricValue: 15000.00,
            metricUnit: 'VND',
            eventId: filters.eventId,
            category: 'revenue',
            period: filters.period,
            periodStart: filters.startDate,
            periodEnd: filters.endDate,
            calculatedAt: new Date(),
        });
        return metrics;
    }
    async calculateEngagementMetrics(filters) {
        const metrics = [];
        metrics.push({
            id: (0, uuid_1.v4)(),
            metricName: 'avg_session_duration',
            metricValue: 45.5,
            metricUnit: 'minutes',
            eventId: filters.eventId,
            category: 'engagement',
            period: filters.period,
            periodStart: filters.startDate,
            periodEnd: filters.endDate,
            calculatedAt: new Date(),
        });
        return metrics;
    }
    async calculateSurveyMetrics(filters) {
        const metrics = [];
        metrics.push({
            id: (0, uuid_1.v4)(),
            metricName: 'survey_response_rate',
            metricValue: 75.5,
            metricUnit: 'percentage',
            eventId: filters.eventId,
            category: 'survey',
            period: filters.period,
            periodStart: filters.startDate,
            periodEnd: filters.endDate,
            calculatedAt: new Date(),
        });
        return metrics;
    }
}
exports.GenerateDashboardMetricsUseCase = GenerateDashboardMetricsUseCase;
