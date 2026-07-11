import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsumptionDto {
  @ApiProperty() @IsString() customerId: string;
  @ApiProperty() @IsNumber() averageKwh: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() monthlyKwh?: number[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() peakSunHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() tariffType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() tariffValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionType?: string;
}

export class CreateSimulationDto {
  @ApiProperty() @IsString() customerId: string;
  @ApiProperty() @IsNumber() averageKwh: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() peakSunHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() tariffValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionType?: string;
}

export class SolarResult {
  systemPowerKw: number;
  panelCount: number;
  inverterPowerKw: number;
  estimatedGeneration: number;
  monthlySavings: number;
  totalCost: number;
  paybackYears: number;
  co2Avoided: number;
  panelModel: string;
  inverterModel: string;
}
