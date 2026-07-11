import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveLeadDto {
  @ApiProperty() @IsString() stageId: string;
}
