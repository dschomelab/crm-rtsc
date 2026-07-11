import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/create-checklist-item.dto';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(serviceOrderId?: string) {
    const where: any = {};
    if (serviceOrderId) where.serviceOrderId = serviceOrderId;
    return this.prisma.checklistItem.findMany({ where, orderBy: { order: 'asc' } });
  }

  async findById(id: string) {
    const item = await this.prisma.checklistItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Checklist item not found');
    return item;
  }

  async create(dto: CreateChecklistItemDto) {
    return this.prisma.checklistItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateChecklistItemDto) {
    const item = await this.prisma.checklistItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Checklist item not found');
    return this.prisma.checklistItem.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const item = await this.prisma.checklistItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Checklist item not found');
    return this.prisma.checklistItem.delete({ where: { id } });
  }
}
