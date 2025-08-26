import { Request, Response } from 'express';
import { CheckInAttendeeUseCase } from '../../application/use-cases/CheckInAttendeeUseCase';
import { GetAttendanceReportUseCase } from '../../application/use-cases/GetAttendanceReportUseCase';
import { ValidateQrCodeUseCase } from '../../application/use-cases/ValidateQrCodeUseCase';
import { ValidationError } from '../../domain/errors/ValidationError';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export class CheckInController {
  constructor(
    private checkInAttendeeUseCase: CheckInAttendeeUseCase,
    private getAttendanceReportUseCase: GetAttendanceReportUseCase,
    private validateQrCodeUseCase: ValidateQrCodeUseCase
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

      // Transform data to include user info for frontend compatibility
      const attendeesWithUserInfo = report.attendees.map(attendee => {
        // Mock user data based on user ID - in real app this would come from User service
        const getUserInfo = (userId: string) => {
          const userMap: { [key: string]: { userName: string; email: string } } = {
            '550e8400-e29b-41d4-a716-446655440001': { userName: 'Admin User', email: 'admin@eventix.com' },
            '550e8400-e29b-41d4-a716-446655440002': { userName: 'John Doe', email: 'john.doe@example.com' },
            '550e8400-e29b-41d4-a716-446655440003': { userName: 'Jane Smith', email: 'jane.smith@example.com' }
          };
          return userMap[userId] || { userName: 'Unknown User', email: 'unknown@example.com' };
        };

        const userInfo = getUserInfo(attendee.userId);
        
        return {
          id: attendee.id,
          eventId: eventId,
          eventName: 'FU Business Seminar 2024', // Would come from Event service
          userId: attendee.userId,
          userName: userInfo.userName,
          email: userInfo.email,
          ticketId: `ticket-${attendee.id}`,
          checkInTime: attendee.checkInTime,
          checkInMethod: attendee.checkInTime ? 'QR Code' : null,
          status: attendee.status,
          qrCode: attendee.qrCode
        };
      });

      res.status(200).json({
        success: true,
        data: attendeesWithUserInfo
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

      // Use the validate QR code use case
      const result = await this.validateQrCodeUseCase.execute({
        qrCode,
        eventId: eventId as string
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('QR Code validation error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }
}
