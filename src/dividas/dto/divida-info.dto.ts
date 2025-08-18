export class DividaInfoDto {
  dividaId: string;
  nomeCobrador: string;
  nomeProduto: string;
  dataCriacao: Date;
  quantidadeParcelas: number;
  valorTotalDivida: number;
  valorTotalPago: number;
  valorTotalRestante: number;
  quantidadeParcelasPagas: number;
  quantidadeTotalParcelas: number;
  proximoVencimento: Date | null;
  progresso: number; // Percentual de progresso (0-100)
}
