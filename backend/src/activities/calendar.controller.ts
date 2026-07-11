import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActivitiesService } from './activities.service';

@ApiTags('Calendar / Agenda')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CalendarController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('activities/my')
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'completed', 'all'] })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'leadId', required: false })
  async findMy(
    @CurrentUser('id') userId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('leadId') leadId?: string,
  ) {
    return this.activitiesService.findMyActivities(userId, {
      dateFrom,
      dateTo,
      status,
      type,
      leadId,
    });
  }

  @Patch('activities/:id/complete')
  async complete(@Param('id') id: string) {
    return this.activitiesService.complete(id);
  }
}
