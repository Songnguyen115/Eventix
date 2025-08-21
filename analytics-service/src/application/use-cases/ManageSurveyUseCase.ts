import { ISurveyRepository } from '../../domain/repositories/ISurveyRepository';
import { Survey, SurveyQuestion, SurveyResponse, SurveyDistribution, SurveyType, SurveyStatus, QuestionType, DistributionStatus } from '../../domain/entities/Survey';
import { v4 as uuidv4 } from 'uuid';

export class ManageSurveyUseCase {
  constructor(private surveyRepository: ISurveyRepository) {}

  // Survey Management
  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    return await this.surveyRepository.createSurvey(survey);
  }

  async updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey> {
    return await this.surveyRepository.updateSurvey(id, updates);
  }

  async activateSurvey(id: string): Promise<Survey> {
    return await this.surveyRepository.activateSurvey(id);
  }

  async deactivateSurvey(id: string): Promise<Survey> {
    return await this.surveyRepository.deactivateSurvey(id);
  }

  async deleteSurvey(id: string): Promise<boolean> {
    return await this.surveyRepository.deleteSurvey(id);
  }

  async getSurveys(filters: {
    eventId?: string;
    surveyType?: string;
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Survey[]> {
    return await this.surveyRepository.getSurveys(filters);
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    return await this.surveyRepository.getSurveyById(id);
  }

  // Survey Questions Management
  async addQuestion(data: {
    surveyId: string;
    questionText: string;
    questionType: QuestionType;
    options?: string[];
    required?: boolean;
    orderIndex?: number;
  }): Promise<SurveyQuestion> {
    const question: Omit<SurveyQuestion, 'id' | 'createdAt'> = {
      ...data,
      required: data.required || false,
      orderIndex: data.orderIndex || 0,
    };

    return await this.surveyRepository.createSurveyQuestion(question);
  }

  async updateQuestion(id: string, updates: Partial<SurveyQuestion>): Promise<SurveyQuestion> {
    return await this.surveyRepository.updateSurveyQuestion(id, updates);
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return await this.surveyRepository.deleteSurveyQuestion(id);
  }

  async reorderQuestions(surveyId: string, questionIds: string[]): Promise<boolean> {
    return await this.surveyRepository.reorderQuestions(surveyId, questionIds);
  }

  async getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]> {
    return await this.surveyRepository.getSurveyQuestions(surveyId);
  }

  // Survey Responses
  async submitResponse(data: {
    surveyId: string;
    questionId: string;
    attendeeId?: string;
    userId?: string;
    responseValue: string;
    responseMetadata?: Record<string, any>;
  }): Promise<SurveyResponse> {
    const response: Omit<SurveyResponse, 'id' | 'submittedAt'> = {
      ...data,
    };

    return await this.surveyRepository.createSurveyResponse(response);
  }

  async getSurveyResponses(filters: {
    surveyId?: string;
    questionId?: string;
    attendeeId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<SurveyResponse[]> {
    return await this.surveyRepository.getSurveyResponses(filters);
  }

  async getSurveyResponseSummary(surveyId: string): Promise<any> {
    return await this.surveyRepository.getSurveyResponseSummary(surveyId);
  }

  // Survey Distribution
  async distributeSurveyToAttendees(surveyId: string, attendeeIds: string[]): Promise<SurveyDistribution[]> {
    const distributions: SurveyDistribution[] = [];
    
    for (const attendeeId of attendeeIds) {
      const distribution = await this.surveyRepository.createSurveyDistribution({
        surveyId,
        attendeeId,
        userId: undefined,
        email: undefined,
        status: DistributionStatus.PENDING,
        reminderCount: 0
      });
      distributions.push(distribution);
    }
    
    return distributions;
  }

  async distributeSurveyToUsers(surveyId: string, userIds: string[]): Promise<SurveyDistribution[]> {
    const distributions: SurveyDistribution[] = [];
    
    for (const userId of userIds) {
      const distribution = await this.surveyRepository.createSurveyDistribution({
        surveyId,
        attendeeId: undefined,
        userId,
        email: undefined,
        status: DistributionStatus.PENDING,
        reminderCount: 0
      });
      distributions.push(distribution);
    }
    
    return distributions;
  }

  async distributeSurveyToEmails(surveyId: string, emails: string[]): Promise<SurveyDistribution[]> {
    const distributions: SurveyDistribution[] = [];
    
    for (const email of emails) {
      const distribution = await this.surveyRepository.createSurveyDistribution({
        surveyId,
        attendeeId: undefined,
        userId: undefined,
        email,
        status: DistributionStatus.PENDING,
        reminderCount: 0
      });
      distributions.push(distribution);
    }
    
    return distributions;
  }

  async sendSurveyInvitation(distributionId: string): Promise<boolean> {
    return await this.surveyRepository.sendSurveyInvitation(distributionId);
  }

  async sendSurveyReminder(distributionId: string): Promise<boolean> {
    return await this.surveyRepository.sendSurveyReminder(distributionId);
  }

  async trackSurveyOpen(distributionId: string): Promise<boolean> {
    return await this.surveyRepository.trackSurveyOpen(distributionId);
  }

  async trackSurveyCompletion(distributionId: string): Promise<boolean> {
    return await this.surveyRepository.trackSurveyCompletion(distributionId);
  }

  async getSurveyDistributions(filters: {
    surveyId?: string;
    attendeeId?: string;
    userId?: string;
    email?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SurveyDistribution[]> {
    return await this.surveyRepository.getSurveyDistributions(filters);
  }
}
