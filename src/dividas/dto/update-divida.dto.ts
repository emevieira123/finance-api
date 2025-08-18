import { PartialType } from '@nestjs/swagger';
import { CreateDividaDto } from './create-divida.dto';

export class UpdateDividaDto extends PartialType(CreateDividaDto) {
  // Permite atualização parcial de todos os campos do CreateDividaDto
  // nomeCobrador?: string;
  // nomeProduto?: string;
  // parcelas?: ParcelasType[];
}
