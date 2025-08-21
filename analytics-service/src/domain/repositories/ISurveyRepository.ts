import { Survey } from '../entities/Survey';
import { SurveyQuestion } from '../entities/Survey';
import { SurveyResponse } from '../entities/Survey';
import { SurveyDistribution } from '../entities/Survey';

export interface ISurveyRepository {
  // Surveys
  createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
  getSurveys(filters: {
    eventId?: string;
    surveyType?: string;
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Survey[]>;
  getSurveyById(id: string): Promise<Survey | null>;
  updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey>;
  deleteSurvey(id: string): Promise<boolean>;
  activateSurvey(id: string): Promise<Survey>;
  deactivateSurvey(id: string): Promise<Survey>;

  // Survey Questions
  createSurveyQuestion(question: Omit<SurveyQuestion, 'id' | 'createdAt'>): Promise<SurveyQuestion>;
  getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]>;
  getSurveyQuestionById(id: string): Promise<SurveyQuestion | null>;
  updateSurveyQuestion(id: string, updates: Partial<SurveyQuestion>): Promise<SurveyQuestion>;
  deleteSurveyQuestion(id: string): Promise<boolean>;
  reorderQuestions(surveyId: string, questionIds: string[]): Promise<boolean>;

  // Survey Responses
  createSurveyResponse(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse>;
  getSurveyResponses(filters: {
    surveyId?: string;
    questionId?: string;
    attendeeId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<SurveyResponse[]>;
  getSurveyResponseById(id: string): Promise<SurveyResponse | null>;
  updateSurveyResponse(id: string, updates: Partial<SurveyResponse>): Promise<SurveyResponse>;
  deleteSurveyResponse(id: string): Promise<boolean>;
  getSurveyResponseSummary(surveyId: string): Promise<any>;

  // Survey Distribution
  createSurveyDistribution(distribution: Omit<SurveyDistribution, 'id'>): Promise<SurveyDistribution>;
  getSurveyDistributions(filters: {
    surveyId?: string;
    attendeeId?: string;
    userId?: string;
    email?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SurveyDistribution[]>;
  getSurveyDistributionById(id: string): Promise<SurveyDistribution | null>;
  updateSurveyDistribution(id: string, updates: Partial<SurveyDistribution>): Promise<SurveyDistribution>;
  deleteSurveyDistribution(id: string): Promise<boolean>;
  sendSurveyInvitation(distributionId: string): Promise<boolean>;
  sendSurveyReminder(distributionId: string): Promise<boolean>;
  trackSurveyOpen(distributionId: string): Promise<boolean>;
  trackSurveyCompletion(distributionId: string): Promise<boolean>;
}
