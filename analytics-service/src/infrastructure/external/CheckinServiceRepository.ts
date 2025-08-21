import axios from 'axios';
import { Pool } from 'mysql2/promise';

export interface CheckinStats {
  totalRegistrations: number;
  totalCheckins: number;
  checkinsToday: number;
  peakCheckinsHour: string;
  attendanceRate: number;
  sponsorBoothVisits: number;
  averageStayDuration: number;
}

export interface AttendeeCheckIn {
  id: string;
  eventId: string;
  attendeeId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  location?: string;
  sponsorBoothId?: string;
}

export interface SponsorBoothData {
  boothId: string;
  sponsorName: string;
  totalVisits: number;
  uniqueVisitors: number;
  averageVisitDuration: number;
  peakVisitTime: string;
}

export class CheckinServiceRepository {
  private checkinServiceUrl: string;
  private dbPool?: Pool;

  constructor(checkinServiceUrl: string, dbPool?: Pool) {
    this.checkinServiceUrl = checkinServiceUrl;
    this.dbPool = dbPool;
  }

  // Method 1: Get data via API calls to Checkin Service
  async getCheckinStatsViaAPI(eventId: string): Promise<CheckinStats> {
    try {
      console.log(`🔗 Fetching checkin stats from API: ${this.checkinServiceUrl}/api/v1/events/${eventId}/stats`);
      
      const response = await axios.get(`${this.checkinServiceUrl}/api/v1/events/${eventId}/stats`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.data || this.getDefaultStats();
    } catch (error) {
      console.error('❌ Error fetching checkin stats via API:', error);
      return this.getDefaultStats();
    }
  }

  // Method 2: Get data directly from Checkin Service database (if shared DB)
  async getCheckinStatsFromDB(eventId: string): Promise<CheckinStats> {
    if (!this.dbPool) {
      console.log('⚠️  No database pool available, using API method');
      return this.getCheckinStatsViaAPI(eventId);
    }

    try {
      console.log(`🗄️ Fetching checkin stats from database for event: ${eventId}`);
      
      // Query checkin database directly
      const [registrations] = await this.dbPool.execute(
        'SELECT COUNT(*) as total FROM event_registrations WHERE event_id = ?',
        [eventId]
      );

      const [checkins] = await this.dbPool.execute(
        'SELECT COUNT(*) as total FROM attendee_checkins WHERE event_id = ? AND check_in_time IS NOT NULL',
        [eventId]
      );

      const [todayCheckins] = await this.dbPool.execute(
        'SELECT COUNT(*) as total FROM attendee_checkins WHERE event_id = ? AND DATE(check_in_time) = CURDATE()',
        [eventId]
      );

      const [sponsorVisits] = await this.dbPool.execute(
        'SELECT COUNT(*) as total FROM sponsor_booth_visits WHERE event_id = ?',
        [eventId]
      );

      const [peakHour] = await this.dbPool.execute(`
        SELECT HOUR(check_in_time) as hour, COUNT(*) as count 
        FROM attendee_checkins 
        WHERE event_id = ? AND check_in_time IS NOT NULL 
        GROUP BY HOUR(check_in_time) 
        ORDER BY count DESC 
        LIMIT 1
      `, [eventId]);

      const totalRegs = (registrations as any)[0]?.total || 0;
      const totalCheckins = (checkins as any)[0]?.total || 0;
      const todayCount = (todayCheckins as any)[0]?.total || 0;
      const sponsorCount = (sponsorVisits as any)[0]?.total || 0;
      const peakHourData = (peakHour as any)[0];

      return {
        totalRegistrations: totalRegs,
        totalCheckins: totalCheckins,
        checkinsToday: todayCount,
        peakCheckinsHour: peakHourData ? `${peakHourData.hour}:00` : 'N/A',
        attendanceRate: totalRegs > 0 ? (totalCheckins / totalRegs) * 100 : 0,
        sponsorBoothVisits: sponsorCount,
        averageStayDuration: 0 // Would calculate from check-in/check-out times
      };
    } catch (error) {
      console.error('❌ Error fetching checkin stats from database:', error);
      return this.getDefaultStats();
    }
  }

  async getRecentCheckins(eventId: string, limit: number = 10): Promise<AttendeeCheckIn[]> {
    if (!this.dbPool) {
      return this.getRecentCheckinsViaAPI(eventId, limit);
    }

    try {
      const [rows] = await this.dbPool.execute(`
        SELECT 
          ac.id,
          ac.event_id,
          ac.attendee_id,
          ac.check_in_time,
          ac.check_out_time,
          ac.location,
          ac.sponsor_booth_id
        FROM attendee_checkins ac
        WHERE ac.event_id = ? AND ac.check_in_time IS NOT NULL
        ORDER BY ac.check_in_time DESC
        LIMIT ?
      `, [eventId, limit]);

      return (rows as any[]).map(row => ({
        id: row.id,
        eventId: row.event_id,
        attendeeId: row.attendee_id,
        checkInTime: new Date(row.check_in_time),
        checkOutTime: row.check_out_time ? new Date(row.check_out_time) : undefined,
        location: row.location,
        sponsorBoothId: row.sponsor_booth_id
      }));
    } catch (error) {
      console.error('❌ Error fetching recent checkins:', error);
      return [];
    }
  }

  async getRecentCheckinsViaAPI(eventId: string, limit: number = 10): Promise<AttendeeCheckIn[]> {
    try {
      const response = await axios.get(`${this.checkinServiceUrl}/api/v1/events/${eventId}/checkins/recent?limit=${limit}`, {
        timeout: 5000
      });

      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching recent checkins via API:', error);
      return [];
    }
  }

  async getSponsorBoothStats(eventId: string): Promise<SponsorBoothData[]> {
    if (!this.dbPool) {
      return this.getSponsorBoothStatsViaAPI(eventId);
    }

    try {
      const [rows] = await this.dbPool.execute(`
        SELECT 
          sb.id as booth_id,
          sb.sponsor_name,
          COUNT(sbv.id) as total_visits,
          COUNT(DISTINCT sbv.attendee_id) as unique_visitors,
          AVG(TIMESTAMPDIFF(MINUTE, sbv.visit_start, sbv.visit_end)) as avg_duration,
          (SELECT HOUR(visit_start) FROM sponsor_booth_visits 
           WHERE booth_id = sb.id 
           GROUP BY HOUR(visit_start) 
           ORDER BY COUNT(*) DESC 
           LIMIT 1) as peak_hour
        FROM sponsor_booths sb
        LEFT JOIN sponsor_booth_visits sbv ON sb.id = sbv.booth_id
        WHERE sb.event_id = ?
        GROUP BY sb.id, sb.sponsor_name
        ORDER BY total_visits DESC
      `, [eventId]);

      return (rows as any[]).map(row => ({
        boothId: row.booth_id,
        sponsorName: row.sponsor_name,
        totalVisits: row.total_visits || 0,
        uniqueVisitors: row.unique_visitors || 0,
        averageVisitDuration: row.avg_duration || 0,
        peakVisitTime: row.peak_hour ? `${row.peak_hour}:00` : 'N/A'
      }));
    } catch (error) {
      console.error('❌ Error fetching sponsor booth stats:', error);
      return [];
    }
  }

  async getSponsorBoothStatsViaAPI(eventId: string): Promise<SponsorBoothData[]> {
    try {
      const response = await axios.get(`${this.checkinServiceUrl}/api/v1/events/${eventId}/sponsor-booths/stats`, {
        timeout: 5000
      });

      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching sponsor booth stats via API:', error);
      return [];
    }
  }

  private getDefaultStats(): CheckinStats {
    return {
      totalRegistrations: 0,
      totalCheckins: 0,
      checkinsToday: 0,
      peakCheckinsHour: 'N/A',
      attendanceRate: 0,
      sponsorBoothVisits: 0,
      averageStayDuration: 0
    };
  }

  async getEventSummary(eventId: string): Promise<any> {
    const stats = await this.getCheckinStatsFromDB(eventId);
    const recentCheckins = await this.getRecentCheckins(eventId, 5);
    const sponsorStats = await this.getSponsorBoothStats(eventId);

    return {
      eventId,
      stats,
      recentCheckins,
      sponsorStats,
      generatedAt: new Date()
    };
  }
}
