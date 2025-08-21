import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventType } from '../../domain/entities/AnalyticsEvent';
import { DashboardMetric, MetricPeriod } from '../../domain/entities/DashboardMetric';
import { Report, ReportType, ReportStatus } from '../../domain/entities/Report';
import { v4 as uuidv4 } from 'uuid';

export class MockAnalyticsRepository implements IAnalyticsRepository {
  private analyticsEvents: AnalyticsEvent[] = [];
  private dashboardMetrics: DashboardMetric[] = [];
  private reports: Report[] = [];

  // Analytics Events
  async createAnalyticsEvent(event: Omit<AnalyticsEvent, 'id'>): Promise<AnalyticsEvent> {
    const id = uuidv4();
    const analyticsEvent: AnalyticsEvent = { ...event, id };
    
    this.analyticsEvents.push(analyticsEvent);
    console.log(`📊 Mock: Created analytics event ${id} for event ${event.eventId}`);
    
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
    let filtered = this.analyticsEvents;

    if (filters.eventId) {
      filtered = filtered.filter(e => e.eventId === filters.eventId);
    }
    if (filters.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }
    if (filters.eventType) {
      filtered = filtered.filter(e => e.eventType === filters.eventType);
    }
    if (filters.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
    }

    // Sort by timestamp desc
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters.offset) {
      filtered = filtered.slice(filters.offset);
    }
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
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

  // Dashboard Metrics
  async createDashboardMetric(metric: Omit<DashboardMetric, 'id'>): Promise<DashboardMetric> {
    const id = uuidv4();
    const dashboardMetric: DashboardMetric = { ...metric, id };
    
    this.dashboardMetrics.push(dashboardMetric);
    console.log(`📈 Mock: Created dashboard metric ${id}`);
    
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
    // If no metrics exist, generate mock data
    if (this.dashboardMetrics.length === 0) {
      return this.generateMockMetrics(filters);
    }

    let filtered = this.dashboardMetrics;

    if (filters.eventId) {
      filtered = filtered.filter(m => m.eventId === filters.eventId);
    }
    if (filters.category) {
      filtered = filtered.filter(m => m.category === filters.category);
    }
    if (filters.period) {
      filtered = filtered.filter(m => m.period === filters.period);
    }

    return filtered;
  }

  private generateMockMetrics(filters: any): DashboardMetric[] {
    const mockMetrics: DashboardMetric[] = [];
    const now = new Date();
    const period = filters.period || MetricPeriod.DAILY;

    // Generate sample metrics
    const metrics = [
      { name: 'Page Views', value: Math.floor(Math.random() * 1000) + 100, unit: 'views' },
      { name: 'Button Clicks', value: Math.floor(Math.random() * 500) + 50, unit: 'clicks' },
      { name: 'Form Submissions', value: Math.floor(Math.random() * 100) + 10, unit: 'submissions' },
      { name: 'API Calls', value: Math.floor(Math.random() * 200) + 20, unit: 'calls' },
      { name: 'Errors', value: Math.floor(Math.random() * 10), unit: 'errors' }
    ];

    metrics.forEach(metric => {
      const dashboardMetric: DashboardMetric = {
        id: uuidv4(),
        metricName: metric.name,
        metricValue: metric.value,
        metricUnit: metric.unit,
        eventId: filters.eventId,
        category: 'engagement',
        period: period,
        periodStart: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        periodEnd: now,
        calculatedAt: now
      };
      mockMetrics.push(dashboardMetric);
    });

    return mockMetrics;
  }

  async getDashboardMetricById(id: string): Promise<DashboardMetric | null> {
    return this.dashboardMetrics.find(m => m.id === id) || null;
  }

  async updateDashboardMetric(id: string, updates: Partial<DashboardMetric>): Promise<DashboardMetric> {
    const index = this.dashboardMetrics.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Dashboard metric not found');
    }

    this.dashboardMetrics[index] = { ...this.dashboardMetrics[index], ...updates };
    return this.dashboardMetrics[index];
  }

  async deleteDashboardMetric(id: string): Promise<boolean> {
    const index = this.dashboardMetrics.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.dashboardMetrics.splice(index, 1);
    return true;
  }

  async calculateMetrics(calculations: any[]): Promise<DashboardMetric[]> {
    return [];
  }

  // Reports
  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const id = uuidv4();
    const newReport: Report = { ...report, id };
    
    this.reports.push(newReport);
    console.log(`📄 Mock: Created report ${id} - ${report.reportName}`);
    
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
    let filtered = this.reports;

    if (filters.reportType) {
      filtered = filtered.filter(r => r.reportType === filters.reportType);
    }
    if (filters.eventId) {
      filtered = filtered.filter(r => r.eventId === filters.eventId);
    }
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    return filtered;
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
    const report: Omit<Report, 'id'> = {
      reportName: `${reportType} Report - ${new Date().toLocaleDateString()}`,
      reportType: reportType as ReportType,
      generatedBy: 'system',
      status: ReportStatus.COMPLETED,
      createdAt: new Date(),
      completedAt: new Date(),
      reportData: {
        summary: `Mock report for ${reportType}`,
        totalEvents: this.analyticsEvents.length,
        totalMetrics: this.dashboardMetrics.length,
        generatedAt: new Date().toISOString()
      }
    };

    return await this.createReport(report);
  }
}
