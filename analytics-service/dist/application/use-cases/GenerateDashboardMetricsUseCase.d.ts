import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { DashboardMetric, MetricPeriod } from '../../domain/entities/DashboardMetric';
export declare class GenerateDashboardMetricsUseCase {
    private analyticsRepository;
    constructor(analyticsRepository: IAnalyticsRepository);
    execute(filters: {
        eventId?: string;
        category?: string;
        period: MetricPeriod;
        startDate: Date;
        endDate: Date;
    }): Promise<DashboardMetric[]>;
    private calculateAttendanceMetrics;
    private calculateRevenueMetrics;
    private calculateEngagementMetrics;
    private calculateSurveyMetrics;
}
//# sourceMappingURL=GenerateDashboardMetricsUseCase.d.ts.map