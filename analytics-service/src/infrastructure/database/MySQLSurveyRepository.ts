// @ts-nocheck
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ISurveyRepository } from '../../domain/repositories/ISurveyRepository';
import { Survey, SurveyQuestion, SurveyResponse, SurveyDistribution, SurveyType, SurveyStatus, QuestionType, DistributionStatus } from '../../domain/entities/Survey';
import { v4 as uuidv4 } from 'uuid';

export class MySQLSurveyRepository implements ISurveyRepository {
  constructor(private pool: Pool) {}

  // Surveys
  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    const id = uuidv4();
    const now = new Date();
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO surveys (id, title, description, event_id, survey_type, status, start_date, end_date, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, survey.title, survey.description, survey.eventId, survey.surveyType, survey.status, survey.startDate, survey.endDate, survey.createdBy, now, now]
    );

    return { ...survey, id, createdAt: now, updatedAt: now };
  }

  async getSurveys(filters: {
    eventId?: string;
    surveyType?: string;
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Survey[]> {
    let query = 'SELECT * FROM surveys WHERE 1=1';
    const params: any[] = [];

    if (filters.eventId) {
      query += ' AND event_id = ?';
      params.push(filters.eventId);
    }

    if (filters.surveyType) {
      query += ' AND survey_type = ?';
      params.push(filters.surveyType);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.createdBy) {
      query += ' AND created_by = ?';
      params.push(filters.createdBy);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);

    return rows.map(row => {
      if (!row) return null;
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        eventId: row.event_id,
        surveyType: row.survey_type as SurveyType,
        status: row.status as SurveyStatus,
        startDate: row.start_date ? new Date(row.start_date) : undefined,
        endDate: row.end_date ? new Date(row.end_date) : undefined,
        createdBy: row.created_by,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    }).filter(Boolean) as Survey[];
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM surveys WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || !rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      eventId: row.event_id,
      surveyType: row.survey_type as SurveyType,
      status: row.status as SurveyStatus,
      startDate: row.start_date ? new Date(row.start_date) : undefined,
      endDate: row.end_date ? new Date(row.end_date) : undefined,
      createdBy: row.created_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey> {
    const setClauses: string[] = [];
    const params: any[] = [];

    if (updates.title !== undefined) {
      setClauses.push('title = ?');
      params.push(updates.title);
    }

    if (updates.description !== undefined) {
      setClauses.push('description = ?');
      params.push(updates.description);
    }

    if (updates.eventId !== undefined) {
      setClauses.push('event_id = ?');
      params.push(updates.eventId);
    }

    if (updates.surveyType !== undefined) {
      setClauses.push('survey_type = ?');
      params.push(updates.surveyType);
    }

    if (updates.status !== undefined) {
      setClauses.push('status = ?');
      params.push(updates.status);
    }

    if (updates.startDate !== undefined) {
      setClauses.push('start_date = ?');
      params.push(updates.startDate);
    }

    if (updates.endDate !== undefined) {
      setClauses.push('end_date = ?');
      params.push(updates.endDate);
    }

    if (updates.createdBy !== undefined) {
      setClauses.push('created_by = ?');
      params.push(updates.createdBy);
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    setClauses.push('updated_at = ?');
    params.push(new Date());
    params.push(id);

    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE surveys SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Survey not found');
    }

    const updated = await this.getSurveyById(id);
    if (!updated) throw new Error('Failed to retrieve updated survey');
    return updated;
  }

  async deleteSurvey(id: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM surveys WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async activateSurvey(id: string): Promise<Survey> {
    return await this.updateSurvey(id, { status: SurveyStatus.ACTIVE });
  }

  async deactivateSurvey(id: string): Promise<Survey> {
    return await this.updateSurvey(id, { status: SurveyStatus.INACTIVE });
  }

  // Survey Questions
  async createSurveyQuestion(question: Omit<SurveyQuestion, 'id' | 'createdAt'>): Promise<SurveyQuestion> {
    const id = uuidv4();
    const now = new Date();
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO survey_questions (id, survey_id, question_text, question_type, options, required, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, question.surveyId, question.questionText, question.questionType, JSON.stringify(question.options), question.required, question.orderIndex, now]
    );

    return { ...question, id, createdAt: now };
  }

  async getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM survey_questions WHERE survey_id = ? ORDER BY order_index ASC',
      [surveyId]
    );
    
    return rows.map(row => ({
      id: row.id,
      surveyId: row.survey_id,
      questionText: row.question_text,
      questionType: row.question_type as QuestionType,
      options: row.options ? JSON.parse(row.options) : undefined,
      required: row.required,
      orderIndex: row.order_index,
      createdAt: new Date(row.created_at)
    }));
  }

  async getSurveyQuestionById(id: string): Promise<SurveyQuestion | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM survey_questions WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || !rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      surveyId: row.survey_id,
      questionText: row.question_text,
      questionType: row.question_type as QuestionType,
      options: row.options ? JSON.parse(row.options) : undefined,
      required: row.required,
      orderIndex: row.order_index,
      createdAt: new Date(row.created_at)
    };
  }

  async updateSurveyQuestion(id: string, updates: Partial<SurveyQuestion>): Promise<SurveyQuestion> {
    const setClauses: string[] = [];
    const params: any[] = [];

    if (updates.questionText !== undefined) {
      setClauses.push('question_text = ?');
      params.push(updates.questionText);
    }

    if (updates.questionType !== undefined) {
      setClauses.push('question_type = ?');
      params.push(updates.questionType);
    }

    if (updates.options !== undefined) {
      setClauses.push('options = ?');
      params.push(JSON.stringify(updates.options));
    }

    if (updates.required !== undefined) {
      setClauses.push('required = ?');
      params.push(updates.required);
    }

    if (updates.orderIndex !== undefined) {
      setClauses.push('order_index = ?');
      params.push(updates.orderIndex);
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    params.push(id);
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE survey_questions SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Survey question not found');
    }

    const updated = await this.getSurveyQuestionById(id);
    if (!updated) throw new Error('Failed to retrieve updated survey question');
    return updated;
  }

  async deleteSurveyQuestion(id: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM survey_questions WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async reorderQuestions(surveyId: string, questionIds: string[]): Promise<boolean> {
    // This would implement question reordering logic
    // For now, return true
    return true;
  }

  // Survey Responses
  async createSurveyResponse(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> {
    const id = uuidv4();
    const now = new Date();
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO survey_responses (id, survey_id, question_id, attendee_id, user_id, response_value, response_metadata, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, response.surveyId, response.questionId, response.attendeeId, response.userId, response.responseValue, JSON.stringify(response.responseMetadata), now]
    );

    return { ...response, id, submittedAt: now };
  }

  async getSurveyResponses(filters: {
    surveyId?: string;
    questionId?: string;
    attendeeId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<SurveyResponse[]> {
    let query = 'SELECT * FROM survey_responses WHERE 1=1';
    const params: any[] = [];

    if (filters.surveyId) {
      query += ' AND survey_id = ?';
      params.push(filters.surveyId);
    }

    if (filters.questionId) {
      query += ' AND question_id = ?';
      params.push(filters.questionId);
    }

    if (filters.attendeeId) {
      query += ' AND attendee_id = ?';
      params.push(filters.attendeeId);
    }

    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }

    query += ' ORDER BY submitted_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => ({
      id: row.id,
      surveyId: row.survey_id,
      questionId: row.question_id,
      attendeeId: row.attendee_id,
      userId: row.user_id,
      responseValue: row.response_value,
      responseMetadata: row.response_metadata ? JSON.parse(row.response_metadata) : undefined,
      submittedAt: new Date(row.submitted_at)
    }));
  }

  async getSurveyResponseById(id: string): Promise<SurveyResponse | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM survey_responses WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || !rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      surveyId: row.survey_id,
      questionId: row.question_id,
      attendeeId: row.attendee_id,
      userId: row.user_id,
      responseValue: row.response_value,
      responseMetadata: row.response_metadata ? JSON.parse(row.response_metadata) : undefined,
      submittedAt: new Date(row.submitted_at)
    };
  }

  async updateSurveyResponse(id: string, updates: Partial<SurveyResponse>): Promise<SurveyResponse> {
    const setClauses: string[] = [];
    const params: any[] = [];

    if (updates.responseValue !== undefined) {
      setClauses.push('response_value = ?');
      params.push(updates.responseValue);
    }

    if (updates.responseMetadata !== undefined) {
      setClauses.push('response_metadata = ?');
      params.push(JSON.stringify(updates.responseMetadata));
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    params.push(id);
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE survey_responses SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Survey response not found');
    }

    const updated = await this.getSurveyResponseById(id);
    if (!updated) throw new Error('Failed to retrieve updated survey response');
    return updated;
  }

  async deleteSurveyResponse(id: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM survey_responses WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async getSurveyResponseSummary(surveyId: string): Promise<any> {
    // This would implement survey response summary logic
    // For now, return basic summary
    const responses = await this.getSurveyResponses({ surveyId });
    const questions = await this.getSurveyQuestions(surveyId);

    return {
      totalResponses: responses.length,
      totalQuestions: questions.length,
      responseRate: responses.length > 0 ? (responses.length / questions.length) * 100 : 0,
      responsesByQuestion: questions.map(q => ({
        questionId: q.id,
        questionText: q.questionText,
        responseCount: responses.filter(r => r.questionId === q.id).length
      }))
    };
  }

  // Survey Distribution
  async createSurveyDistribution(distribution: Omit<SurveyDistribution, 'id'>): Promise<SurveyDistribution> {
    const id = uuidv4();
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO survey_distribution (id, survey_id, attendee_id, user_id, email, status, reminder_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, distribution.surveyId, distribution.attendeeId, distribution.userId, distribution.email, distribution.status, distribution.reminderCount]
    );

    return { ...distribution, id };
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
    let query = 'SELECT * FROM survey_distribution WHERE 1=1';
    const params: any[] = [];

    if (filters.surveyId) {
      query += ' AND survey_id = ?';
      params.push(filters.surveyId);
    }

    if (filters.attendeeId) {
      query += ' AND attendee_id = ?';
      params.push(filters.attendeeId);
    }

    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }

    if (filters.email) {
      query += ' AND email = ?';
      params.push(filters.email);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => ({
      id: row.id,
      surveyId: row.survey_id,
      attendeeId: row.attendee_id,
      userId: row.user_id,
      email: row.email,
      status: row.status as DistributionStatus,
      sentAt: row.sent_at ? new Date(row.sent_at) : undefined,
      openedAt: row.opened_at ? new Date(row.opened_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      reminderCount: row.reminder_count,
      lastReminderSent: row.last_reminder_sent ? new Date(row.last_reminder_sent) : undefined
    }));
  }

  async getSurveyDistributionById(id: string): Promise<SurveyDistribution | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM survey_distribution WHERE id = ?',
      [id]
    );

    if (rows.length === 0 || !rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      surveyId: row.survey_id,
      attendeeId: row.attendee_id,
      userId: row.user_id,
      email: row.email,
      status: row.status as DistributionStatus,
      sentAt: row.sent_at ? new Date(row.sent_at) : undefined,
      openedAt: row.opened_at ? new Date(row.opened_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      reminderCount: row.reminder_count,
      lastReminderSent: row.last_reminder_sent ? new Date(row.last_reminder_sent) : undefined
    };
  }

  async updateSurveyDistribution(id: string, updates: Partial<SurveyDistribution>): Promise<SurveyDistribution> {
    const setClauses: string[] = [];
    const params: any[] = [];

    if (updates.status !== undefined) {
      setClauses.push('status = ?');
      params.push(updates.status);
    }

    if (updates.sentAt !== undefined) {
      setClauses.push('sent_at = ?');
      params.push(updates.sentAt);
    }

    if (updates.openedAt !== undefined) {
      setClauses.push('opened_at = ?');
      params.push(updates.openedAt);
    }

    if (updates.completedAt !== undefined) {
      setClauses.push('completed_at = ?');
      params.push(updates.completedAt);
    }

    if (updates.reminderCount !== undefined) {
      setClauses.push('reminder_count = ?');
      params.push(updates.reminderCount);
    }

    if (updates.lastReminderSent !== undefined) {
      setClauses.push('last_reminder_sent = ?');
      params.push(updates.lastReminderSent);
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    params.push(id);
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE survey_distribution SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Survey distribution not found');
    }

    const updated = await this.getSurveyDistributionById(id);
    if (!updated) throw new Error('Failed to retrieve updated survey distribution');
    return updated;
  }

  async deleteSurveyDistribution(id: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM survey_distribution WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async sendSurveyInvitation(distributionId: string): Promise<boolean> {
    // This would implement email sending logic
    // For now, update status and return true
    await this.updateSurveyDistribution(distributionId, {
      status: DistributionStatus.SENT,
      sentAt: new Date()
    });
    return true;
  }

  async sendSurveyReminder(distributionId: string): Promise<boolean> {
    // This would implement reminder email logic
    // For now, update reminder count and return true
    const distribution = await this.getSurveyDistributionById(distributionId);
    if (!distribution) return false;

    await this.updateSurveyDistribution(distributionId, {
      reminderCount: distribution.reminderCount + 1,
      lastReminderSent: new Date()
    });
    return true;
  }

  async trackSurveyOpen(distributionId: string): Promise<boolean> {
    // This would implement open tracking logic
    // For now, update status and return true
    await this.updateSurveyDistribution(distributionId, {
      status: DistributionStatus.OPENED,
      openedAt: new Date()
    });
    return true;
  }

  async trackSurveyCompletion(distributionId: string): Promise<boolean> {
    // This would implement completion tracking logic
    // For now, update status and return true
    await this.updateSurveyDistribution(distributionId, {
      status: DistributionStatus.COMPLETED,
      completedAt: new Date()
    });
    return true;
  }
}
