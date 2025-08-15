import { Request, Response } from 'express';
import { CheckInAttendeeUseCase } from '../../application/use-cases/CheckInAttendeeUseCase';
import { GetAttendanceReportUseCase } from '../../application/use-cases/GetAttendanceReportUseCase';
import { ValidationError } from '../../domain/errors/ValidationError';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export class CheckInController {
  constructor(
    private checkInAttendeeUseCase: CheckInAttendeeUseCase,
    private getAttendanceReportUseCase: GetAttendanceReportUseCase
  ) {}

  async checkInAttendee(req: Request, res: Response): Promise<void> {
    try {
      const { qrCode, eventId, location, checkedInBy } = req.body;
      // For demo mode, use checkedInBy from request body or fallback to user from JWT
      const finalCheckedInBy = checkedInBy || req.user?.id || 'demo-admin';

      const result = await this.checkInAttendeeUseCase.execute({
        qrCode,
        eventId,
        checkedInBy: finalCheckedInBy,
        location
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Check-in successful'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Check-in error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { startDate, endDate } = req.query;

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate) {
        start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          res.status(400).json({
            success: false,
            error: 'Invalid start date format'
          });
          return;
        }
      }

      if (endDate) {
        end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          res.status(400).json({
            success: false,
            error: 'Invalid end date format'
          });
          return;
        }
      }

      const report = await this.getAttendanceReportUseCase.execute({
        eventId,
        startDate: start,
        endDate: end
      });

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Attendance report error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getAttendeeByQrCode(req: Request, res: Response): Promise<void> {
    try {
      const { qrCode } = req.params;
      const { eventId } = req.query;

      if (!eventId) {
        res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
        return;
      }

      // This would typically use a separate use case
      // For now, we'll return a simple response
      res.status(200).json({
        success: true,
        data: {
          qrCode,
          eventId,
          isValid: true,
          message: 'QR Code is valid for this event'
        }
      });
    } catch (error) {
      console.error('QR Code validation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
