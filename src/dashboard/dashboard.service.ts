import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { PagamentoRecenteDto } from './dto/pagamento-recente.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DashboardSummaryDto> {
    const dividasAndParcelas = await this.prisma.divida.findMany({
      include: {
        parcelas: true,
      },
    });

    const valorTotalDividas = dividasAndParcelas.reduce((total, divida) => {
      return (
        total +
        divida.parcelas.reduce((parcelaTotal, parcela) => {
          return parcelaTotal + Number(parcela.valorParcela);
        }, 0)
      );
    }, 0);

    const valorTotalPago = dividasAndParcelas.reduce((total, divida) => {
      return (
        total +
        divida.parcelas
          .filter((parcela) => parcela.status === true)
          .reduce((parcelaTotal, parcela) => {
            return parcelaTotal + Number(parcela.valorParcela);
          }, 0)
      );
    }, 0);

    const valorTotalEmDebito = valorTotalDividas - valorTotalPago;

    return {
      valorTotalDividas,
      valorTotalPago,
      valorTotalEmDebito,
    };
  }

  async findPagamentosRecentes(): Promise<PagamentoRecenteDto[]> {
    // Busca as 10 parcelas pagas mais recentes
    const parcelasPagas = await this.prisma.parcelas.findMany({
      where: {
        status: true,
      },
      include: {
        divida: {
          include: {
            parcelas: true, // Inclui todas as parcelas da dívida para calcular quantidades
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
      take: 10, // Limita aos 10 pagamentos mais recentes
    });

    const pagamentosRecentes = parcelasPagas.map((parcela) => {
      const todasParcelasDivida = parcela.divida.parcelas;

      const quantidadeParcelasPagas = todasParcelasDivida.filter(
        (p) => p.status === true,
      ).length;

      const quantidadeParcelasRestantes = todasParcelasDivida.filter(
        (p) => p.status === false,
      ).length;

      const quantidadeTotalParcelas = todasParcelasDivida.length;

      return {
        parcelaId: parcela.parcelaId,
        nomeCobrador: parcela.divida.nomeCobrador,
        nomeProduto: parcela.divida.nomeProduto,
        valorParcela: Number(parcela.valorParcela),
        quantidadeParcelasPagas,
        quantidadeParcelasRestantes,
        quantidadeTotalParcelas,
        dataPagamento: parcela.updated_at || parcela.created_at,
      };
    });

    return pagamentosRecentes;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }
}
