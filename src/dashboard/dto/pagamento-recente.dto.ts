export class PagamentoRecenteDto {
  parcelaId: string;
  nomeCobrador: string;
  nomeProduto: string;
  valorParcela: number;
  quantidadeParcelasPagas: number;
  quantidadeParcelasRestantes: number;
  quantidadeTotalParcelas: number;
  dataPagamento: Date;
}
