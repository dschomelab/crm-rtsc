import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateAiSuggestionDto } from './dto/create-ai-suggestion.dto';

@Injectable()
export class AiSuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { userId?: string; type?: string }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.type) where.type = params.type;
    return this.prisma.aiSuggestion.findMany({
      where,
      include: { lead: true, customer: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateAiSuggestionDto, userId: string) {
    return this.prisma.aiSuggestion.create({
      data: { ...data, userId } as any,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.aiSuggestion.update({
      where: { id },
      data: { read: true } as any,
    });
  }
}
