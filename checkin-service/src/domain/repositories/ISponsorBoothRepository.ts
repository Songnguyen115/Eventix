import { SponsorBooth, BoothVisitor } from '../entities/SponsorBooth';

export interface ISponsorBoothRepository {
  findById(id: string): Promise<SponsorBooth | null>;
  findByEventId(eventId: string): Promise<SponsorBooth[]>;
  findBySponsorId(sponsorId: string): Promise<SponsorBooth[]>;
  findByQrCode(qrCode: string): Promise<SponsorBooth | null>;
  create(booth: Omit<SponsorBooth, 'id' | 'createdAt' | 'updatedAt'>): Promise<SponsorBooth>;
  update(id: string, updates: Partial<SponsorBooth>): Promise<SponsorBooth>;
  delete(id: string): Promise<void>;
  
  // Booth visitor management
  addVisitor(visitor: Omit<BoothVisitor, 'visitTime'>): Promise<BoothVisitor>;
  getVisitors(boothId: string): Promise<BoothVisitor[]>;
  getVisitorCount(boothId: string): Promise<number>;
  updateVisitorDuration(boothId: string, attendeeId: string, duration: number): Promise<void>;
}
