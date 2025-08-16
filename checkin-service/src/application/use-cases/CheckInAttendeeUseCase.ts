import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { Attendee, AttendeeStatus } from '../../domain/entities/Attendee';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface CheckInAttendeeRequest {
  qrCode: string;
  eventId?: string;
  checkedInBy: string; // staff ID
  location?: string;
}

export interface CheckInAttendeeResponse {
  attendee: Attendee;
  message: string;
}

export class CheckInAttendeeUseCase {
  constructor(private attendeeRepository: IAttendeeRepository) {}

  async execute(request: CheckInAttendeeRequest): Promise<CheckInAttendeeResponse> {
    // Validate input
    if (!request.qrCode || !request.checkedInBy) {
      throw new ValidationError('Missing required fields: qrCode, checkedInBy');
    }

    // Find attendee by QR code
    const attendee = await this.attendeeRepository.findByQrCode(request.qrCode);
    if (!attendee) {
      throw new ValidationError('Invalid QR code or attendee not found');
    }

    // Check if attendee is for the correct event (if eventId provided)
    if (request.eventId && attendee.eventId !== request.eventId) {
      throw new ValidationError('QR code is not valid for this event');
    }

    // Check if already checked in
    if (attendee.status === AttendeeStatus.CHECKED_IN) {
      return {
        attendee,
        message: `Attendee ${attendee.userId} is already checked in at ${attendee.checkInTime?.toLocaleString()}`
      };
    }

    // Check if cancelled
    if (attendee.status === AttendeeStatus.CANCELLED) {
      throw new ValidationError('Cannot check in cancelled attendee');
    }

    // Perform check-in
    const updatedAttendee = await this.attendeeRepository.update(attendee.id, {
      status: AttendeeStatus.CHECKED_IN,
      checkInTime: new Date(),
      updatedAt: new Date()
    });

    return {
      attendee: updatedAttendee,
      message: `Successfully checked in attendee ${updatedAttendee.userId} for event ${updatedAttendee.eventId}`
    };
  }
}
