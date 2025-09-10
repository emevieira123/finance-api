import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateParcelaDto {
  /**
   * Valor da parcela
   * @example 250.50
   */
  @IsNumber()
  @IsOptional()
  valorParcela?: number;

  /**
   * Data de vencimento da parcela
   * @example 2024-06-15T00:00:00.000Z
   */
  @IsDateString()
  @IsOptional()
  dataVencimento?: Date;

  /**
   * Status da parcela (true = paga, false = pendente)
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
