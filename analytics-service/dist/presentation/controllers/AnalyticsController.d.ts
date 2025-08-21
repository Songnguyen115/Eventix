import { Request, Response } from 'express';
import { TrackAnalyticsEventUseCase } from '../../application/use-cases/TrackAnalyticsEventUseCase';
import { GenerateDashboardMetricsUseCase } from '../../application/use-cases/GenerateDashboardMetricsUseCase';
import { GenerateReportUseCase } from '../../application/use-cases/GenerateReportUseCase';
export declare class AnalyticsController {
    private trackAnalyticsEventUseCase;
    private generateDashboardMetricsUseCase;
    private generateReportUseCase;
    constructor(trackAnalyticsEventUseCase: TrackAnalyticsEventUseCase, generateDashboardMetricsUseCase: GenerateDashboardMetricsUseCase, generateReportUseCase: GenerateReportUseCase);
    trackEvent(req: Request, res: Response): Promise<void>;
    trackBatchEvents(req: Request, res: Response): Promise<void>;
    generateMetrics(req: Request, res: Response): Promise<void>;
    getMetricsByEvent(req: Request, res: Response): Promise<void>;
    getDashboardMetrics(req: Request, res: Response): Promise<void>;
    generateReport(req: Request, res: Response): Promise<void>;
    getReportStatus(req: Request, res: Response): Promise<void>;
    getAnalyticsSummary(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AnalyticsController.d.ts.map