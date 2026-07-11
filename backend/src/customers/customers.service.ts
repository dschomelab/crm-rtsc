import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { search?: string; page?: number; limit?: number }) {
    const { search, page, limit } = query;
    const take = limit ?? 50;
    const skip = page ? (page - 1) * take : 0;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: {
          responsibleUser: { select: { id: true, name: true, email: true } },
          _count: { select: { leads: true, proposals: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, total, page: page ?? 1, limit: take, totalPages: Math.ceil(total / take) };
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        responsibleUser: { select: { id: true, name: true, email: true } },
        leads: {
          include: {
            stage: true,
            pipeline: true,
            assignedBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        proposals: { orderBy: { createdAt: 'desc' } },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto, userId: string) {
    return this.prisma.customer.create({
      data: { ...dto, responsible: userId },
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.prisma.customer.delete({ where: { id } });
  }
}
