"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAnalyticsEventUseCase = void 0;
class TrackAnalyticsEventUseCase {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async execute(data) {
        const analyticsEvent = {
            ...data,
            timestamp: new Date(),
        };
        return await this.analyticsRepository.createAnalyticsEvent(analyticsEvent);
    }
    async executeBatch(events) {
        const analyticsEvents = events.map(event => ({
            ...event,
            timestamp: new Date(),
        }));
        const results = [];
        for (const event of analyticsEvents) {
            const result = await this.analyticsRepository.createAnalyticsEvent(event);
            results.push(result);
        }
        return results;
    }
}
exports.TrackAnalyticsEventUseCase = TrackAnalyticsEventUseCase;
