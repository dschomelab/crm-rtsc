import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({
      include: { createdByUser: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateCampaignDto, userId: string) {
    const payload: any = { ...data };
    if (data.startDate) payload.startDate = new Date(data.startDate);
    if (data.endDate) payload.endDate = new Date(data.endDate);
    return this.prisma.campaign.create({
      data: { ...payload, createdBy: userId } as any,
    });
  }

  async update(id: string, data: Partial<CreateCampaignDto>) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    const payload: any = { ...data };
    if (data.startDate) payload.startDate = new Date(data.startDate);
    if (data.endDate) payload.endDate = new Date(data.endDate);
    return this.prisma.campaign.update({ where: { id }, data: payload });
  }
}
