import { Router } from 'express';
import { SurveyController } from '../controllers/SurveyController';

export function createSurveyRoutes(surveyController: SurveyController): Router {
  const router = Router();

  // Survey Management
  router.post('/', surveyController.createSurvey.bind(surveyController));
  router.get('/', surveyController.getSurveys.bind(surveyController));
  router.get('/:id', surveyController.getSurveyById.bind(surveyController));
  router.put('/:id', surveyController.updateSurvey.bind(surveyController));
  router.delete('/:id', surveyController.deleteSurvey.bind(surveyController));
  router.patch('/:id/activate', surveyController.activateSurvey.bind(surveyController));
  router.patch('/:id/deactivate', surveyController.deactivateSurvey.bind(surveyController));

  // Survey Questions
  router.post('/:surveyId/questions', surveyController.addQuestion.bind(surveyController));
  router.get('/:surveyId/questions', surveyController.getSurveyQuestions.bind(surveyController));
  router.put('/questions/:id', surveyController.updateQuestion.bind(surveyController));
  router.delete('/questions/:id', surveyController.deleteQuestion.bind(surveyController));

  // Survey Responses
  router.post('/responses', surveyController.submitResponse.bind(surveyController));
  router.get('/responses', surveyController.getSurveyResponses.bind(surveyController));
  router.get('/:surveyId/responses/summary', surveyController.getSurveyResponseSummary.bind(surveyController));

  // Survey Distribution
  router.post('/:surveyId/distribute', surveyController.distributeSurvey.bind(surveyController));
  router.get('/distributions', surveyController.getSurveyDistributions.bind(surveyController));

  // Real Survey Data for Event
  router.get('/event/:eventId/data', surveyController.getSurveyDataForEvent.bind(surveyController));

  return router;
}
