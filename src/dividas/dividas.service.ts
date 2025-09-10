import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDividaDto } from './dto/create-divida.dto';
import { UpdateDividaDto } from './dto/update-divida.dto';
import { DividaInfoDto } from './dto/divida-info.dto';
import { DividasPaginadasDto } from './dto/dividas-paginadas.dto';
import { DividasCabecalhoDto } from './dto/dividas-cabecalho.dto';

@Injectable()
export class DividasService {
  constructor(private readonly prisma: PrismaService) {}

  private calcularInformacoesDivida(divida: any): DividaInfoDto {
    const parcelas = divida.parcelas;
    const valorTotalDivida = parcelas.reduce((total, parcela) => {
      return total + Number(parcela.valorParcela);
    }, 0);

    const parcelasPagas = parcelas.filter((parcela) => parcela.status === true);
    const valorTotalPago = parcelasPagas.reduce((total, parcela) => {
      return total + Number(parcela.valorParcela);
    }, 0);

    const valorTotalRestante = valorTotalDivida - valorTotalPago;
    const quantidadeParcelasPagas = parcelasPagas.length;
    const quantidadeTotalParcelas = parcelas.length;

    // Calcula o progresso em percentual
    const progresso =
      valorTotalDivida > 0 ? (valorTotalPago / valorTotalDivida) * 100 : 0;

    // Encontra o próximo vencimento (primeira parcela não paga)
    const proximaParcela = parcelas
      .filter((parcela) => parcela.status === false)
      .sort(
        (a, b) =>
          new Date(a.dataVencimento).getTime() -
          new Date(b.dataVencimento).getTime(),
      )[0];

    const proximoVencimento = proximaParcela
      ? new Date(proximaParcela.dataVencimento)
      : null;

    return {
      dividaId: divida.dividaId,
      nomeCobrador: divida.nomeCobrador,
      nomeProduto: divida.nomeProduto,
      dataCriacao: divida.created_at,
      quantidadeParcelas: quantidadeTotalParcelas,
      valorTotalDivida,
      valorTotalPago,
      valorTotalRestante,
      quantidadeParcelasPagas,
      quantidadeTotalParcelas,
      proximoVencimento,
      progresso: Math.round(progresso * 100) / 100, // Arredonda para 2 casas decimais
    };
  }

  async findCabecalho(): Promise<DividasCabecalhoDto> {
    // Buscar todas as dívidas com suas parcelas
    const dividas = await this.prisma.divida.findMany({
      include: {
        parcelas: true,
      },
    });

    // Calcular informações gerais
    const totalDividasGeral = dividas.length;
    let totalDividasAtivas = 0;
    let totalDividasQuitadas = 0;
    let valorTotalGeral = 0;
    let valorTotalPago = 0;

    dividas.forEach((divida) => {
      const parcelas = divida.parcelas;
      const valorTotalDivida = parcelas.reduce((total, parcela) => {
        return total + Number(parcela.valorParcela);
      }, 0);

      const parcelasPagas = parcelas.filter(
        (parcela) => parcela.status === true,
      );
      const valorTotalPagoDivida = parcelasPagas.reduce((total, parcela) => {
        return total + Number(parcela.valorParcela);
      }, 0);

      valorTotalGeral += valorTotalDivida;
      valorTotalPago += valorTotalPagoDivida;

      // Verificar se a dívida está quitada (todas as parcelas pagas)
      const isQuitada =
        parcelas.length > 0 &&
        parcelas.every((parcela) => parcela.status === true);

      if (isQuitada) {
        totalDividasQuitadas++;
      } else {
        totalDividasAtivas++;
      }
    });

    const valorTotalAPagar = valorTotalGeral - valorTotalPago;
    const progressoGeral =
      valorTotalGeral > 0 ? (valorTotalPago / valorTotalGeral) * 100 : 0;

    return {
      totalDividasGeral,
      totalDividasAtivas,
      totalDividasQuitadas,
      valorTotalGeral,
      valorTotalAPagar,
      progressoGeral: Math.round(progressoGeral * 100) / 100, // Arredonda para 2 casas decimais
    };
  }

  async create(createDividaDto: CreateDividaDto, usuarioId: string) {
    const createDivida = await this.prisma.divida.create({
      data: {
        ...createDividaDto,
        usuarioId,
        parcelas: {
          createMany: {
            data: createDividaDto.parcelas.map((parcela) => {
              return {
                ...parcela,
                updated_at: null,
                status: false,
                dataVencimento: new Date(parcela.dataVencimento),
                dididaId: createDividaDto.dividaId,
              };
            }),
          },
        },
      },
    });

    const filterCreate = await this.prisma.divida.findUnique({
      where: {
        dividaId: createDivida.dividaId,
      },
      include: {
        parcelas: true,
      },
    });

    return {
      ...filterCreate,
    };
  }

  async findAll(
    pagina: number = 1,
    qtdItemsPorPagina: number = 10,
    filtro?: string,
  ): Promise<DividasPaginadasDto> {
    const skip = (pagina - 1) * qtdItemsPorPagina;

    // Construir where clause baseado no filtro
    const whereClause = filtro
      ? {
          OR: [
            {
              nomeProduto: {
                contains: filtro,
              },
            },
            {
              nomeCobrador: {
                contains: filtro,
              },
            },
          ],
        }
      : {};

    // Contar total de registros
    const totalRegistros = await this.prisma.divida.count({
      where: whereClause,
    });

    // Buscar dívidas com paginação
    const dividas = await this.prisma.divida.findMany({
      where: whereClause,
      include: {
        parcelas: true,
      },
      skip,
      take: qtdItemsPorPagina,
      orderBy: {
        created_at: 'desc',
      },
    });

    // Calcular informações de paginação
    const totalPaginas = Math.ceil(totalRegistros / qtdItemsPorPagina);
    const possuiProximaPagina = pagina < totalPaginas;

    // Processar dívidas
    const items = dividas.map((divida) =>
      this.calcularInformacoesDivida(divida),
    );

    return {
      paginaAtual: pagina,
      totalPaginas,
      qtdItemsPorPagina,
      totalRegistros,
      possuiProximaPagina,
      items,
    };
  }

  async findOne(dividaId: string) {
    const dividaExist = await this.prisma.divida.findUnique({
      where: { dividaId },
      include: {
        parcelas: true,
      },
    });

    if (!dividaExist) {
      throw new HttpException('Divida não encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      ...dividaExist,
      quantidadeParcelas: dividaExist.parcelas.length,
      dataCriacao: dividaExist.created_at,
      valorTotal: dividaExist.parcelas.reduce((total, parcela) => {
        return total + Number(parcela.valorParcela);
      }, 0),
      statusDivida: dividaExist.parcelas.every(
        (parcela) => parcela.status === true,
      )
        ? 'Paga'
        : 'Pendente',
      parcelas: dividaExist.parcelas.map((parcela) => ({
        ...parcela,
        dataCriacao: parcela.created_at,
        dataAtualizacao: parcela.updated_at,
        dividaId: undefined,
        created_at: undefined,
        updated_at: undefined,
      })),
      created_at: undefined,
      usuarioId: undefined,
    };
  }

  async update(dividaId: string, updateDividaDto: UpdateDividaDto) {
    // Verificar se a dívida existe
    const dividaExist = await this.prisma.divida.findUnique({
      where: { dividaId },
      include: {
        parcelas: true,
      },
    });

    if (!dividaExist) {
      throw new HttpException('Divida não encontrada', HttpStatus.NOT_FOUND);
    }

    // Preparar dados para atualização
    const updateData: any = {};

    // Atualizar campos básicos da dívida se fornecidos
    if (updateDividaDto.nomeCobrador !== undefined) {
      updateData.nomeCobrador = updateDividaDto.nomeCobrador;
    }

    if (updateDividaDto.nomeProduto !== undefined) {
      updateData.nomeProduto = updateDividaDto.nomeProduto;
    }

    // Atualizar a dívida
    const updatedDivida = await this.prisma.divida.update({
      where: { dividaId },
      data: updateData,
      include: {
        parcelas: true,
      },
    });

    // Se parcelas foram fornecidas, atualizar as parcelas
    if (updateDividaDto.parcelas && updateDividaDto.parcelas.length > 0) {
      // Deletar parcelas existentes
      await this.prisma.parcelas.deleteMany({
        where: { dividaId },
      });

      // Criar novas parcelas
      await this.prisma.parcelas.createMany({
        data: updateDividaDto.parcelas.map((parcela) => ({
          ...parcela,
          dividaId,
          dataVencimento: new Date(parcela.dataVencimento),
          status: parcela.status || false,
          updated_at: parcela.updated_at || null,
        })),
      });

      // Buscar dívida atualizada com parcelas
      const dividaComParcelas = await this.prisma.divida.findUnique({
        where: { dividaId },
        include: {
          parcelas: true,
        },
      });

      return {
        ...dividaComParcelas,
        quantidadeParcelas: dividaComParcelas.parcelas.length,
        dataCriacao: dividaComParcelas.created_at,
        valorTotal: dividaComParcelas.parcelas.reduce((total, parcela) => {
          return total + Number(parcela.valorParcela);
        }, 0),
        statusDivida: dividaComParcelas.parcelas.every(
          (parcela) => parcela.status === true,
        )
          ? 'Paga'
          : 'Pendente',
        parcelas: dividaComParcelas.parcelas.map((parcela) => ({
          ...parcela,
          dataCriacao: parcela.created_at,
          dataAtualizacao: parcela.updated_at,
          dividaId: undefined,
          created_at: undefined,
          updated_at: undefined,
        })),
        created_at: undefined,
        usuarioId: undefined,
      };
    }

    // Retornar dívida atualizada sem alterar parcelas
    return {
      ...updatedDivida,
      quantidadeParcelas: updatedDivida.parcelas.length,
      dataCriacao: updatedDivida.created_at,
      valorTotal: updatedDivida.parcelas.reduce((total, parcela) => {
        return total + Number(parcela.valorParcela);
      }, 0),
      statusDivida: updatedDivida.parcelas.every(
        (parcela) => parcela.status === true,
      )
        ? 'Paga'
        : 'Pendente',
      parcelas: updatedDivida.parcelas.map((parcela) => ({
        ...parcela,
        dataCriacao: parcela.created_at,
        dataAtualizacao: parcela.updated_at,
        dividaId: undefined,
        created_at: undefined,
        updated_at: undefined,
      })),
      created_at: undefined,
      usuarioId: undefined,
    };
  }

  async remove(dividaId: string) {
    // Verificar se a dívida existe
    const dividaExist = await this.prisma.divida.findUnique({
      where: { dividaId },
    });

    if (!dividaExist) {
      throw new NotFoundException('Dívida não encontrada');
    }

    // Primeiro excluir todas as parcelas associadas à dívida
    await this.prisma.parcelas.deleteMany({
      where: {
        dividaId,
      },
    });

    // Depois excluir a dívida
    const result = await this.prisma.divida.delete({
      where: {
        dividaId,
      },
    });

    return {
      dividaId: result.dividaId,
    };
  }
}
