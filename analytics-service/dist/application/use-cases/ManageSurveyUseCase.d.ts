import { ISurveyRepository } from '../../domain/repositories/ISurveyRepository';
import { Survey, SurveyQuestion, SurveyResponse, SurveyDistribution, QuestionType } from '../../domain/entities/Survey';
export declare class ManageSurveyUseCase {
    private surveyRepository;
    constructor(surveyRepository: ISurveyRepository);
    createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
    updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey>;
    activateSurvey(id: string): Promise<Survey>;
    deactivateSurvey(id: string): Promise<Survey>;
    deleteSurvey(id: string): Promise<boolean>;
    getSurveys(filters: {
        eventId?: string;
        surveyType?: string;
        status?: string;
        createdBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<Survey[]>;
    getSurveyById(id: string): Promise<Survey | null>;
    addQuestion(data: {
        surveyId: string;
        questionText: string;
        questionType: QuestionType;
        options?: string[];
        required?: boolean;
        orderIndex?: number;
    }): Promise<SurveyQuestion>;
    updateQuestion(id: string, updates: Partial<SurveyQuestion>): Promise<SurveyQuestion>;
    deleteQuestion(id: string): Promise<boolean>;
    reorderQuestions(surveyId: string, questionIds: string[]): Promise<boolean>;
    getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]>;
    submitResponse(data: {
        surveyId: string;
        questionId: string;
        attendeeId?: string;
        userId?: string;
        responseValue: string;
        responseMetadata?: Record<string, any>;
    }): Promise<SurveyResponse>;
    getSurveyResponses(filters: {
        surveyId?: string;
        questionId?: string;
        attendeeId?: string;
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<SurveyResponse[]>;
    getSurveyResponseSummary(surveyId: string): Promise<any>;
    distributeSurveyToAttendees(surveyId: string, attendeeIds: string[]): Promise<SurveyDistribution[]>;
    distributeSurveyToUsers(surveyId: string, userIds: string[]): Promise<SurveyDistribution[]>;
    distributeSurveyToEmails(surveyId: string, emails: string[]): Promise<SurveyDistribution[]>;
    sendSurveyInvitation(distributionId: string): Promise<boolean>;
    sendSurveyReminder(distributionId: string): Promise<boolean>;
    trackSurveyOpen(distributionId: string): Promise<boolean>;
    trackSurveyCompletion(distributionId: string): Promise<boolean>;
    getSurveyDistributions(filters: {
        surveyId?: string;
        attendeeId?: string;
        userId?: string;
        email?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<SurveyDistribution[]>;
}
//# sourceMappingURL=ManageSurveyUseCase.d.ts.map