import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObservationDto {
  @ApiProperty() @IsString() @IsNotEmpty() content: string;
}
