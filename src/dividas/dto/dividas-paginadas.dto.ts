import { DividaInfoDto } from './divida-info.dto';

export class DividasPaginadasDto {
  paginaAtual: number;
  totalPaginas: number;
  qtdItemsPorPagina: number;
  totalRegistros: number;
  possuiProximaPagina: boolean;
  items: DividaInfoDto[];
}
