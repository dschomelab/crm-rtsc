import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    const settings = await this.prisma.companySettings.findUnique({ where: { id: 'default' } });
    if (!settings) throw new NotFoundException('Settings not found');
    return settings;
  }

  async update(data: any) {
    return this.prisma.companySettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...data },
      update: data,
    });
  }
}
