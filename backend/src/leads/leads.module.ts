import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from '../activities/activities.service';
import { CalendarController } from '../activities/calendar.controller';
import { ObservationsController } from './observations.controller';

@Module({
  imports: [PrismaModule],
  providers: [LeadsService, ActivitiesService],
  controllers: [LeadsController, ActivitiesController, CalendarController, ObservationsController],
  exports: [LeadsService, ActivitiesService],
})
export class LeadsModule {}
