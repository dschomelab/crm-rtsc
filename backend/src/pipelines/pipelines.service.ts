import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pipeline.findMany({
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { leads: true },
            },
          },
        },
      },
    });
  }

  async create(data: CreatePipelineDto) {
    const { stages, ...pipelineData } = data;
    return this.prisma.pipeline.create({
      data: {
        ...pipelineData,
        stages: stages
          ? {
              create: stages,
            }
          : undefined,
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: UpdatePipelineDto) {
    const { stages, ...pipelineData } = data;

    if (stages) {
      await this.prisma.pipelineStage.deleteMany({ where: { pipelineId: id } });
    }

    return this.prisma.pipeline.update({
      where: { id },
      data: {
        ...pipelineData,
        stages: stages
          ? {
              create: stages,
            }
          : undefined,
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.pipeline.delete({ where: { id } });
  }
}
