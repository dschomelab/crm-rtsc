import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId?: string) {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    const data = await this.prisma.team.findMany({
      where,
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return data;
  }

  async findById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true } },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async create(dto: CreateTeamDto) {
    return this.prisma.team.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    const { memberIds, ...data } = dto;
    return this.prisma.team.update({
      where: { id },
      data: {
        ...data,
        ...(memberIds ? { members: { set: memberIds.map((id: string) => ({ id })) } } : {}),
      },
    });
  }

  async delete(id: string) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return this.prisma.team.delete({ where: { id } });
  }
}
