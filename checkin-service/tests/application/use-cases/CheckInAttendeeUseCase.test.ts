import { CheckInAttendeeUseCase } from '../../../src/application/use-cases/CheckInAttendeeUseCase';
import { IAttendeeRepository } from '../../../src/domain/repositories/IAttendeeRepository';
import { Attendee, AttendeeStatus } from '../../../src/domain/entities/Attendee';
import { ValidationError } from '../../../src/domain/errors/ValidationError';

// Mock repository
const mockAttendeeRepository: jest.Mocked<IAttendeeRepository> = {
  findById: jest.fn(),
  findByEventId: jest.fn(),
  findByUserId: jest.fn(),
  findByTicketId: jest.fn(),
  findByQrCode: jest.fn(),
  findByStatus: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  countByEventId: jest.fn(),
  countByStatus: jest.fn(),
};

describe('CheckInAttendeeUseCase', () => {
  let useCase: CheckInAttendeeUseCase;

  beforeEach(() => {
    useCase = new CheckInAttendeeUseCase(mockAttendeeRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockAttendee: Attendee = {
      id: 'attendee-1',
      eventId: 'event-1',
      userId: 'user-1',
      ticketId: 'ticket-1',
      status: AttendeeStatus.REGISTERED,
      qrCode: 'qr-code-123',
      sponsorBoothVisits: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully check in an attendee', async () => {
      // Arrange
      const request = {
        qrCode: 'qr-code-123',
        eventId: 'event-1',
        checkedInBy: 'staff-1',
      };

      mockAttendeeRepository.findByQrCode.mockResolvedValue(mockAttendee);
      mockAttendeeRepository.update.mockResolvedValue({
        ...mockAttendee,
        status: AttendeeStatus.CHECKED_IN,
        checkInTime: new Date(),
      });

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(mockAttendeeRepository.findByQrCode).toHaveBeenCalledWith('qr-code-123');
      expect(mockAttendeeRepository.update).toHaveBeenCalledWith('attendee-1', {
        status: AttendeeStatus.CHECKED_IN,
        checkInTime: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.attendee.status).toBe(AttendeeStatus.CHECKED_IN);
      expect(result.message).toContain('Successfully checked in');
    });

    it('should throw ValidationError when QR code is missing', async () => {
      // Arrange
      const request = {
        qrCode: '',
        eventId: 'event-1',
        checkedInBy: 'staff-1',
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
      expect(mockAttendeeRepository.findByQrCode).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when attendee is not found', async () => {
      // Arrange
      const request = {
        qrCode: 'invalid-qr',
        eventId: 'event-1',
        checkedInBy: 'staff-1',
      };

      mockAttendeeRepository.findByQrCode.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
      expect(mockAttendeeRepository.findByQrCode).toHaveBeenCalledWith('invalid-qr');
    });

    it('should throw ValidationError when attendee is already checked in', async () => {
      // Arrange
      const request = {
        qrCode: 'qr-code-123',
        eventId: 'event-1',
        checkedInBy: 'staff-1',
      };

      const checkedInAttendee = {
        ...mockAttendee,
        status: AttendeeStatus.CHECKED_IN,
      };

      mockAttendeeRepository.findByQrCode.mockResolvedValue(checkedInAttendee);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
      expect(mockAttendeeRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when attendee is cancelled', async () => {
      // Arrange
      const request = {
        qrCode: 'qr-code-123',
        eventId: 'event-1',
        checkedInBy: 'staff-1',
      };

      const cancelledAttendee = {
        ...mockAttendee,
        status: AttendeeStatus.CANCELLED,
      };

      mockAttendeeRepository.findByQrCode.mockResolvedValue(cancelledAttendee);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
      expect(mockAttendeeRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when event ID does not match', async () => {
      // Arrange
      const request = {
        qrCode: 'qr-code-123',
        eventId: 'different-event',
        checkedInBy: 'staff-1',
      };

      mockAttendeeRepository.findByQrCode.mockResolvedValue(mockAttendee);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
      expect(mockAttendeeRepository.update).not.toHaveBeenCalled();
    });
  });
});
