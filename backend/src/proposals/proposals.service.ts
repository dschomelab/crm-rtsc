import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  CreateProposalDto,
  UpdateProposalDto,
  ApproveProposalDto,
  ProposalItemDto,
} from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    status?: string;
    customerId?: string;
    leadId?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, customerId, leadId, page, limit } = query;
    const take = limit ?? 50;
    const skip = page ? (page - 1) * take : 0;
    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (leadId) where.leadId = leadId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, document: true, documentType: true } },
          items: true,
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return { data, total, page: page ?? 1, limit: take, totalPages: Math.ceil(total / take) };
  }

  async findById(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            document: true,
            documentType: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
          },
        },
        items: true,
        approvedByUser: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, pipelineId: true } },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async create(dto: CreateProposalDto, userId: string) {
    const { items, leadId, ...data } = dto;
    const customerId = dto.customerId;
    if (!customerId && !leadId) throw new BadRequestException('customerId or leadId is required');
    if (data.validUntil) data.validUntil = new Date(data.validUntil).toISOString();

    // If leadId provided, verify it exists and get its customer/value if not provided
    if (leadId) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
        select: { customerId: true, value: true, stageId: true },
      });
      if (!lead) throw new BadRequestException('Lead not found');
      // Auto-fill customerId from lead if not provided
      if (!customerId && lead.customerId) {
        data.customerId = lead.customerId;
      }
      // Auto-fill value from lead if not provided via items
      if (!data.value && lead.value) {
        data.value = Number(lead.value);
      }
      // Auto-fill stageId from lead if not provided
      if (!data.stageId && lead.stageId) {
        data.stageId = lead.stageId;
      }
    }

    const createData: any = {
      ...data,
      customerId: data.customerId ?? customerId,
      leadId,
      createdBy: userId,
      value: data.value ?? this.calculateTotal(items ?? []),
      items: items?.length
        ? {
            create: items.map((item) => ({
              description: item.description,
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
              total: (item.quantity ?? 1) * (item.unitPrice ?? 0),
            })),
          }
        : undefined,
    };

    return this.prisma.proposal.create({
      data: createData,
      include: { items: true, customer: true },
    });
  }

  async update(id: string, dto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.status !== 'DRAFT')
      throw new BadRequestException('Only draft proposals can be edited');

    const { items, ...data } = dto;
    if (data.validUntil) data.validUntil = new Date(data.validUntil).toISOString();

    if (items) {
      await this.prisma.proposalItem.deleteMany({ where: { proposalId: id } });
      await this.prisma.proposalItem.createMany({
        data: items.map((item) => ({
          proposalId: id,
          description: item.description,
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? 0,
          total: (item.quantity ?? 1) * (item.unitPrice ?? 0),
        })),
      });
    }

    const updatedItems = items
      ? await this.prisma.proposalItem.findMany({ where: { proposalId: id } })
      : undefined;
    const totalValue = updatedItems
      ? updatedItems.reduce((acc, item) => acc + Number(item.unitPrice) * item.quantity, 0)
      : undefined;

    return this.prisma.proposal.update({
      where: { id },
      data: {
        ...data,
        ...(totalValue !== undefined ? { value: totalValue } : {}),
        version: { increment: 1 },
      },
      include: { items: true, customer: true, lead: true },
    });
  }

  async approve(id: string, dto: ApproveProposalDto, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');

    const updatedProposal = await this.prisma.proposal.update({
      where: { id },
      data: {
        status: dto.action,
        approvedBy: dto.action === 'APPROVED' ? userId : undefined,
        approvedAt: dto.action === 'APPROVED' ? new Date() : undefined,
        rejectedReason: dto.action === 'REJECTED' ? dto.rejectedReason : undefined,
      },
    });

    // If approved and linked to a lead, move lead to CLOSED_WON
    if (dto.action === 'APPROVED' && proposal.leadId) {
      const wonStage = await this.prisma.pipelineStage.findFirst({
        where: { type: 'CLOSED_WON' },
        orderBy: { order: 'asc' },
      });
      if (wonStage) {
        await this.prisma.lead.update({
          where: { id: proposal.leadId },
          data: { stageId: wonStage.id, status: 'CLOSED_WON' },
        });
        await this.prisma.activity.create({
          data: {
            type: 'STAGE_CHANGED',
            description: `Lead movido para ${wonStage.name} via aprovação de proposta`,
            leadId: proposal.leadId,
            userId,
          },
        });
      }
    }

    return updatedProposal;
  }

  async send(id: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.status !== 'DRAFT')
      throw new BadRequestException('Only draft proposals can be sent');

    return this.prisma.proposal.update({
      where: { id },
      data: { status: 'SENT' },
    });
  }

  async delete(id: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return this.prisma.proposal.delete({ where: { id } });
  }

  private calculateTotal(items: ProposalItemDto[]) {
    const sum = items.reduce((acc, item) => acc + (item.quantity ?? 1) * (item.unitPrice ?? 0), 0);
    return sum;
  }
}
