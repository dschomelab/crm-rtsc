import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AccessProfilesService } from './access-profiles.service';
import { CreateAccessProfileDto, UpdateAccessProfileDto } from './dto/create-access-profile.dto';

@ApiTags('Access Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('access-profiles')
export class AccessProfilesController {
  constructor(private readonly accessProfilesService: AccessProfilesService) {}

  @Get()
  findAll() {
    return this.accessProfilesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.accessProfilesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateAccessProfileDto) {
    return this.accessProfilesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccessProfileDto) {
    return this.accessProfilesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.accessProfilesService.delete(id);
  }
}
