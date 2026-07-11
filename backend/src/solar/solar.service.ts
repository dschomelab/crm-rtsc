import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateConsumptionDto, CreateSimulationDto, SolarResult } from './dto/solar.dto';

@Injectable()
export class SolarService {
  constructor(private readonly prisma: PrismaService) {}

  async getConsumption(customerId: string) {
    return this.prisma.solarConsumption.findFirst({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveConsumption(dto: CreateConsumptionDto) {
    return this.prisma.solarConsumption.create({ data: dto });
  }

  async getSimulations(customerId: string) {
    return this.prisma.solarSimulation.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async simulate(dto: CreateSimulationDto): Promise<SolarResult> {
    const averageKwh = dto.averageKwh;
    const peakSunHours = dto.peakSunHours ?? 4.5;
    const tariffValue = dto.tariffValue ?? 0.85;

    const panelPowerKw = 0.550;
    const panelCost = 1800;
    const inverterCostPerKw = 500;

    const systemPowerKw = Math.ceil((averageKwh / 30 / peakSunHours) * 1.2 / 0.55) * 0.55;
    const panelCount = Math.ceil(systemPowerKw / panelPowerKw);
    const inverterPowerKw = Math.round(systemPowerKw * 1.1 * 10) / 10;

    const estimatedGeneration = systemPowerKw * peakSunHours * 30;
    const monthlySavings = estimatedGeneration * tariffValue;
    const totalCost = panelCount * panelCost + inverterPowerKw * inverterCostPerKw;
    const paybackYears = monthlySavings > 0 ? Math.round((totalCost / (monthlySavings * 12)) * 10) / 10 : 99;
    const co2Avoided = Math.round(estimatedGeneration * 12 * 0.00014 * 100) / 100;

    return {
      systemPowerKw: Math.round(systemPowerKw * 100) / 100,
      panelCount,
      inverterPowerKw,
      estimatedGeneration: Math.round(estimatedGeneration),
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      paybackYears,
      co2Avoided,
      panelModel: `Painel Solar ${panelPowerKw * 1000}W`,
      inverterModel: `Inversor ${inverterPowerKw}kW`,
    };
  }

  async saveSimulation(dto: CreateSimulationDto, result: SolarResult, proposalId?: string) {
    return this.prisma.solarSimulation.create({
      data: {
        customerId: dto.customerId,
        proposalId,
        systemPowerKw: result.systemPowerKw,
        panelCount: result.panelCount,
        panelModel: result.panelModel,
        inverterModel: result.inverterModel,
        estimatedGeneration: result.estimatedGeneration,
        monthlySavings: result.monthlySavings,
        totalCost: result.totalCost,
        paybackYears: result.paybackYears,
        co2Avoided: result.co2Avoided,
      },
    });
  }
}
