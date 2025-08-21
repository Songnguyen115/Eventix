import { Request, Response } from 'express';
import { ManageSurveyUseCase } from '../../application/use-cases/ManageSurveyUseCase';
export declare class SurveyController {
    private manageSurveyUseCase;
    constructor(manageSurveyUseCase: ManageSurveyUseCase);
    createSurvey(req: Request, res: Response): Promise<void>;
    updateSurvey(req: Request, res: Response): Promise<void>;
    activateSurvey(req: Request, res: Response): Promise<void>;
    deactivateSurvey(req: Request, res: Response): Promise<void>;
    deleteSurvey(req: Request, res: Response): Promise<void>;
    getSurveys(req: Request, res: Response): Promise<void>;
    getSurveyById(req: Request, res: Response): Promise<void>;
    addQuestion(req: Request, res: Response): Promise<void>;
    updateQuestion(req: Request, res: Response): Promise<void>;
    deleteQuestion(req: Request, res: Response): Promise<void>;
    getSurveyQuestions(req: Request, res: Response): Promise<void>;
    submitResponse(req: Request, res: Response): Promise<void>;
    getSurveyResponses(req: Request, res: Response): Promise<void>;
    getSurveyResponseSummary(req: Request, res: Response): Promise<void>;
    distributeSurvey(req: Request, res: Response): Promise<void>;
    getSurveyDistributions(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SurveyController.d.ts.map