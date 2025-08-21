import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventType } from '../../domain/entities/AnalyticsEvent';
export declare class TrackAnalyticsEventUseCase {
    private analyticsRepository;
    constructor(analyticsRepository: IAnalyticsRepository);
    execute(data: {
        eventId: string;
        eventType: AnalyticsEventType;
        userId?: string;
        sessionId?: string;
        metadata?: Record<string, any>;
    }): Promise<AnalyticsEvent>;
    executeBatch(events: Array<{
        eventId: string;
        eventType: AnalyticsEventType;
        userId?: string;
        sessionId?: string;
        metadata?: Record<string, any>;
    }>): Promise<AnalyticsEvent[]>;
}
//# sourceMappingURL=TrackAnalyticsEventUseCase.d.ts.map