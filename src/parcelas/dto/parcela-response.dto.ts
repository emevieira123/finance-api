export class ParcelaResponseDto {
  parcelaId: string;
  valorParcela: number;
  dataVencimento: Date;
  status: boolean;
  dividaId: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}
