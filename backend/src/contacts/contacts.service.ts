import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(customerId?: string) {
    const where: any = {};
    if (customerId) where.customerId = customerId;
    return this.prisma.contact.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto });
  }

  async update(id: string, dto: UpdateContactDto) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.delete({ where: { id } });
  }
}
