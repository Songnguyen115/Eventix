import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventType } from '../../domain/entities/AnalyticsEvent';
import { v4 as uuidv4 } from 'uuid';

export class TrackAnalyticsEventUseCase {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(data: {
    eventId: string;
    eventType: AnalyticsEventType;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }): Promise<AnalyticsEvent> {
    const analyticsEvent: Omit<AnalyticsEvent, 'id'> = {
      ...data,
      timestamp: new Date(),
    };

    return await this.analyticsRepository.createAnalyticsEvent(analyticsEvent);
  }

  async executeBatch(events: Array<{
    eventId: string;
    eventType: AnalyticsEventType;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }>): Promise<AnalyticsEvent[]> {
    const analyticsEvents = events.map(event => ({
      ...event,
      timestamp: new Date(),
    }));

    const results: AnalyticsEvent[] = [];
    for (const event of analyticsEvents) {
      const result = await this.analyticsRepository.createAnalyticsEvent(event);
      results.push(result);
    }

    return results;
  }
}
