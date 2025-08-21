import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { AttendeeStatus } from '../../domain/entities/Attendee';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface ValidateQrCodeRequest {
  qrCode: string;
  eventId: string;
}

export interface ValidateQrCodeResponse {
  qrCode: string;
  eventId: string;
  isValid: boolean;
  attendeeId?: string;
  status?: AttendeeStatus;
  message: string;
}

export class ValidateQrCodeUseCase {
  constructor(private attendeeRepository: IAttendeeRepository) {}

  async execute(request: ValidateQrCodeRequest): Promise<ValidateQrCodeResponse> {
    // Validate input
    if (!request.qrCode || !request.eventId) {
      throw new ValidationError('Missing required fields: qrCode, eventId');
    }

    console.log('🔍 ValidateQrCodeUseCase - Input:', { qrCode: request.qrCode, eventId: request.eventId });

    // Find attendee by QR code
    const attendee = await this.attendeeRepository.findByQrCode(request.qrCode);
    console.log('🔍 ValidateQrCodeUseCase - Found attendee:', attendee ? { id: attendee.id, eventId: attendee.eventId, status: attendee.status } : 'null');
    
    if (!attendee) {
      return {
        qrCode: request.qrCode,
        eventId: request.eventId,
        isValid: false,
        message: 'QR code not found in system'
      };
    }

    // Check if attendee is for the correct event
    console.log('🔍 ValidateQrCodeUseCase - Event ID comparison:', { 
      attendeeEventId: attendee.eventId, 
      requestEventId: request.eventId, 
      isMatch: attendee.eventId === request.eventId 
    });
    
    if (attendee.eventId !== request.eventId) {
      console.log('❌ ValidateQrCodeUseCase - Event ID mismatch, returning invalid');
      return {
        qrCode: request.qrCode,
        eventId: request.eventId,
        isValid: false,
        attendeeId: attendee.id,
        status: attendee.status,
        message: 'QR code is not valid for this event'
      };
    }

    // Check if cancelled
    if (attendee.status === AttendeeStatus.CANCELLED) {
      return {
        qrCode: request.qrCode,
        eventId: request.eventId,
        isValid: false,
        attendeeId: attendee.id,
        status: attendee.status,
        message: 'Attendee registration has been cancelled'
      };
    }

    // Check if already checked in
    if (attendee.status === AttendeeStatus.CHECKED_IN) {
      return {
        qrCode: request.qrCode,
        eventId: request.eventId,
        isValid: true,
        attendeeId: attendee.id,
        status: attendee.status,
        message: 'Attendee is already checked in'
      };
    }

    // Valid QR code for check-in
    return {
      qrCode: request.qrCode,
      eventId: request.eventId,
      isValid: true,
      attendeeId: attendee.id,
      status: attendee.status,
      message: 'QR code is valid and ready for check-in'
    };
  }
}
