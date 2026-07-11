import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { userId?: string; entity?: string; action?: string }) {
    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.entity) where.entity = query.entity;
    if (query.action) where.action = query.action;
    return this.prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({ data: dto as any });
  }
}
