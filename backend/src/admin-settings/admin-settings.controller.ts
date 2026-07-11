import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminSettingsService } from './admin-settings.service';

@ApiTags('Admin - Configurações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  find() {
    return this.adminSettingsService.find();
  }

  @Put()
  update(@Body() data: any) {
    return this.adminSettingsService.update(data);
  }
}
