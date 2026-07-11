import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActivitiesService } from '../activities/activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from '../database/prisma/prisma.service';

@ApiTags('Lead Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads/:leadId/activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async findByLead(@Param('leadId') leadId: string) {
    return this.activitiesService.findByLead(leadId);
  }

  @Post()
  async create(
    @Param('leadId') leadId: string,
    @Body() dto: CreateActivityDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.activitiesService.create(leadId, dto, userId);
  }

  @Patch(':id')
  async update(
    @Param('leadId') leadId: string,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    const activity = await this.prisma.activity.findFirst({ where: { id, leadId } });
    if (!activity) throw new NotFoundException('Activity not found');
    return this.prisma.activity.update({ where: { id }, data: dto });
  }

  @Delete(':id')
  async delete(@Param('leadId') leadId: string, @Param('id') id: string) {
    const activity = await this.prisma.activity.findFirst({ where: { id, leadId } });
    if (!activity) throw new NotFoundException('Activity not found');
    return this.prisma.activity.delete({ where: { id } });
  }
}
