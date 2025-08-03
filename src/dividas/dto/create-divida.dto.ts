import { IsArray, IsString } from 'class-validator';
import { Divida } from '../entities/divida.entity';

class ParcelasType {
  valorParcela: number;
  dataVencimento: Date;
  status: boolean;
  updated_at: Date | null;
  dididaId: string;
}

export class CreateDividaDto extends Divida {
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

  // /**
  //  * ID do usuário
  //  * @example João kleber
  //  * */
  @IsArray()
  parcelas: ParcelasType[];
}
