import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { AttendeeStatus } from '../../domain/entities/Attendee';

export interface GetAttendanceReportRequest {
  eventId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceReport {
  eventId: string;
  totalRegistered: number;
  totalCheckedIn: number;
  totalCheckedOut: number;
  totalCancelled: number;
  checkInRate: number;
  attendanceByHour: AttendanceByHour[];
  statusBreakdown: StatusBreakdown[];
  attendees: AttendeeInfo[];
  generatedAt: Date;
}

export interface AttendeeInfo {
  id: string;
  userId: string;
  qrCode: string;
  status: AttendeeStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
}

export interface AttendanceByHour {
  hour: number;
  count: number;
}

export interface StatusBreakdown {
  status: AttendeeStatus;
  count: number;
  percentage: number;
}

export class GetAttendanceReportUseCase {
  constructor(private attendeeRepository: IAttendeeRepository) {}

  async execute(request: GetAttendanceReportRequest): Promise<AttendanceReport> {
    const { eventId, startDate, endDate } = request;

    // Get all attendees for the event
    const attendees = await this.attendeeRepository.findByEventId(eventId);

    // Filter by date range if provided
    let filteredAttendees = attendees;
    if (startDate && endDate) {
      filteredAttendees = attendees.filter(attendee => {
        const checkInTime = attendee.checkInTime;
        return checkInTime && checkInTime >= startDate && checkInTime <= endDate;
      });
    }

    // Calculate totals
    const totalRegistered = attendees.length;
    const totalCheckedIn = attendees.filter(a => a.status === AttendeeStatus.CHECKED_IN).length;
    const totalCheckedOut = attendees.filter(a => a.status === AttendeeStatus.CHECKED_OUT).length;
    const totalCancelled = attendees.filter(a => a.status === AttendeeStatus.CANCELLED).length;

    // Calculate check-in rate
    const checkInRate = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0;

    // Group by hour for check-ins
    const attendanceByHour = this.groupByHour(filteredAttendees);

    // Status breakdown
    const statusBreakdown = this.getStatusBreakdown(attendees);

    // Map attendees to simplified info
    const attendeeInfo: AttendeeInfo[] = attendees.map(attendee => ({
      id: attendee.id,
      userId: attendee.userId,
      qrCode: attendee.qrCode,
      status: attendee.status,
      checkInTime: attendee.checkInTime,
      checkOutTime: attendee.checkOutTime,
      createdAt: attendee.createdAt
    }));

    return {
      eventId,
      totalRegistered,
      totalCheckedIn,
      totalCheckedOut,
      totalCancelled,
      checkInRate: Math.round(checkInRate * 100) / 100,
      attendanceByHour,
      statusBreakdown,
      attendees: attendeeInfo,
      generatedAt: new Date()
    };
  }

  private groupByHour(attendees: any[]): AttendanceByHour[] {
    const hourMap = new Map<number, number>();
    
    attendees.forEach(attendee => {
      if (attendee.checkInTime) {
        const hour = new Date(attendee.checkInTime).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      }
    });

    return Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);
  }

  private getStatusBreakdown(attendees: any[]): StatusBreakdown[] {
    const statusCounts = new Map<AttendeeStatus, number>();
    
    attendees.forEach(attendee => {
      statusCounts.set(attendee.status, (statusCounts.get(attendee.status) || 0) + 1);
    });

    const total = attendees.length;
    
    return Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100 * 100) / 100 : 0
    }));
  }
}
