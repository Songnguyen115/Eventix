import { Pool } from 'mysql2/promise';
import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { AnalyticsEvent } from '../../domain/entities/AnalyticsEvent';
import { DashboardMetric, MetricPeriod } from '../../domain/entities/DashboardMetric';
import { Report } from '../../domain/entities/Report';
export declare class MySQLAnalyticsRepository implements IAnalyticsRepository {
    private pool;
    constructor(pool: Pool);
    createAnalyticsEvent(event: Omit<AnalyticsEvent, 'id'>): Promise<AnalyticsEvent>;
    getAnalyticsEvents(filters: {
        eventId?: string;
        userId?: string;
        eventType?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<AnalyticsEvent[]>;
    getAnalyticsEventById(id: string): Promise<AnalyticsEvent | null>;
    updateAnalyticsEvent(id: string, updates: Partial<AnalyticsEvent>): Promise<AnalyticsEvent>;
    deleteAnalyticsEvent(id: string): Promise<boolean>;
    createDashboardMetric(metric: Omit<DashboardMetric, 'id'>): Promise<DashboardMetric>;
    getDashboardMetrics(filters: {
        eventId?: string;
        category?: string;
        period?: MetricPeriod;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<DashboardMetric[]>;
    getDashboardMetricById(id: string): Promise<DashboardMetric | null>;
    updateDashboardMetric(id: string, updates: Partial<DashboardMetric>): Promise<DashboardMetric>;
    deleteDashboardMetric(id: string): Promise<boolean>;
    calculateMetrics(calculations: any[]): Promise<DashboardMetric[]>;
    createReport(report: Omit<Report, 'id'>): Promise<Report>;
    getReports(filters: {
        reportType?: string;
        eventId?: string;
        status?: string;
        generatedBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<Report[]>;
    getReportById(id: string): Promise<Report | null>;
    updateReport(id: string, updates: Partial<Report>): Promise<Report>;
    deleteReport(id: string): Promise<boolean>;
    generateReport(reportType: string, filters: any): Promise<Report>;
}
//# sourceMappingURL=MySQLAnalyticsRepository.d.ts.map