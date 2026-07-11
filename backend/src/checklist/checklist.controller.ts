import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChecklistService } from './checklist.service';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/create-checklist-item.dto';

@ApiTags('Checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  findAll(@Query('serviceOrderId') serviceOrderId?: string) {
    return this.checklistService.findAll(serviceOrderId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.checklistService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateChecklistItemDto) {
    return this.checklistService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistItemDto) {
    return this.checklistService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.checklistService.delete(id);
  }
}
