import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateActivityDto } from '../leads/dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByLead(leadId: string) {
    return this.prisma.activity.findMany({
      where: { leadId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(leadId: string, data: CreateActivityDto, userId: string) {
    return this.prisma.activity.create({
      data: {
        type: data.type,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        leadId,
        userId,
      },
    });
  }

  async findMyActivities(
    userId: string,
    query: {
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      type?: string;
      leadId?: string;
    },
  ) {
    const where: any = { userId };

    if (query.leadId) where.leadId = query.leadId;
    if (query.type) where.type = query.type;

    if (query.status === 'pending') {
      where.completedAt = null;
    } else if (query.status === 'completed') {
      where.completedAt = { not: null };
    }

    if (query.dateFrom || query.dateTo) {
      where.dueDate = {};
      if (query.dateFrom) where.dueDate.gte = new Date(query.dateFrom);
      if (query.dateTo) where.dueDate.lte = new Date(query.dateTo);
    }

    return this.prisma.activity.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async complete(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');

    const completedAt = activity.completedAt ? null : new Date();

    return this.prisma.activity.update({
      where: { id },
      data: { completedAt },
    });
  }
}
