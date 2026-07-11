import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCommissionDto } from './dto/create-commission.dto';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { userId?: string }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    return this.prisma.commission.findMany({
      where,
      include: { proposal: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateCommissionDto) {
    return this.prisma.commission.create({ data: data as any });
  }

  async pay(id: string) {
    const commission = await this.prisma.commission.findUnique({ where: { id } });
    if (!commission) throw new NotFoundException('Commission not found');
    return this.prisma.commission.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date() } as any,
    });
  }
}
