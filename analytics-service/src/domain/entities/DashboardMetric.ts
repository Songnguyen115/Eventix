export interface DashboardMetric {
  id: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  eventId?: string;
  category?: string;
  period: MetricPeriod;
  periodStart: Date;
  periodEnd: Date;
  calculatedAt: Date;
}

export enum MetricPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum MetricCategory {
  ATTENDANCE = 'attendance',
  REVENUE = 'revenue',
  ENGAGEMENT = 'engagement',
  SURVEY = 'survey',
  SPONSOR = 'sponsor',
  PERFORMANCE = 'performance'
}

export interface MetricCalculation {
  metricName: string;
  calculation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  field: string;
  filter?: Record<string, any>;
}
