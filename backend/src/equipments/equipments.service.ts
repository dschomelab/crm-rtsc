import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { type?: string; brand?: string }) {
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.brand) where.brand = query.brand;
    return this.prisma.equipment.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return equipment;
  }

  async create(dto: CreateEquipmentDto) {
    return this.prisma.equipment.create({ data: dto });
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return this.prisma.equipment.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return this.prisma.equipment.delete({ where: { id } });
  }
}
