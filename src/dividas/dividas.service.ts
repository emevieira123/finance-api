import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDividaDto } from './dto/create-divida.dto';

@Injectable()
export class DividasService {
  constructor(private readonly prisma: PrismaService) {}
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

  async findAll(filtro?: string) {
    if (!filtro) {
      const dividas = await this.prisma.divida.findMany({
        include: {
          parcelas: true,
        },
      });
      return dividas.map((divida) => ({
        ...divida,
        dataCriacao: divida.created_at,
        quantidadeParcelas: divida.parcelas.length,
        parcelas: undefined,
        usuarioId: undefined,
        created_at: undefined,
      }));
    }

    const dividas = await this.prisma.divida.findMany({
      where: {
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
      },
      include: {
        parcelas: true,
      },
    });

    return dividas.map((divida) => ({
      ...divida,
      dataCriacao: divida.created_at,
      quantidadeParcelas: divida.parcelas.length,
      parcelas: undefined,
      usuarioId: undefined,
      created_at: undefined,
    }));
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

  // update(dividaId: string, updateDividaDto: UpdateDividaDto) {
  //   console.log(updateDividaDto);
  //   return `This action updates a #${dividaId} divida`;
  // }

  async remove(dividaId: string) {
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
