import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@ApiTags('Lead Observations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads/:leadId/observations')
export class ObservationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findByLead(@Param('leadId') leadId: string) {
    return this.prisma.observation.findMany({
      where: { leadId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(
    @Param('leadId') leadId: string,
    @Body() dto: CreateObservationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.prisma.observation.create({
      data: { content: dto.content, leadId, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateObservationDto) {
    return this.prisma.observation.update({
      where: { id },
      data: dto,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.prisma.observation.delete({ where: { id } });
  }
}
