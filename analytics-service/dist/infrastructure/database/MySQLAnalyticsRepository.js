"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLAnalyticsRepository = void 0;
const Report_1 = require("../../domain/entities/Report");
const uuid_1 = require("uuid");
class MySQLAnalyticsRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async createAnalyticsEvent(event) {
        const id = (0, uuid_1.v4)();
        const [result] = await this.pool.execute('INSERT INTO analytics_events (id, event_id, event_type, user_id, session_id, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, event.eventId, event.eventType, event.userId, event.sessionId, JSON.stringify(event.metadata), event.timestamp]);
        return { ...event, id };
    }
    async getAnalyticsEvents(filters) {
        let query = 'SELECT * FROM analytics_events WHERE 1=1';
        const params = [];
        if (filters.eventId) {
            query += ' AND event_id = ?';
            params.push(filters.eventId);
        }
        if (filters.userId) {
            query += ' AND user_id = ?';
            params.push(filters.userId);
        }
        if (filters.eventType) {
            query += ' AND event_type = ?';
            params.push(filters.eventType);
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
        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(filters.offset);
        }
        const [rows] = await this.pool.execute(query, params);
        return rows.map(row => ({
            id: row.id,
            eventId: row.event_id,
            eventType: row.event_type,
            userId: row.user_id,
            sessionId: row.session_id,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            timestamp: new Date(row.timestamp)
        }));
    }
    async getAnalyticsEventById(id) {
        const [rows] = await this.pool.execute('SELECT * FROM analytics_events WHERE id = ?', [id]);
        if (rows.length === 0 || !rows[0])
            return null;
        const row = rows[0];
        return {
            id: row.id,
            eventId: row.event_id,
            eventType: row.event_type,
            userId: row.user_id,
            sessionId: row.session_id,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            timestamp: new Date(row.timestamp)
        };
    }
    async updateAnalyticsEvent(id, updates) {
        const setClauses = [];
        const params = [];
        if (updates.eventId !== undefined) {
            setClauses.push('event_id = ?');
            params.push(updates.eventId);
        }
        if (updates.eventType !== undefined) {
            setClauses.push('event_type = ?');
            params.push(updates.eventType);
        }
        if (updates.userId !== undefined) {
            setClauses.push('user_id = ?');
            params.push(updates.userId);
        }
        if (updates.sessionId !== undefined) {
            setClauses.push('session_id = ?');
            params.push(updates.sessionId);
        }
        if (updates.metadata !== undefined) {
            setClauses.push('metadata = ?');
            params.push(JSON.stringify(updates.metadata));
        }
        if (updates.timestamp !== undefined) {
            setClauses.push('timestamp = ?');
            params.push(updates.timestamp);
        }
        if (setClauses.length === 0) {
            throw new Error('No updates provided');
        }
        params.push(id);
        const [result] = await this.pool.execute(`UPDATE analytics_events SET ${setClauses.join(', ')} WHERE id = ?`, params);
        if (result.affectedRows === 0) {
            throw new Error('Analytics event not found');
        }
        const updated = await this.getAnalyticsEventById(id);
        if (!updated)
            throw new Error('Failed to retrieve updated analytics event');
        return updated;
    }
    async deleteAnalyticsEvent(id) {
        const [result] = await this.pool.execute('DELETE FROM analytics_events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async createDashboardMetric(metric) {
        const id = (0, uuid_1.v4)();
        const [result] = await this.pool.execute('INSERT INTO dashboard_metrics (id, metric_name, metric_value, metric_unit, event_id, category, period, period_start, period_end, calculated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, metric.metricName, metric.metricValue, metric.metricUnit, metric.eventId, metric.category, metric.period, metric.periodStart, metric.periodEnd, metric.calculatedAt]);
        return { ...metric, id };
    }
    async getDashboardMetrics(filters) {
        let query = 'SELECT * FROM dashboard_metrics WHERE 1=1';
        const params = [];
        if (filters.eventId) {
            query += ' AND event_id = ?';
            params.push(filters.eventId);
        }
        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }
        if (filters.period) {
            query += ' AND period = ?';
            params.push(filters.period);
        }
        if (filters.startDate) {
            query += ' AND period_start >= ?';
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            query += ' AND period_end <= ?';
            params.push(filters.endDate);
        }
        query += ' ORDER BY calculated_at DESC';
        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }
        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(filters.offset);
        }
        const [rows] = await this.pool.execute(query, params);
        return rows.map((row) => {
            if (!row)
                return null;
            return {
                id: row.id,
                metricName: row.metric_name,
                metricValue: row.metric_value,
                metricUnit: row.metric_unit,
                eventId: row.event_id,
                category: row.category,
                period: row.period,
                periodStart: new Date(row.period_start),
                periodEnd: new Date(row.period_end),
                calculatedAt: new Date(row.calculated_at)
            };
        }).filter(Boolean);
    }
    async getDashboardMetricById(id) {
        const [rows] = await this.pool.execute('SELECT * FROM dashboard_metrics WHERE id = ?', [id]);
        if (rows.length === 0 || !rows[0])
            return null;
        const row = rows[0];
        return {
            id: row.id,
            metricName: row.metric_name,
            metricValue: row.metric_value,
            metricUnit: row.metric_unit,
            eventId: row.event_id,
            category: row.category,
            period: row.period,
            periodStart: new Date(row.period_start),
            periodEnd: new Date(row.period_end),
            calculatedAt: new Date(row.calculated_at)
        };
    }
    async updateDashboardMetric(id, updates) {
        const setClauses = [];
        const params = [];
        if (updates.metricName !== undefined) {
            setClauses.push('metric_name = ?');
            params.push(updates.metricName);
        }
        if (updates.metricValue !== undefined) {
            setClauses.push('metric_value = ?');
            params.push(updates.metricValue);
        }
        if (updates.metricUnit !== undefined) {
            setClauses.push('metric_unit = ?');
            params.push(updates.metricUnit);
        }
        if (updates.eventId !== undefined) {
            setClauses.push('event_id = ?');
            params.push(updates.eventId);
        }
        if (updates.category !== undefined) {
            setClauses.push('category = ?');
            params.push(updates.category);
        }
        if (updates.period !== undefined) {
            setClauses.push('period = ?');
            params.push(updates.period);
        }
        if (updates.periodStart !== undefined) {
            setClauses.push('period_start = ?');
            params.push(updates.periodStart);
        }
        if (updates.periodEnd !== undefined) {
            setClauses.push('period_end = ?');
            params.push(updates.periodEnd);
        }
        if (updates.calculatedAt !== undefined) {
            setClauses.push('calculated_at = ?');
            params.push(updates.calculatedAt);
        }
        if (setClauses.length === 0) {
            throw new Error('No updates provided');
        }
        params.push(id);
        const [result] = await this.pool.execute(`UPDATE dashboard_metrics SET ${setClauses.join(', ')} WHERE id = ?`, params);
        if (result.affectedRows === 0) {
            throw new Error('Dashboard metric not found');
        }
        const updated = await this.getDashboardMetricById(id);
        if (!updated)
            throw new Error('Failed to retrieve updated dashboard metric');
        return updated;
    }
    async deleteDashboardMetric(id) {
        const [result] = await this.pool.execute('DELETE FROM dashboard_metrics WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async calculateMetrics(calculations) {
        return [];
    }
    async createReport(report) {
        const id = (0, uuid_1.v4)();
        const [result] = await this.pool.execute('INSERT INTO reports (id, report_name, report_type, event_id, generated_by, file_path, report_data, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, report.reportName, report.reportType, report.eventId, report.generatedBy, report.filePath, JSON.stringify(report.reportData), report.status, report.createdAt]);
        return { ...report, id };
    }
    async getReports(filters) {
        let query = 'SELECT * FROM reports WHERE 1=1';
        const params = [];
        if (filters.reportType) {
            query += ' AND report_type = ?';
            params.push(filters.reportType);
        }
        if (filters.eventId) {
            query += ' AND event_id = ?';
            params.push(filters.eventId);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        if (filters.generatedBy) {
            query += ' AND generated_by = ?';
            params.push(filters.generatedBy);
        }
        query += ' ORDER BY created_at DESC';
        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }
        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(filters.offset);
        }
        const [rows] = await this.pool.execute(query, params);
        return rows.map(row => {
            if (!row)
                return null;
            return {
                id: row.id,
                reportName: row.report_name,
                reportType: row.report_type,
                eventId: row.event_id,
                generatedBy: row.generated_by,
                filePath: row.file_path,
                reportData: row.report_data ? JSON.parse(row.report_data) : undefined,
                status: row.status,
                createdAt: new Date(row.created_at),
                completedAt: row.completed_at ? new Date(row.completed_at) : undefined
            };
        }).filter(Boolean);
    }
    async getReportById(id) {
        const [rows] = await this.pool.execute('SELECT * FROM reports WHERE id = ?', [id]);
        if (rows.length === 0 || !rows[0])
            return null;
        const row = rows[0];
        return {
            id: row.id,
            reportName: row.report_name,
            reportType: row.report_type,
            eventId: row.event_id,
            generatedBy: row.generated_by,
            filePath: row.file_path,
            reportData: row.report_data ? JSON.parse(row.report_data) : undefined,
            status: row.status,
            createdAt: new Date(row.created_at),
            completedAt: row.completed_at ? new Date(row.completed_at) : undefined
        };
    }
    async updateReport(id, updates) {
        const setClauses = [];
        const params = [];
        if (updates.reportName !== undefined) {
            setClauses.push('report_name = ?');
            params.push(updates.reportName);
        }
        if (updates.reportType !== undefined) {
            setClauses.push('report_type = ?');
            params.push(updates.reportType);
        }
        if (updates.eventId !== undefined) {
            setClauses.push('event_id = ?');
            params.push(updates.eventId);
        }
        if (updates.generatedBy !== undefined) {
            setClauses.push('generated_by = ?');
            params.push(updates.generatedBy);
        }
        if (updates.filePath !== undefined) {
            setClauses.push('file_path = ?');
            params.push(updates.filePath);
        }
        if (updates.reportData !== undefined) {
            setClauses.push('report_data = ?');
            params.push(JSON.stringify(updates.reportData));
        }
        if (updates.status !== undefined) {
            setClauses.push('status = ?');
            params.push(updates.status);
        }
        if (updates.completedAt !== undefined) {
            setClauses.push('completed_at = ?');
            params.push(updates.completedAt);
        }
        if (setClauses.length === 0) {
            throw new Error('No updates provided');
        }
        params.push(id);
        const [result] = await this.pool.execute(`UPDATE reports SET ${setClauses.join(', ')} WHERE id = ?`, params);
        if (result.affectedRows === 0) {
            throw new Error('Report not found');
        }
        const updated = await this.getReportById(id);
        if (!updated)
            throw new Error('Failed to retrieve updated report');
        return updated;
    }
    async deleteReport(id) {
        const [result] = await this.pool.execute('DELETE FROM reports WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async generateReport(reportType, filters) {
        const report = {
            reportName: `${reportType} Report`,
            reportType: reportType,
            generatedBy: 'system',
            status: Report_1.ReportStatus.COMPLETED,
            createdAt: new Date(),
            completedAt: new Date()
        };
        return await this.createReport(report);
    }
}
exports.MySQLAnalyticsRepository = MySQLAnalyticsRepository;
