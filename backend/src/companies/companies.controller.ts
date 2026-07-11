import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCompanyDto, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only administrators can create companies');
    return this.companiesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateCompanyDto>, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only administrators can update companies');
    return this.companiesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only administrators can delete companies');
    return this.companiesService.delete(id);
  }
}
