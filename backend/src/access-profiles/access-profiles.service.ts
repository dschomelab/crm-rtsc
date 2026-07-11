import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateAccessProfileDto, UpdateAccessProfileDto } from './dto/create-access-profile.dto';

@Injectable()
export class AccessProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.accessProfile.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const profile = await this.prisma.accessProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Access profile not found');
    return profile;
  }

  async create(dto: CreateAccessProfileDto) {
    return this.prisma.accessProfile.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateAccessProfileDto) {
    const profile = await this.prisma.accessProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Access profile not found');
    return this.prisma.accessProfile.update({ where: { id }, data: dto as any });
  }

  async delete(id: string) {
    const profile = await this.prisma.accessProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Access profile not found');
    return this.prisma.accessProfile.delete({ where: { id } });
  }
}
