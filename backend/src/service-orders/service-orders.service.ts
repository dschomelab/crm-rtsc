import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';

@Injectable()
export class ServiceOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { status?: string; priority?: string }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    return this.prisma.serviceOrder.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: { customer: true, assignedUser: true, lead: true },
    });
    if (!order) throw new NotFoundException('Service order not found');
    return order;
  }

  async create(data: CreateServiceOrderDto) {
    const payload: any = { ...data };
    if (data.scheduledDate) payload.scheduledDate = new Date(data.scheduledDate);
    return this.prisma.serviceOrder.create({ data: payload });
  }

  async update(id: string, data: Partial<CreateServiceOrderDto>) {
    await this.findById(id);
    const payload: any = { ...data };
    if (data.scheduledDate) payload.scheduledDate = new Date(data.scheduledDate);
    return this.prisma.serviceOrder.update({ where: { id }, data: payload });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.serviceOrder.delete({ where: { id } });
  }
}
