import { PartialType } from '@nestjs/swagger';
import { CreateDividaDto } from './create-divida.dto';
import { IsString } from 'class-validator';

export class UpdateDividaDto extends PartialType(CreateDividaDto) {
  /**
   * Nome da loja ou pessoa para qual a divida será aplicada
   * @example Fort Atacadista
   * */
  @IsString()
  nomeCobrador: string;

  /**
   * Nome do produto comprado
   * @example Pneu para carro
   * */
  @IsString()
  nomeProduto: string;
}
