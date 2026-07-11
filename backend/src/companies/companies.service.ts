import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<any> {
    return this.prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<any> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: CreateCompanyDto): Promise<any> {
    return this.prisma.company.create({ data });
  }

  async update(id: string, data: Partial<CreateCompanyDto>): Promise<any> {
    await this.findById(id);
    return this.prisma.company.update({ where: { id }, data });
  }

  async delete(id: string): Promise<any> {
    if (id === 'default') throw new BadRequestException('Cannot delete the default company');
    await this.findById(id);
    return this.prisma.company.delete({ where: { id } });
  }
}
