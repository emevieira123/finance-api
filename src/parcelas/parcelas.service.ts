import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { ParcelaResponseDto } from './dto/parcela-response.dto';

@Injectable()
export class ParcelasService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(parcelaId: string): Promise<ParcelaResponseDto> {
    const parcela = await this.prisma.parcelas.findUnique({
      where: { parcelaId },
      include: {
        divida: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!parcela) {
      throw new NotFoundException('Parcela não encontrada');
    }

    return {
      parcelaId: parcela.parcelaId,
      valorParcela: Number(parcela.valorParcela),
      dataVencimento: parcela.dataVencimento,
      status: parcela.status,
      dividaId: parcela.dividaId,
      dataCriacao: parcela.created_at,
      dataAtualizacao: parcela.updated_at,
    };
  }

  async update(
    parcelaId: string,
    updateParcelaDto: UpdateParcelaDto,
  ): Promise<ParcelaResponseDto> {
    // Verificar se a parcela existe
    const parcelaExist = await this.prisma.parcelas.findUnique({
      where: { parcelaId },
    });

    if (!parcelaExist) {
      throw new NotFoundException('Parcela não encontrada');
    }

    // Verificar se a parcela não está paga (status = true)
    if (parcelaExist.status === true) {
      throw new BadRequestException(
        'Não é possível editar uma parcela que já foi paga',
      );
    }

    // Atualizar a parcela
    const updatedParcela = await this.prisma.parcelas.update({
      where: { parcelaId },
      data: {
        ...updateParcelaDto,
        dataVencimento: updateParcelaDto.dataVencimento
          ? new Date(updateParcelaDto.dataVencimento)
          : undefined,
        updated_at: new Date(),
      },
    });

    return {
      parcelaId: updatedParcela.parcelaId,
      valorParcela: Number(updatedParcela.valorParcela),
      dataVencimento: updatedParcela.dataVencimento,
      status: updatedParcela.status,
      dividaId: updatedParcela.dividaId,
      dataCriacao: updatedParcela.created_at,
      dataAtualizacao: updatedParcela.updated_at,
    };
  }

  async remove(
    parcelaId: string,
  ): Promise<{ message: string; parcelaId: string }> {
    // Verificar se a parcela existe
    const parcelaExist = await this.prisma.parcelas.findUnique({
      where: { parcelaId },
    });

    if (!parcelaExist) {
      throw new NotFoundException('Parcela não encontrada');
    }

    // Verificar se a parcela não está paga (status = true)
    if (parcelaExist.status === true) {
      throw new BadRequestException(
        'Não é possível excluir uma parcela que já foi paga',
      );
    }

    // Excluir a parcela
    await this.prisma.parcelas.delete({
      where: { parcelaId },
    });

    return {
      message: 'Parcela excluída com sucesso',
      parcelaId,
    };
  }
}
