import mysql from 'mysql2/promise';
import { IAttendeeRepository } from '../../domain/repositories/IAttendeeRepository';
import { Attendee, AttendeeStatus } from '../../domain/entities/Attendee';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export class MySQLAttendeeRepository implements IAttendeeRepository {
  constructor(private pool: mysql.Pool) {}

  async findById(id: string): Promise<Attendee | null> {
    const query = `
      SELECT * FROM attendees 
      WHERE id = ?
    `;
    
    const [rows] = await this.pool.execute(query, [id]);
    const result = rows as any[];
    return result[0] ? this.mapRowToAttendee(result[0]) : null;
  }

  async findByEventId(eventId: string): Promise<Attendee[]> {
    const query = `
      SELECT * FROM attendees 
      WHERE event_id = ? 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute(query, [eventId]);
    const result = rows as any[];
    return result.map(row => this.mapRowToAttendee(row));
  }

  async findByUserId(userId: string): Promise<Attendee[]> {
    const query = `
      SELECT * FROM attendees 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute(query, [userId]);
    const result = rows as any[];
    return result.map(row => this.mapRowToAttendee(row));
  }

  async findByTicketId(ticketId: string): Promise<Attendee | null> {
    const query = `
      SELECT * FROM attendees 
      WHERE ticket_id = ?
    `;
    
    const [rows] = await this.pool.execute(query, [ticketId]);
    const result = rows as any[];
    return result[0] ? this.mapRowToAttendee(result[0]) : null;
  }

  async findByQrCode(qrCode: string): Promise<Attendee | null> {
    const query = `
      SELECT * FROM attendees 
      WHERE qr_code = ?
    `;
    
    const [rows] = await this.pool.execute(query, [qrCode]);
    const result = rows as any[];
    return result[0] ? this.mapRowToAttendee(result[0]) : null;
  }

  async findByStatus(status: AttendeeStatus): Promise<Attendee[]> {
    const query = `
      SELECT * FROM attendees 
      WHERE status = ? 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await this.pool.execute(query, [status]);
    const result = rows as any[];
    return result.map(row => this.mapRowToAttendee(row));
  }

  async create(attendee: Omit<Attendee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendee> {
    const id = this.generateUUID();
    const query = `
      INSERT INTO attendees (
        id, event_id, user_id, ticket_id, check_in_time, check_out_time, 
        status, qr_code, sponsor_booth_visits, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const values = [
      id,
      attendee.eventId,
      attendee.userId,
      attendee.ticketId,
      attendee.checkInTime,
      attendee.checkOutTime,
      attendee.status,
      attendee.qrCode,
      JSON.stringify(attendee.sponsorBoothVisits)
    ];
    
    await this.pool.execute(query, values);
    
    // Return the created attendee
    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create attendee');
    }
    return created;
  }

  async update(id: string, updates: Partial<Attendee>): Promise<Attendee> {
    const setFields: string[] = [];
    const values: any[] = [];

    if (updates.eventId !== undefined) {
      setFields.push('event_id = ?');
      values.push(updates.eventId);
    }
    if (updates.userId !== undefined) {
      setFields.push('user_id = ?');
      values.push(updates.userId);
    }
    if (updates.ticketId !== undefined) {
      setFields.push('ticket_id = ?');
      values.push(updates.ticketId);
    }
    if (updates.checkInTime !== undefined) {
      setFields.push('check_in_time = ?');
      values.push(updates.checkInTime);
    }
    if (updates.checkOutTime !== undefined) {
      setFields.push('check_out_time = ?');
      values.push(updates.checkOutTime);
    }
    if (updates.status !== undefined) {
      setFields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.qrCode !== undefined) {
      setFields.push('qr_code = ?');
      values.push(updates.qrCode);
    }
    if (updates.sponsorBoothVisits !== undefined) {
      setFields.push('sponsor_booth_visits = ?');
      values.push(JSON.stringify(updates.sponsorBoothVisits));
    }

    setFields.push('updated_at = NOW()');
    values.push(id);

    const query = `
      UPDATE attendees 
      SET ${setFields.join(', ')}
      WHERE id = ?
    `;
    
    const [result] = await this.pool.execute(query, values);
    const updateResult = result as any;
    
    if (updateResult.affectedRows === 0) {
      throw new NotFoundError(`Attendee with id ${id} not found`);
    }
    
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to retrieve updated attendee');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM attendees WHERE id = ?`;
    const [result] = await this.pool.execute(query, [id]);
    const deleteResult = result as any;
    
    if (deleteResult.affectedRows === 0) {
      throw new NotFoundError(`Attendee with id ${id} not found`);
    }
  }

  async countByEventId(eventId: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM attendees WHERE event_id = ?`;
    const [rows] = await this.pool.execute(query, [eventId]);
    const result = rows as any[];
    return parseInt(result[0].count);
  }

  async countByStatus(eventId: string, status: AttendeeStatus): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM attendees WHERE event_id = ? AND status = ?`;
    const [rows] = await this.pool.execute(query, [eventId, status]);
    const result = rows as any[];
    return parseInt(result[0].count);
  }

  private mapRowToAttendee(row: any): Attendee {
    let sponsorBoothVisits = [];
    try {
      if (row.sponsor_booth_visits && row.sponsor_booth_visits.trim() !== '') {
        sponsorBoothVisits = JSON.parse(row.sponsor_booth_visits);
      }
    } catch (error) {
      console.warn('Failed to parse sponsor_booth_visits JSON:', row.sponsor_booth_visits);
      sponsorBoothVisits = [];
    }

    return {
      id: row.id,
      eventId: row.event_id,
      userId: row.user_id,
      ticketId: row.ticket_id,
      checkInTime: row.check_in_time ? new Date(row.check_in_time) : undefined,
      checkOutTime: row.check_out_time ? new Date(row.check_out_time) : undefined,
      status: row.status as AttendeeStatus,
      qrCode: row.qr_code,
      sponsorBoothVisits,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
