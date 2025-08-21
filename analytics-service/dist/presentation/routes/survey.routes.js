"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurveyRoutes = createSurveyRoutes;
const express_1 = require("express");
function createSurveyRoutes(surveyController) {
    const router = (0, express_1.Router)();
    router.post('/', surveyController.createSurvey.bind(surveyController));
    router.get('/', surveyController.getSurveys.bind(surveyController));
    router.get('/:id', surveyController.getSurveyById.bind(surveyController));
    router.put('/:id', surveyController.updateSurvey.bind(surveyController));
    router.delete('/:id', surveyController.deleteSurvey.bind(surveyController));
    router.patch('/:id/activate', surveyController.activateSurvey.bind(surveyController));
    router.patch('/:id/deactivate', surveyController.deactivateSurvey.bind(surveyController));
    router.post('/:surveyId/questions', surveyController.addQuestion.bind(surveyController));
    router.get('/:surveyId/questions', surveyController.getSurveyQuestions.bind(surveyController));
    router.put('/questions/:id', surveyController.updateQuestion.bind(surveyController));
    router.delete('/questions/:id', surveyController.deleteQuestion.bind(surveyController));
    router.post('/responses', surveyController.submitResponse.bind(surveyController));
    router.get('/responses', surveyController.getSurveyResponses.bind(surveyController));
    router.get('/:surveyId/responses/summary', surveyController.getSurveyResponseSummary.bind(surveyController));
    router.post('/:surveyId/distribute', surveyController.distributeSurvey.bind(surveyController));
    router.get('/distributions', surveyController.getSurveyDistributions.bind(surveyController));
    return router;
}
