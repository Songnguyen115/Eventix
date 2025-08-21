"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyController = void 0;
const Survey_1 = require("../../domain/entities/Survey");
class SurveyController {
    constructor(manageSurveyUseCase) {
        this.manageSurveyUseCase = manageSurveyUseCase;
    }
    async createSurvey(req, res) {
        try {
            const { title, description, eventId, surveyType, startDate, endDate } = req.body;
            if (!title || !surveyType) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: title, surveyType'
                });
                return;
            }
            const survey = await this.manageSurveyUseCase.createSurvey({
                title,
                description,
                eventId: eventId || undefined,
                surveyType: surveyType,
                status: Survey_1.SurveyStatus.DRAFT,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                createdBy: req.user?.id || 'system'
            });
            res.status(201).json({
                success: true,
                data: survey
            });
        }
        catch (error) {
            console.error('Error creating survey:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create survey'
            });
        }
    }
    async updateSurvey(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Survey ID is required'
                });
                return;
            }
            const survey = await this.manageSurveyUseCase.updateSurvey(id, updates);
            res.json({
                success: true,
                data: survey
            });
        }
        catch (error) {
            console.error('Error updating survey:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update survey'
            });
        }
    }
    async activateSurvey(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Survey ID is required'
                });
                return;
            }
            const survey = await this.manageSurveyUseCase.activateSurvey(id);
            res.json({
                success: true,
                data: survey
            });
        }
        catch (error) {
            console.error('Error activating survey:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to activate survey'
            });
        }
    }
    async deactivateSurvey(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Survey ID is required'
                });
                return;
            }
            const survey = await this.manageSurveyUseCase.deactivateSurvey(id);
            res.json({
                success: true,
                data: survey
            });
        }
        catch (error) {
            console.error('Error deactivating survey:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to deactivate survey'
            });
        }
    }
    async deleteSurvey(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Survey ID is required'
                });
                return;
            }
            const result = await this.manageSurveyUseCase.deleteSurvey(id);
            res.json({
                success: true,
                data: { deleted: result }
            });
        }
        catch (error) {
            console.error('Error deleting survey:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete survey'
            });
        }
    }
    async getSurveys(req, res) {
        try {
            const { eventId, surveyType, status, limit, offset } = req.query;
            const surveys = await this.manageSurveyUseCase.getSurveys({
                eventId: eventId,
                surveyType: surveyType,
                status: status,
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined
            });
            res.status(200).json({
                success: true,
                data: surveys,
                count: surveys.length
            });
        }
        catch (error) {
            console.error('Error getting surveys:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getSurveyById(req, res) {
        try {
            const { id } = req.params;
            const survey = await this.manageSurveyUseCase.getSurveyById(id);
            if (survey) {
                res.status(200).json({
                    success: true,
                    data: survey
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    error: 'Survey not found'
                });
            }
        }
        catch (error) {
            console.error('Error getting survey:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async addQuestion(req, res) {
        try {
            const { surveyId, questionText, questionType, options, required, orderIndex } = req.body;
            if (!surveyId || !questionText || !questionType) {
                res.status(400).json({
                    success: false,
                    error: 'surveyId, questionText, and questionType are required'
                });
                return;
            }
            const question = await this.manageSurveyUseCase.addQuestion({
                surveyId,
                questionText,
                questionType: questionType,
                options,
                required,
                orderIndex
            });
            res.status(201).json({
                success: true,
                data: question
            });
        }
        catch (error) {
            console.error('Error adding question:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async updateQuestion(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const question = await this.manageSurveyUseCase.updateQuestion(id, updates);
            res.status(200).json({
                success: true,
                data: question
            });
        }
        catch (error) {
            console.error('Error updating question:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async deleteQuestion(req, res) {
        try {
            const { id } = req.params;
            const result = await this.manageSurveyUseCase.deleteQuestion(id);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: 'Question deleted successfully'
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    error: 'Question not found'
                });
            }
        }
        catch (error) {
            console.error('Error deleting question:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getSurveyQuestions(req, res) {
        try {
            const { surveyId } = req.params;
            const questions = await this.manageSurveyUseCase.getSurveyQuestions(surveyId);
            res.status(200).json({
                success: true,
                data: questions,
                count: questions.length
            });
        }
        catch (error) {
            console.error('Error getting survey questions:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async submitResponse(req, res) {
        try {
            const { surveyId, questionId, responseValue, responseMetadata } = req.body;
            if (!surveyId || !questionId || !responseValue) {
                res.status(400).json({
                    success: false,
                    error: 'surveyId, questionId, and responseValue are required'
                });
                return;
            }
            const response = await this.manageSurveyUseCase.submitResponse({
                surveyId,
                questionId,
                attendeeId: req.user?.attendeeId,
                userId: req.user?.id,
                responseValue,
                responseMetadata
            });
            res.status(201).json({
                success: true,
                data: response
            });
        }
        catch (error) {
            console.error('Error submitting response:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getSurveyResponses(req, res) {
        try {
            const { surveyId, questionId, attendeeId, userId, limit, offset } = req.query;
            const responses = await this.manageSurveyUseCase.getSurveyResponses({
                surveyId: surveyId,
                questionId: questionId,
                attendeeId: attendeeId,
                userId: userId,
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined
            });
            res.status(200).json({
                success: true,
                data: responses,
                count: responses.length
            });
        }
        catch (error) {
            console.error('Error getting survey responses:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getSurveyResponseSummary(req, res) {
        try {
            const { surveyId } = req.params;
            const summary = await this.manageSurveyUseCase.getSurveyResponseSummary(surveyId);
            res.status(200).json({
                success: true,
                data: summary
            });
        }
        catch (error) {
            console.error('Error getting survey response summary:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async distributeSurvey(req, res) {
        try {
            const { surveyId, attendeeIds, userIds, emails } = req.body;
            if (!surveyId || (!attendeeIds && !userIds && !emails)) {
                res.status(400).json({
                    success: false,
                    error: 'surveyId and at least one distribution method are required'
                });
                return;
            }
            const distributions = await this.manageSurveyUseCase.distributeSurveyToAttendees(surveyId, attendeeIds);
            res.status(201).json({
                success: true,
                data: distributions,
                count: distributions.length
            });
        }
        catch (error) {
            console.error('Error distributing survey:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    async getSurveyDistributions(req, res) {
        try {
            const { surveyId, attendeeId, userId, email, status, limit, offset } = req.query;
            const distributions = await this.manageSurveyUseCase.getSurveyDistributions({
                surveyId: surveyId,
                attendeeId: attendeeId,
                userId: userId,
                email: email,
                status: status,
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined
            });
            res.status(200).json({
                success: true,
                data: distributions,
                count: distributions.length
            });
        }
        catch (error) {
            console.error('Error getting survey distributions:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
exports.SurveyController = SurveyController;
