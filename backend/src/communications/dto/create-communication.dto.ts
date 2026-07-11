import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunicationDto {
  @ApiProperty() @IsString() @IsNotEmpty() type: string;
  @ApiPropertyOptional() @IsOptional() @IsString() direction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subject?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leadId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
}
