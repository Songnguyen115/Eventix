import { ISponsorBoothRepository } from '../../domain/repositories/ISponsorBoothRepository';
import { SponsorBooth, BoothVisitor } from '../../domain/entities/SponsorBooth';
import { ValidationError } from '../../domain/errors/ValidationError';

export interface CreateSponsorBoothRequest {
  eventId: string;
  sponsorId: string;
  name: string;
  description: string;
  location: string;
}

export interface UpdateSponsorBoothRequest {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  isActive?: boolean;
}

export interface AddBoothVisitorRequest {
  boothId: string;
  attendeeId: string;
  duration: number;
  notes?: string;
}

export class ManageSponsorBoothUseCase {
  constructor(private sponsorBoothRepository: ISponsorBoothRepository) {}

  async createBooth(request: CreateSponsorBoothRequest): Promise<SponsorBooth> {
    // Validate input
    if (!request.eventId || !request.sponsorId || !request.name || !request.location) {
      throw new ValidationError('Missing required fields: eventId, sponsorId, name, location');
    }

    // Generate QR code for the booth
    const qrCode = this.generateBoothQRCode(request.eventId, request.sponsorId);

    const boothData = {
      eventId: request.eventId,
      sponsorId: request.sponsorId,
      name: request.name,
      description: request.description || '',
      location: request.location,
      qrCode,
      isActive: true,
      visitorCount: 0
    };

    return await this.sponsorBoothRepository.create(boothData);
  }

  async updateBooth(request: UpdateSponsorBoothRequest): Promise<SponsorBooth> {
    if (!request.id) {
      throw new ValidationError('Booth ID is required');
    }

    const existingBooth = await this.sponsorBoothRepository.findById(request.id);
    if (!existingBooth) {
      throw new ValidationError('Booth not found');
    }

    const updates: Partial<SponsorBooth> = {};
    if (request.name !== undefined) updates.name = request.name;
    if (request.description !== undefined) updates.description = request.description;
    if (request.location !== undefined) updates.location = request.location;
    if (request.isActive !== undefined) updates.isActive = request.isActive;

    updates.updatedAt = new Date();

    return await this.sponsorBoothRepository.update(request.id, updates);
  }

  async addVisitor(request: AddBoothVisitorRequest): Promise<BoothVisitor> {
    if (!request.boothId || !request.attendeeId || !request.duration) {
      throw new ValidationError('Missing required fields: boothId, attendeeId, duration');
    }

    // Check if booth exists and is active
    const booth = await this.sponsorBoothRepository.findById(request.boothId);
    if (!booth) {
      throw new ValidationError('Booth not found');
    }

    if (!booth.isActive) {
      throw new ValidationError('Booth is not active');
    }

    // Add visitor
    const visitor = await this.sponsorBoothRepository.addVisitor({
      boothId: request.boothId,
      attendeeId: request.attendeeId,
      duration: request.duration,
      notes: request.notes
    });

    // Update visitor count
    await this.sponsorBoothRepository.update(request.boothId, {
      visitorCount: booth.visitorCount + 1,
      updatedAt: new Date()
    });

    return visitor;
  }

  async getBoothVisitors(boothId: string): Promise<BoothVisitor[]> {
    if (!boothId) {
      throw new ValidationError('Booth ID is required');
    }

    return await this.sponsorBoothRepository.getVisitors(boothId);
  }

  async getBoothStats(boothId: string): Promise<{
    totalVisitors: number;
    averageVisitDuration: number;
    totalVisits: number;
  }> {
    const visitors = await this.sponsorBoothRepository.getVisitors(boothId);
    
    const totalVisitors = new Set(visitors.map(v => v.attendeeId)).size;
    const totalVisits = visitors.length;
    const averageVisitDuration = totalVisits > 0 
      ? visitors.reduce((sum, v) => sum + v.duration, 0) / totalVisits 
      : 0;

    return {
      totalVisitors,
      totalVisits,
      averageVisitDuration: Math.round(averageVisitDuration * 100) / 100
    };
  }

  private generateBoothQRCode(eventId: string, sponsorId: string): string {
    // Generate a unique QR code for the booth
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `BOOTH_${eventId}_${sponsorId}_${timestamp}_${random}`;
  }
}
