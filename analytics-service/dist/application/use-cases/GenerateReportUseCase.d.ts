import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { Report, ReportType } from '../../domain/entities/Report';
export declare class GenerateReportUseCase {
    private analyticsRepository;
    constructor(analyticsRepository: IAnalyticsRepository);
    execute(data: {
        reportName: string;
        reportType: ReportType;
        eventId?: string;
        generatedBy: string;
        filters?: any;
    }): Promise<Report>;
    private generateReportData;
    private generateAttendanceReport;
    private generateRevenueReport;
    private generateSurveyReport;
    private generateSponsorReport;
    private generateCustomReport;
}
//# sourceMappingURL=GenerateReportUseCase.d.ts.map