import { Request, Response } from 'express';
import { ManageSponsorBoothUseCase } from '../../application/use-cases/ManageSponsorBoothUseCase';
import { ValidationError } from '../../domain/errors/ValidationError';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export class SponsorBoothController {
  constructor(private manageSponsorBoothUseCase: ManageSponsorBoothUseCase) {}

  async createBooth(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, sponsorId, name, description, location } = req.body;

      const booth = await this.manageSponsorBoothUseCase.createBooth({
        eventId,
        sponsorId,
        name,
        description,
        location
      });

      res.status(201).json({
        success: true,
        data: booth,
        message: 'Sponsor booth created successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Create booth error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async updateBooth(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, location, isActive } = req.body;

      const booth = await this.manageSponsorBoothUseCase.updateBooth({
        id,
        name,
        description,
        location,
        isActive
      });

      res.status(200).json({
        success: true,
        data: booth,
        message: 'Sponsor booth updated successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Update booth error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async addBoothVisitor(req: Request, res: Response): Promise<void> {
    try {
      const { boothId, attendeeId, duration, notes } = req.body;

      const visitor = await this.manageSponsorBoothUseCase.addVisitor({
        boothId,
        attendeeId,
        duration,
        notes
      });

      res.status(201).json({
        success: true,
        data: visitor,
        message: 'Visitor added to booth successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Add booth visitor error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getBoothVisitors(req: Request, res: Response): Promise<void> {
    try {
      const { boothId } = req.params;

      const visitors = await this.manageSponsorBoothUseCase.getBoothVisitors(boothId);

      res.status(200).json({
        success: true,
        data: visitors
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Get booth visitors error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getBoothStats(req: Request, res: Response): Promise<void> {
    try {
      const { boothId } = req.params;

      const stats = await this.manageSponsorBoothUseCase.getBoothStats(boothId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Get booth stats error:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }
}
