export interface Survey {
    id: string;
    title: string;
    description?: string;
    eventId?: string;
    surveyType: SurveyType;
    status: SurveyStatus;
    startDate?: Date;
    endDate?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum SurveyType {
    POST_EVENT = "POST_EVENT",
    SPONSOR_FEEDBACK = "SPONSOR_FEEDBACK",
    GENERAL_FEEDBACK = "GENERAL_FEEDBACK"
}
export declare enum SurveyStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED"
}
export interface SurveyQuestion {
    id: string;
    surveyId: string;
    questionText: string;
    questionType: QuestionType;
    options?: string[];
    required: boolean;
    orderIndex: number;
    createdAt: Date;
}
export declare enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    SINGLE_CHOICE = "SINGLE_CHOICE",
    TEXT = "TEXT",
    RATING = "RATING",
    SCALE = "SCALE"
}
export interface SurveyResponse {
    id: string;
    surveyId: string;
    questionId: string;
    attendeeId?: string;
    userId?: string;
    responseValue: string;
    responseMetadata?: Record<string, any>;
    submittedAt: Date;
}
export interface SurveyDistribution {
    id: string;
    surveyId: string;
    attendeeId?: string;
    userId?: string;
    email: string;
    status: DistributionStatus;
    sentAt?: Date;
    openedAt?: Date;
    completedAt?: Date;
    reminderCount: number;
    lastReminderSent?: Date;
}
export declare enum DistributionStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    OPENED = "OPENED",
    COMPLETED = "COMPLETED",
    BOUNCED = "BOUNCED"
}
//# sourceMappingURL=Survey.d.ts.map