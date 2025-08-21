import { Request, Response } from 'express';
import { ManageSurveyUseCase } from '../../application/use-cases/ManageSurveyUseCase';
import { SurveyType, QuestionType, SurveyStatus } from '../../domain/entities/Survey';
import { MySQLAnalyticsRepository } from '../../infrastructure/database/MySQLAnalyticsRepository';

export class SurveyController {
  private analyticsRepository: MySQLAnalyticsRepository;

  constructor(private manageSurveyUseCase: ManageSurveyUseCase) {
    // Get database pool from global
    const dbPool = (global as any).dbPool;
    this.analyticsRepository = new MySQLAnalyticsRepository(dbPool);
  }

  // Survey Management
  async createSurvey(req: Request, res: Response): Promise<void> {
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
        surveyType: surveyType as SurveyType,
        status: SurveyStatus.DRAFT,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        createdBy: (req as any).user?.id || 'system'
      });

      res.status(201).json({
        success: true,
        data: survey
      });
    } catch (error) {
      console.error('Error creating survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create survey'
      });
    }
  }

  async updateSurvey(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Error updating survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update survey'
      });
    }
  }

  async activateSurvey(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Error activating survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to activate survey'
      });
    }
  }

  async deactivateSurvey(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Error deactivating survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate survey'
      });
    }
  }

  async deleteSurvey(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Error deleting survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete survey'
      });
    }
  }

  async getSurveys(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, surveyType, status, limit, offset } = req.query;

      const surveys = await this.manageSurveyUseCase.getSurveys({
        eventId: eventId as string,
        surveyType: surveyType as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: surveys,
        count: surveys.length
      });
    } catch (error) {
      console.error('Error getting surveys:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSurveyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const survey = await this.manageSurveyUseCase.getSurveyById(id);

      if (survey) {
        res.status(200).json({
          success: true,
          data: survey
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Survey not found'
        });
      }
    } catch (error) {
      console.error('Error getting survey:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Survey Questions Management
  async addQuestion(req: Request, res: Response): Promise<void> {
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
        questionType: questionType as QuestionType,
        options,
        required,
        orderIndex
      });

      res.status(201).json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const question = await this.manageSurveyUseCase.updateQuestion(id, updates);

      res.status(200).json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.manageSurveyUseCase.deleteQuestion(id);

      if (result) {
        res.status(200).json({
          success: true,
          message: 'Question deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSurveyQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { surveyId } = req.params;

      const questions = await this.manageSurveyUseCase.getSurveyQuestions(surveyId);

      res.status(200).json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error getting survey questions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Survey Responses
  async submitResponse(req: Request, res: Response): Promise<void> {
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
        attendeeId: (req as any).user?.attendeeId,
        userId: (req as any).user?.id,
        responseValue,
        responseMetadata
      });

      res.status(201).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSurveyResponses(req: Request, res: Response): Promise<void> {
    try {
      const { surveyId, questionId, attendeeId, userId, limit, offset } = req.query;

      const responses = await this.manageSurveyUseCase.getSurveyResponses({
        surveyId: surveyId as string,
        questionId: questionId as string,
        attendeeId: attendeeId as string,
        userId: userId as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: responses,
        count: responses.length
      });
    } catch (error) {
      console.error('Error getting survey responses:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSurveyResponseSummary(req: Request, res: Response): Promise<void> {
    try {
      const { surveyId } = req.params;

      const summary = await this.manageSurveyUseCase.getSurveyResponseSummary(surveyId);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error getting survey response summary:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Survey Distribution
  async distributeSurvey(req: Request, res: Response): Promise<void> {
    try {
      const { surveyId, attendeeIds, userIds, emails } = req.body;

      if (!surveyId || (!attendeeIds && !userIds && !emails)) {
        res.status(400).json({
          success: false,
          error: 'surveyId and at least one distribution method are required'
        });
        return;
      }

      // Distribute survey to attendees
      const distributions = await this.manageSurveyUseCase.distributeSurveyToAttendees(surveyId, attendeeIds);

      res.status(201).json({
        success: true,
        data: distributions,
        count: distributions.length
      });
    } catch (error) {
      console.error('Error distributing survey:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getSurveyDistributions(req: Request, res: Response): Promise<void> {
    try {
      const { surveyId, attendeeId, userId, email, status, limit, offset } = req.query;

      const distributions = await this.manageSurveyUseCase.getSurveyDistributions({
        surveyId: surveyId as string,
        attendeeId: attendeeId as string,
        userId: userId as string,
        email: email as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: distributions,
        count: distributions.length
      });
    } catch (error) {
      console.error('Error getting survey distributions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get real survey data for event
  async getSurveyDataForEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
        return;
      }

      // Get real survey statistics
      const surveyStats = await this.analyticsRepository.getSurveyStats(eventId);
      const eventDetails = await this.analyticsRepository.getEventDetails(eventId);
      const attendanceData = await this.analyticsRepository.getRealAttendanceData(eventId);

      const surveyData = {
        event_info: {
          name: eventDetails.name,
          location: eventDetails.location,
          start_date: eventDetails.start_date,
          end_date: eventDetails.end_date,
          status: eventDetails.status
        },
        attendance_summary: {
          registered: attendanceData.registered,
          checked_in: attendanceData.checked_in,
          attendance_rate: `${attendanceData.rate}%`
        },
        survey_summary: {
          active_surveys: surveyStats.active_surveys,
          total_responses: surveyStats.total_responses,
          avg_satisfaction: surveyStats.avg_satisfaction,
          response_rate: attendanceData.checked_in > 0 ? 
            Math.round((surveyStats.total_responses / attendanceData.checked_in) * 100) : 0
        },
        recommendations: {
          survey_status: surveyStats.active_surveys > 0 ? "ACTIVE" : "NO_SURVEYS",
          engagement_level: attendanceData.rate > 70 ? "HIGH" : attendanceData.rate > 40 ? "MEDIUM" : "LOW",
          suggested_actions: surveyStats.active_surveys === 0 ? 
            ["Create feedback survey", "Send reminder emails"] : 
            ["Monitor responses", "Follow up with non-respondents"]
        }
      };

      res.status(200).json({
        success: true,
        data: surveyData
      });
    } catch (error) {
      console.error('Error getting survey data for event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get survey data'
      });
    }
  }
}
