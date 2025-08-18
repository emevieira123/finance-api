import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { PagamentoRecenteDto } from './dto/pagamento-recente.dto';
import { DashboardChartDto } from './dto/dashboard-chart.dto';

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

  async findDadosGrafico(): Promise<DashboardChartDto[]> {
    // Calcula a data de 6 meses atrás
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - 6);
    dataInicio.setDate(1); // Primeiro dia do mês
    dataInicio.setHours(0, 0, 0, 0);

    // Busca parcelas pagas dos últimos 6 meses
    const parcelasPagas = await this.prisma.parcelas.findMany({
      where: {
        status: true,
        updated_at: {
          gte: dataInicio,
        },
      },
      select: {
        valorParcela: true,
        updated_at: true,
      },
    });

    // Agrupa por mês
    const dadosPorMes = new Map<
      string,
      { valorTotal: number; quantidade: number }
    >();

    // Inicializa os últimos 6 meses
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    // Cria array com os últimos 6 meses
    const ultimos6Meses: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const dataMes = new Date(anoAtual, mesAtual - i, 1);
      const mesIndex = dataMes.getMonth();
      const mesNome = meses[mesIndex];
      ultimos6Meses.push(mesNome);
      dadosPorMes.set(mesNome, {
        valorTotal: 0,
        quantidade: 0,
      });
    }

    // Processa os dados das parcelas
    parcelasPagas.forEach((parcela) => {
      const dataPagamento = parcela.updated_at;
      const mesIndex = dataPagamento.getMonth();
      const mesNome = meses[mesIndex];

      const dadosMes = dadosPorMes.get(mesNome);
      if (dadosMes) {
        dadosMes.valorTotal += Number(parcela.valorParcela);
        dadosMes.quantidade += 1;
      }
    });

    // Converte para array no formato esperado
    const dadosGrafico: DashboardChartDto[] = ultimos6Meses.map((mesNome) => {
      const dados = dadosPorMes.get(mesNome) || {
        valorTotal: 0,
        quantidade: 0,
      };

      return {
        mes: mesNome,
        valorTotal: dados.valorTotal,
        quantidadePagamentos: dados.quantidade,
      };
    });

    return dadosGrafico;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }
}
