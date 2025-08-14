export interface SponsorBooth {
  id: string;
  eventId: string;
  sponsorId: string;
  name: string;
  description: string;
  location: string;
  qrCode: string;
  isActive: boolean;
  visitorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoothVisitor {
  boothId: string;
  attendeeId: string;
  visitTime: Date;
  duration: number; // in minutes
  notes?: string;
}
