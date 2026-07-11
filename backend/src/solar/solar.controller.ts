import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SolarService } from './solar.service';
import { CreateConsumptionDto, CreateSimulationDto } from './dto/solar.dto';

@ApiTags('Solar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('solar')
export class SolarController {
  constructor(private readonly solarService: SolarService) {}

  @Get('consumption/:customerId')
  getConsumption(@Param('customerId') customerId: string) {
    return this.solarService.getConsumption(customerId);
  }

  @Post('consumption')
  saveConsumption(@Body() dto: CreateConsumptionDto) {
    return this.solarService.saveConsumption(dto);
  }

  @Get('simulations/:customerId')
  getSimulations(@Param('customerId') customerId: string) {
    return this.solarService.getSimulations(customerId);
  }

  @Post('simulate')
  async simulate(@Body() dto: CreateSimulationDto) {
    const result = await this.solarService.simulate(dto);
    const saved = await this.solarService.saveSimulation(dto, result);
    return { simulation: saved, result };
  }
}
