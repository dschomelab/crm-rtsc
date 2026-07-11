import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AttachmentsService {
  private uploadDir = join(__dirname, '..', '..', '..', 'uploads');

  constructor(private readonly prisma: PrismaService) {}

  async findByLead(leadId: string) {
    return this.prisma.attachment.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(leadId: string, file: Express.Multer.File) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    await fs.mkdir(this.uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);

    return this.prisma.attachment.create({
      data: {
        leadId,
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  }

  async delete(id: string) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new NotFoundException('Attachment not found');

    const filePath = join(this.uploadDir, attachment.fileName);
    try {
      await fs.unlink(filePath);
    } catch {}

    return this.prisma.attachment.delete({ where: { id } });
  }
}
