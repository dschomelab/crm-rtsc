import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@ApiTags('Equipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('brand') brand?: string) {
    return this.equipmentsService.findAll({ type, brand });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.equipmentsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.equipmentsService.delete(id);
  }
}
