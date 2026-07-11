import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCostDto, UpdateCostDto } from './dto/create-cost.dto';

@Injectable()
export class CostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(proposalId?: string) {
    const where: any = {};
    if (proposalId) where.proposalId = proposalId;
    return this.prisma.cost.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const cost = await this.prisma.cost.findUnique({ where: { id } });
    if (!cost) throw new NotFoundException('Cost not found');
    return cost;
  }

  async create(dto: CreateCostDto) {
    return this.prisma.cost.create({ data: dto });
  }

  async update(id: string, dto: UpdateCostDto) {
    const cost = await this.prisma.cost.findUnique({ where: { id } });
    if (!cost) throw new NotFoundException('Cost not found');
    return this.prisma.cost.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const cost = await this.prisma.cost.findUnique({ where: { id } });
    if (!cost) throw new NotFoundException('Cost not found');
    return this.prisma.cost.delete({ where: { id } });
  }
}
