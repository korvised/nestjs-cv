import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
  @IsString()
  @IsOptional()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  @IsOptional()
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  @IsOptional()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  @IsOptional()
  lng: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @IsOptional()
  mileage: number;
}
