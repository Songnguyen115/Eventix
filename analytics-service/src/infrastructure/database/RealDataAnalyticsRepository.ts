import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventType } from '../../domain/entities/AnalyticsEvent';
import { DashboardMetric, MetricPeriod } from '../../domain/entities/DashboardMetric';
import { Report, ReportType, ReportStatus } from '../../domain/entities/Report';
import { CheckinServiceRepository } from '../external/CheckinServiceRepository';
import { Pool } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export class RealDataAnalyticsRepository implements IAnalyticsRepository {
  private checkinService: CheckinServiceRepository;
  private analyticsEvents: AnalyticsEvent[] = [];
  private reports: Report[] = [];

  constructor(
    private dbPool: Pool,
    checkinServiceUrl: string = process.env.CHECKIN_SERVICE_URL || 'http://localhost:3001'
  ) {
    this.checkinService = new CheckinServiceRepository(checkinServiceUrl, dbPool);
  }

  // Analytics Events (same as before - these are analytics-specific)
  async createAnalyticsEvent(event: Omit<AnalyticsEvent, 'id'>): Promise<AnalyticsEvent> {
    const id = uuidv4();
    const analyticsEvent: AnalyticsEvent = { ...event, id };
    
    this.analyticsEvents.push(analyticsEvent);
    console.log(`📊 Real: Created analytics event ${id} for event ${event.eventId}`);
    
    // Optionally store in database
    try {
      await this.dbPool.execute(
        'INSERT INTO analytics_events (id, event_id, event_type, user_id, session_id, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, event.eventId, event.eventType, event.userId, event.sessionId, JSON.stringify(event.metadata), event.timestamp]
      );
    } catch (error) {
      console.error('⚠️  Could not store analytics event in DB, keeping in memory only');
    }
    
    return analyticsEvent;
  }

  async getAnalyticsEvents(filters: {
    eventId?: string;
    userId?: string;
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AnalyticsEvent[]> {
    // Try database first, fallback to memory
    try {
      let query = 'SELECT * FROM analytics_events WHERE 1=1';
      const params: any[] = [];

      if (filters.eventId) {
        query += ' AND event_id = ?';
        params.push(filters.eventId);
      }
      if (filters.startDate) {
        query += ' AND timestamp >= ?';
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        query += ' AND timestamp <= ?';
        params.push(filters.endDate);
      }

      query += ' ORDER BY timestamp DESC';
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      const [rows] = await this.dbPool.execute(query, params);
      
      return (rows as any[]).map(row => ({
        id: row.id,
        eventId: row.event_id,
        eventType: row.event_type as AnalyticsEventType,
        userId: row.user_id,
        sessionId: row.session_id,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        timestamp: new Date(row.timestamp)
      }));
    } catch (error) {
      console.log('⚠️  Database query failed, using memory data');
      return this.analyticsEvents.filter(e => 
        (!filters.eventId || e.eventId === filters.eventId) &&
        (!filters.startDate || e.timestamp >= filters.startDate) &&
        (!filters.endDate || e.timestamp <= filters.endDate)
      ).slice(0, filters.limit || 10);
    }
  }

  async getAnalyticsEventById(id: string): Promise<AnalyticsEvent | null> {
    return this.analyticsEvents.find(e => e.id === id) || null;
  }

  async updateAnalyticsEvent(id: string, updates: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    const index = this.analyticsEvents.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Analytics event not found');
    }

    this.analyticsEvents[index] = { ...this.analyticsEvents[index], ...updates };
    return this.analyticsEvents[index];
  }

  async deleteAnalyticsEvent(id: string): Promise<boolean> {
    const index = this.analyticsEvents.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.analyticsEvents.splice(index, 1);
    return true;
  }

  // Dashboard Metrics - REAL DATA from Checkin Service
  async createDashboardMetric(metric: Omit<DashboardMetric, 'id'>): Promise<DashboardMetric> {
    const id = uuidv4();
    const dashboardMetric: DashboardMetric = { ...metric, id };
    
    try {
      await this.dbPool.execute(
        'INSERT INTO dashboard_metrics (id, metric_name, metric_value, metric_unit, event_id, category, period, period_start, period_end, calculated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, metric.metricName, metric.metricValue, metric.metricUnit, metric.eventId, metric.category, metric.period, metric.periodStart, metric.periodEnd, metric.calculatedAt]
      );
    } catch (error) {
      console.error('⚠️  Could not store metric in DB');
    }
    
    return dashboardMetric;
  }

  async getDashboardMetrics(filters: {
    eventId?: string;
    category?: string;
    period?: MetricPeriod;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<DashboardMetric[]> {
    console.log(`📈 Generating REAL metrics for event: ${filters.eventId}`);
    
    const eventId = filters.eventId || 'default-event';
    
    try {
      // Get real data from Checkin Service
      const checkinStats = await this.checkinService.getCheckinStatsFromDB(eventId);
      const sponsorStats = await this.checkinService.getSponsorBoothStats(eventId);
      
      const realMetrics: DashboardMetric[] = [];
      const now = new Date();
      const period = filters.period || MetricPeriod.DAILY;

      // REAL Attendance Metrics
      realMetrics.push({
        id: uuidv4(),
        metricName: 'Total Registrations',
        metricValue: checkinStats.totalRegistrations,
        metricUnit: 'people',
        eventId: eventId,
        category: 'attendance',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      realMetrics.push({
        id: uuidv4(),
        metricName: 'Total Check-ins',
        metricValue: checkinStats.totalCheckins,
        metricUnit: 'people',
        eventId: eventId,
        category: 'attendance',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      realMetrics.push({
        id: uuidv4(),
        metricName: 'Check-ins Today',
        metricValue: checkinStats.checkinsToday,
        metricUnit: 'people',
        eventId: eventId,
        category: 'attendance',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      realMetrics.push({
        id: uuidv4(),
        metricName: 'Attendance Rate',
        metricValue: Math.round(checkinStats.attendanceRate * 100) / 100,
        metricUnit: 'percent',
        eventId: eventId,
        category: 'attendance',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      // REAL Sponsor Metrics
      const totalSponsorVisits = sponsorStats.reduce((sum, booth) => sum + booth.totalVisits, 0);
      const totalUniqueVisitors = sponsorStats.reduce((sum, booth) => sum + booth.uniqueVisitors, 0);

      realMetrics.push({
        id: uuidv4(),
        metricName: 'Sponsor Booth Visits',
        metricValue: totalSponsorVisits,
        metricUnit: 'visits',
        eventId: eventId,
        category: 'sponsor',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      realMetrics.push({
        id: uuidv4(),
        metricName: 'Unique Booth Visitors',
        metricValue: totalUniqueVisitors,
        metricUnit: 'people',
        eventId: eventId,
        category: 'sponsor',
        period: period,
        periodStart: filters.startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: filters.endDate || now,
        calculatedAt: now
      });

      console.log(`✅ Generated ${realMetrics.length} real metrics`);
      return realMetrics;

    } catch (error) {
      console.error('❌ Error generating real metrics:', error);
      
      // Fallback to basic metrics if checkin service unavailable
      return this.generateFallbackMetrics(filters);
    }
  }

  private generateFallbackMetrics(filters: any): DashboardMetric[] {
    console.log('⚠️  Using fallback metrics (checkin service unavailable)');
    
    const now = new Date();
    const eventId = filters.eventId || 'default-event';
    
    return [
      {
        id: uuidv4(),
        metricName: 'Service Status',
        metricValue: 0,
        metricUnit: 'status',
        eventId: eventId,
        category: 'system',
        period: filters.period || MetricPeriod.DAILY,
        periodStart: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        periodEnd: now,
        calculatedAt: now
      }
    ];
  }

  async getDashboardMetricById(id: string): Promise<DashboardMetric | null> {
    // Implementation for getting specific metric
    return null;
  }

  async updateDashboardMetric(id: string, updates: Partial<DashboardMetric>): Promise<DashboardMetric> {
    throw new Error('Not implemented');
  }

  async deleteDashboardMetric(id: string): Promise<boolean> {
    return false;
  }

  async calculateMetrics(calculations: any[]): Promise<DashboardMetric[]> {
    return [];
  }

  // Reports (similar to mock but with real data integration)
  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const id = uuidv4();
    const newReport: Report = { ...report, id };
    
    // Enhanced report with real data
    if (report.eventId) {
      try {
        const eventSummary = await this.checkinService.getEventSummary(report.eventId);
        newReport.reportData = {
          ...report.reportData,
          realData: eventSummary,
          generatedFrom: 'checkin-service',
          dataAccuracy: 'high'
        };
      } catch (error) {
        console.error('⚠️  Could not enhance report with real data');
      }
    }
    
    this.reports.push(newReport);
    console.log(`📄 Real: Created report ${id} - ${report.reportName} with real data`);
    
    return newReport;
  }

  async getReports(filters: {
    reportType?: string;
    eventId?: string;
    status?: string;
    generatedBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<Report[]> {
    return this.reports.filter(r => 
      (!filters.reportType || r.reportType === filters.reportType) &&
      (!filters.eventId || r.eventId === filters.eventId)
    );
  }

  async getReportById(id: string): Promise<Report | null> {
    return this.reports.find(r => r.id === id) || null;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Report not found');
    }

    this.reports[index] = { ...this.reports[index], ...updates };
    return this.reports[index];
  }

  async deleteReport(id: string): Promise<boolean> {
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) return false;

    this.reports.splice(index, 1);
    return true;
  }

  async generateReport(reportType: string, filters: any): Promise<Report> {
    const eventSummary = filters.eventId 
      ? await this.checkinService.getEventSummary(filters.eventId)
      : null;

    const report: Omit<Report, 'id'> = {
      reportName: `${reportType} Report - ${new Date().toLocaleDateString()}`,
      reportType: reportType as ReportType,
      eventId: filters.eventId,
      generatedBy: 'system',
      status: ReportStatus.COMPLETED,
      createdAt: new Date(),
      completedAt: new Date(),
      reportData: {
        summary: `Real data report for ${reportType}`,
        realData: eventSummary,
        source: 'checkin-service',
        generatedAt: new Date().toISOString()
      }
    };

    return await this.createReport(report);
  }
}
