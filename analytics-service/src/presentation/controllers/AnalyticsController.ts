import { Request, Response } from 'express';
import { TrackAnalyticsEventUseCase } from '../../application/use-cases/TrackAnalyticsEventUseCase';
import { GenerateDashboardMetricsUseCase } from '../../application/use-cases/GenerateDashboardMetricsUseCase';
import { GenerateReportUseCase } from '../../application/use-cases/GenerateReportUseCase';
import { AnalyticsEventType } from '../../domain/entities/AnalyticsEvent';
import { MetricPeriod, DashboardMetric } from '../../domain/entities/DashboardMetric';
import { ReportType } from '../../domain/entities/Report';
import { MySQLAnalyticsRepository } from '../../infrastructure/database/MySQLAnalyticsRepository';

export class AnalyticsController {
  private analyticsRepository: MySQLAnalyticsRepository;

  constructor(
    private trackAnalyticsEventUseCase: TrackAnalyticsEventUseCase,
    private generateDashboardMetricsUseCase: GenerateDashboardMetricsUseCase,
    private generateReportUseCase: GenerateReportUseCase
  ) {
    // Get database pool from global
    const dbPool = (global as any).dbPool;
    this.analyticsRepository = new MySQLAnalyticsRepository(dbPool);
  }

  // Simplified methods for demo
  async getRealtimeMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      
      // Get real-time data from database
      const realTimeData = await this.analyticsRepository.getRealtimeMetrics(eventId);
      
      res.status(200).json({
        success: true,
        data: {
          ...realTimeData,
          last_updated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting realtime metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get realtime metrics'
      });
    }
  }

  async getDemodashboard(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      
      // Get real attendance data from database
      const attendanceData = await this.analyticsRepository.getRealAttendanceData(eventId);
      const realtimeData = await this.analyticsRepository.getRealtimeMetrics(eventId);
      
      res.status(200).json({
        success: true,
        data: {
          event_info: {
            name: attendanceData.event_name,
            date: new Date().toISOString().split('T')[0],
            status: realtimeData.status
          },
          attendance: {
            registered: attendanceData.registered,
            checked_in: attendanceData.checked_in,
            rate: `${attendanceData.rate}%`
          },
          survey_summary: {
            active_surveys: 1,
            total_responses: Math.floor(attendanceData.checked_in * 0.7), // 70% response rate estimate
            avg_satisfaction: 4.2
          },
          quick_stats: {
            peak_hour: "14:00-15:00",
            last_checkin: new Date().toISOString(),
            engagement_level: attendanceData.rate > 70 ? "HIGH" : attendanceData.rate > 40 ? "MEDIUM" : "LOW"
          }
        }
      });
    } catch (error) {
      console.error('Error getting demo dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get demo dashboard'
      });
    }
  }

  async getAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      
      // Get real attendance data from database
      const attendanceData = await this.analyticsRepository.getRealAttendanceData(eventId);
      const eventDetails = await this.analyticsRepository.getEventDetails(eventId);
      const checkinDetails = await this.analyticsRepository.getCheckinDetails(eventId);
      
      res.status(200).json({
        success: true,
        data: {
          report_type: "ATTENDANCE",
          event_name: attendanceData.event_name,
          event_status: eventDetails.status,
          start_date: eventDetails.start_date,
          end_date: eventDetails.end_date,
          total_registered: attendanceData.registered,
          total_checked_in: attendanceData.checked_in,
          attendance_rate: `${attendanceData.rate}%`,
          checkin_status: checkinDetails.status,
          last_checkin_time: checkinDetails.last_checkin_time,
          first_checkin_time: checkinDetails.first_checkin_time
        }
      });
    } catch (error) {
      console.error('Error generating attendance report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate attendance report'
      });
    }
  }

  async getEventSummaryReport(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      
      // Get real data from database
      const attendanceData = await this.analyticsRepository.getRealAttendanceData(eventId);
      const realtimeData = await this.analyticsRepository.getRealtimeMetrics(eventId);
      
      res.status(200).json({
        success: true,
        data: {
          report_type: "EVENT_SUMMARY",
          event_id: eventId,
          event_name: attendanceData.event_name,
          metrics: {
            attendance: `${attendanceData.checked_in}/${attendanceData.registered} (${attendanceData.rate}%)`,
            peak_time: "14:00-15:00",
            survey_responses: Math.floor(attendanceData.checked_in * 0.7),
            satisfaction_score: "4.2/5",
            current_attendees: realtimeData.current_attendees,
            new_checkins_last_hour: realtimeData.new_checkins_last_hour
          },
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating summary report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate summary report'
      });
    }
  }

  async getQuickStats(req: Request, res: Response): Promise<void> {
    try {
      // Get real stats from database
      const allEventsStats = await this.analyticsRepository.getAllEventsStats();
      
      res.status(200).json({
        success: true,
        data: {
          total_events: allEventsStats.total_events,
          total_attendees: allEventsStats.total_attendees,
          total_checked_in: allEventsStats.total_checked_in,
          average_attendance_rate: `${allEventsStats.average_attendance_rate}%`,
          active_surveys: 2, // Keep as estimate for now
          average_satisfaction: 4.1, // Keep as estimate for now
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting quick stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get quick stats'
      });
    }
  }

  // Track Analytics Events
  async trackEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, eventType, userId, sessionId, metadata } = req.body;

      if (!eventId || !eventType) {
        res.status(400).json({
          success: false,
          error: 'eventId and eventType are required'
        });
        return;
      }

      const analyticsEvent = await this.trackAnalyticsEventUseCase.execute({
        eventId,
        eventType: eventType as AnalyticsEventType,
        userId,
        sessionId,
        metadata
      });

      res.status(201).json({
        success: true,
        data: analyticsEvent
      });
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async trackBatchEvents(req: Request, res: Response): Promise<void> {
    try {
      const { events } = req.body;

      if (!Array.isArray(events) || events.length === 0) {
        res.status(400).json({
          success: false,
          error: 'events array is required and must not be empty'
        });
        return;
      }

      const analyticsEvents = await this.trackAnalyticsEventUseCase.executeBatch(events);

      res.status(201).json({
        success: true,
        data: analyticsEvents,
        count: analyticsEvents.length
      });
    } catch (error) {
      console.error('Error tracking batch analytics events:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Dashboard Metrics - Real Data
  async generateMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { period = 'daily' } = req.query;

      // Get real attendance data from database
      const attendanceData = await this.analyticsRepository.getRealAttendanceData(eventId);
      const realtimeData = await this.analyticsRepository.getRealtimeMetrics(eventId);

      // Calculate real metrics
      const metrics = {
        event_id: eventId,
        event_name: attendanceData.event_name,
        period: period,
        metrics: {
          total_registrations: attendanceData.registered,
          total_checkins: attendanceData.checked_in,
          checkin_rate: attendanceData.rate,
          current_attendees: realtimeData.current_attendees,
          new_checkins_last_hour: realtimeData.new_checkins_last_hour,
          live_checkins: realtimeData.live_checkins,
          attendance_percentage: `${attendanceData.rate}%`,
          engagement_level: attendanceData.rate > 70 ? "HIGH" : attendanceData.rate > 40 ? "MEDIUM" : "LOW"
        },
        last_updated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error generating dashboard metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate metrics'
      });
    }
  }

  async getMetricsByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { period = 'daily', startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const metrics = await this.generateDashboardMetricsUseCase.execute({
        eventId,
        period: period as MetricPeriod,
        startDate: start,
        endDate: end
      });

      res.status(200).json({
        success: true,
        data: metrics,
        count: metrics.length
      });
    } catch (error) {
      console.error('Error getting metrics by event:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getDashboardMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, period, start, end } = req.query;
      
      if (!period || !start || !end) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: period, start, end'
        });
        return;
      }

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid date format'
        });
        return;
      }

      const metrics = await this.generateDashboardMetricsUseCase.execute({
        eventId: eventId as string | undefined,
        period: period as MetricPeriod,
        startDate,
        endDate
      });

      // Group metrics by category
      const groupedMetrics = metrics.reduce((acc, metric) => {
        const category = metric.category || 'other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(metric);
        return acc;
      }, {} as Record<string, DashboardMetric[]>);

      res.json({
        success: true,
        data: {
          metrics,
          groupedMetrics,
          summary: {
            total: metrics.length,
            byCategory: Object.keys(groupedMetrics).map(category => ({
              category,
              count: groupedMetrics[category].length
            }))
          }
        }
      });
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard metrics'
      });
    }
  }

  // Reports
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportName, reportType, eventId, filters } = req.body;

      if (!reportName || !reportType) {
        res.status(400).json({
          success: false,
          error: 'reportName and reportType are required'
        });
        return;
      }

      const report = await this.generateReportUseCase.execute({
        reportName,
        reportType: reportType as ReportType,
        eventId,
        generatedBy: (req as any).user?.id || 'system',
        filters
      });

      res.status(201).json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getReportStatus(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;

      // This would typically get the report from a repository
      // For now, return a mock response
      res.status(200).json({
        success: true,
        data: {
          id: reportId,
          status: 'COMPLETED',
          progress: 100
        }
      });
    } catch (error) {
      console.error('Error getting report status:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Analytics Summary
  async getAnalyticsSummary(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { period = 'daily' } = req.query;

      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const metrics = await this.generateDashboardMetricsUseCase.execute({
        eventId,
        period: period as MetricPeriod,
        startDate,
        endDate
      });

      // Group metrics by category
      const summary = metrics.reduce((acc, metric) => {
        if (!acc[metric.category || 'other']) {
          acc[metric.category || 'other'] = [];
        }
        acc[metric.category || 'other'].push(metric);
        return acc;
      }, {} as Record<string, any[]>);

      res.status(200).json({
        success: true,
        data: {
          eventId,
          period,
          summary,
          totalMetrics: metrics.length,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
