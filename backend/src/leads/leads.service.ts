import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryLeadDto) {
    const {
      pipelineId,
      stageId,
      search,
      status,
      assignedTo,
      source,
      minValue,
      maxValue,
      dateFrom,
      dateTo,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;
    const take = limit ?? 50;
    const skip = page ? (page - 1) * take : 0;

    const where: any = {};

    if (pipelineId) where.pipelineId = pipelineId;
    if (stageId) where.stageId = stageId;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (source) where.source = { contains: source, mode: 'insensitive' };

    if (minValue !== undefined || maxValue !== undefined) {
      where.value = {};
      if (minValue !== undefined) where.value.gte = minValue;
      if (maxValue !== undefined) where.value.lte = maxValue;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder ?? 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          assignedBy: { select: { id: true, name: true, email: true } },
          stage: { select: { id: true, name: true, pipelineId: true } },
          pipeline: { select: { id: true, name: true } },
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data,
      total,
      page: page ?? 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findById(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        activities: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        assignedBy: { select: { id: true, name: true, email: true } },
        stage: true,
        pipeline: true,
        tags: {
          include: { tag: true },
        },
        observations: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    return lead;
  }

  async addTag(leadId: string, tagId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const tag = await this.prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) throw new NotFoundException('Tag not found');

    return this.prisma.leadTag.upsert({
      where: { leadId_tagId: { leadId, tagId } },
      update: {},
      create: { leadId, tagId },
    });
  }

  async removeTag(leadId: string, tagId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.leadTag.delete({
      where: { leadId_tagId: { leadId, tagId } },
    });
  }

  async create(data: CreateLeadDto, userId: string) {
    const lead = await this.prisma.lead.create({
      data: {
        ...data,
        assignedTo: userId,
      },
    });

    await this.prisma.activity.create({
      data: {
        type: 'LEAD_CREATED',
        description: 'Lead created',
        leadId: lead.id,
        userId,
      },
    });

    return lead;
  }

  async update(id: string, data: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }

  async moveToStage(id: string, stageId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { stage: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    const stage = await this.prisma.pipelineStage.findUnique({
      where: { id: stageId },
    });
    if (!stage) throw new NotFoundException('Stage not found');

    if (lead.pipelineId && stage.pipelineId !== lead.pipelineId) {
      throw new NotFoundException('Stage does not belong to the same pipeline');
    }

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { stageId },
    });

    await this.prisma.activity.create({
      data: {
        type: 'STAGE_CHANGED',
        description: `Lead moved from "${lead.stage?.name ?? 'None'}" to "${stage.name}"`,
        leadId: id,
        userId,
      },
    });

    return updated;
  }

  async delete(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.delete({ where: { id } });
  }
}
