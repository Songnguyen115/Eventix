export interface Report {
    id: string;
    reportName: string;
    reportType: ReportType;
    eventId?: string;
    generatedBy: string;
    filePath?: string;
    reportData?: Record<string, any>;
    status: ReportStatus;
    createdAt: Date;
    completedAt?: Date;
}
export declare enum ReportType {
    ATTENDANCE = "ATTENDANCE",
    REVENUE = "REVENUE",
    SURVEY = "SURVEY",
    SPONSOR = "SPONSOR",
    CUSTOM = "CUSTOM"
}
export declare enum ReportStatus {
    PENDING = "PENDING",
    GENERATING = "GENERATING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    reportType: ReportType;
    template: Record<string, any>;
    isDefault: boolean;
    createdAt: Date;
}
export interface ReportFilter {
    dateRange?: {
        start: Date;
        end: Date;
    };
    eventIds?: string[];
    categories?: string[];
    statuses?: string[];
    [key: string]: any;
}
//# sourceMappingURL=Report.d.ts.map