"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageSurveyUseCase = void 0;
const Survey_1 = require("../../domain/entities/Survey");
class ManageSurveyUseCase {
    constructor(surveyRepository) {
        this.surveyRepository = surveyRepository;
    }
    async createSurvey(survey) {
        return await this.surveyRepository.createSurvey(survey);
    }
    async updateSurvey(id, updates) {
        return await this.surveyRepository.updateSurvey(id, updates);
    }
    async activateSurvey(id) {
        return await this.surveyRepository.activateSurvey(id);
    }
    async deactivateSurvey(id) {
        return await this.surveyRepository.deactivateSurvey(id);
    }
    async deleteSurvey(id) {
        return await this.surveyRepository.deleteSurvey(id);
    }
    async getSurveys(filters) {
        return await this.surveyRepository.getSurveys(filters);
    }
    async getSurveyById(id) {
        return await this.surveyRepository.getSurveyById(id);
    }
    async addQuestion(data) {
        const question = {
            ...data,
            required: data.required || false,
            orderIndex: data.orderIndex || 0,
        };
        return await this.surveyRepository.createSurveyQuestion(question);
    }
    async updateQuestion(id, updates) {
        return await this.surveyRepository.updateSurveyQuestion(id, updates);
    }
    async deleteQuestion(id) {
        return await this.surveyRepository.deleteSurveyQuestion(id);
    }
    async reorderQuestions(surveyId, questionIds) {
        return await this.surveyRepository.reorderQuestions(surveyId, questionIds);
    }
    async getSurveyQuestions(surveyId) {
        return await this.surveyRepository.getSurveyQuestions(surveyId);
    }
    async submitResponse(data) {
        const response = {
            ...data,
        };
        return await this.surveyRepository.createSurveyResponse(response);
    }
    async getSurveyResponses(filters) {
        return await this.surveyRepository.getSurveyResponses(filters);
    }
    async getSurveyResponseSummary(surveyId) {
        return await this.surveyRepository.getSurveyResponseSummary(surveyId);
    }
    async distributeSurveyToAttendees(surveyId, attendeeIds) {
        const distributions = [];
        for (const attendeeId of attendeeIds) {
            const distribution = await this.surveyRepository.createSurveyDistribution({
                surveyId,
                attendeeId,
                userId: undefined,
                email: undefined,
                status: Survey_1.DistributionStatus.PENDING,
                reminderCount: 0
            });
            distributions.push(distribution);
        }
        return distributions;
    }
    async distributeSurveyToUsers(surveyId, userIds) {
        const distributions = [];
        for (const userId of userIds) {
            const distribution = await this.surveyRepository.createSurveyDistribution({
                surveyId,
                attendeeId: undefined,
                userId,
                email: undefined,
                status: Survey_1.DistributionStatus.PENDING,
                reminderCount: 0
            });
            distributions.push(distribution);
        }
        return distributions;
    }
    async distributeSurveyToEmails(surveyId, emails) {
        const distributions = [];
        for (const email of emails) {
            const distribution = await this.surveyRepository.createSurveyDistribution({
                surveyId,
                attendeeId: undefined,
                userId: undefined,
                email,
                status: Survey_1.DistributionStatus.PENDING,
                reminderCount: 0
            });
            distributions.push(distribution);
        }
        return distributions;
    }
    async sendSurveyInvitation(distributionId) {
        return await this.surveyRepository.sendSurveyInvitation(distributionId);
    }
    async sendSurveyReminder(distributionId) {
        return await this.surveyRepository.sendSurveyReminder(distributionId);
    }
    async trackSurveyOpen(distributionId) {
        return await this.surveyRepository.trackSurveyOpen(distributionId);
    }
    async trackSurveyCompletion(distributionId) {
        return await this.surveyRepository.trackSurveyCompletion(distributionId);
    }
    async getSurveyDistributions(filters) {
        return await this.surveyRepository.getSurveyDistributions(filters);
    }
}
exports.ManageSurveyUseCase = ManageSurveyUseCase;
