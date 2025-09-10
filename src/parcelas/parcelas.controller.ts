import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ParcelasService } from './parcelas.service';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { ParcelaResponseDto } from './dto/parcela-response.dto';

@ApiTags('Parcelas')
@Controller('api/parcelas')
@ApiBearerAuth()
export class ParcelasController {
  constructor(private readonly parcelasService: ParcelasService) {}

  @ApiParam({
    name: 'parcelaId',
    description: 'ID da parcela',
    example: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
  })
  @ApiResponse({
    status: 200,
    description: 'Parcela encontrada com sucesso',
    schema: {
      example: {
        parcelaId: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
        valorParcela: 250.5,
        dataVencimento: '2024-06-15T00:00:00.000Z',
        status: false,
        dividaId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        dataCriacao: '2024-01-15T10:30:00.000Z',
        dataAtualizacao: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Parcela não encontrada',
  })
  @Get(':parcelaId')
  findOne(@Param('parcelaId') parcelaId: string): Promise<ParcelaResponseDto> {
    return this.parcelasService.findOne(parcelaId);
  }

  @ApiParam({
    name: 'parcelaId',
    description: 'ID da parcela',
    example: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
  })
  @ApiBody({
    description: 'Dados para atualização da parcela',
    schema: {
      example: {
        valorParcela: 300.0,
        dataVencimento: '2024-07-15T00:00:00.000Z',
        status: false,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Parcela atualizada com sucesso',
    schema: {
      example: {
        parcelaId: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
        valorParcela: 300.0,
        dataVencimento: '2024-07-15T00:00:00.000Z',
        status: false,
        dividaId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        dataCriacao: '2024-01-15T10:30:00.000Z',
        dataAtualizacao: '2024-01-20T14:45:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível editar uma parcela que já foi paga',
  })
  @ApiResponse({
    status: 404,
    description: 'Parcela não encontrada',
  })
  @Put(':parcelaId')
  update(
    @Param('parcelaId') parcelaId: string,
    @Body() updateParcelaDto: UpdateParcelaDto,
  ): Promise<ParcelaResponseDto> {
    return this.parcelasService.update(parcelaId, updateParcelaDto);
  }

  @ApiParam({
    name: 'parcelaId',
    description: 'ID da parcela',
    example: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
  })
  @ApiResponse({
    status: 200,
    description: 'Parcela excluída com sucesso',
    schema: {
      example: {
        message: 'Parcela excluída com sucesso',
        parcelaId: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível excluir uma parcela que já foi paga',
  })
  @ApiResponse({
    status: 404,
    description: 'Parcela não encontrada',
  })
  @Delete(':parcelaId')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('parcelaId') parcelaId: string,
  ): Promise<{ message: string; parcelaId: string }> {
    return this.parcelasService.remove(parcelaId);
  }
}
