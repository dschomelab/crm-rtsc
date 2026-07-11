import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@Injectable()
export class CommunicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { leadId?: string; customerId?: string; type?: string }) {
    const where: any = {};
    if (params.leadId) where.leadId = params.leadId;
    if (params.customerId) where.customerId = params.customerId;
    if (params.type) where.type = params.type;
    return this.prisma.communication.findMany({
      where,
      include: { lead: true, customer: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateCommunicationDto, userId: string) {
    return this.prisma.communication.create({
      data: { ...data, userId } as any,
    });
  }
}
