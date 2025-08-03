import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-usuario.decorator';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DividasService } from './dividas.service';
import { CreateDividaDto } from './dto/create-divida.dto';
import divida from './responses/divida';
import dividas from './responses/dividas';
import requestDivida from './responses/requestDivida';

@ApiTags('Dividas')
@Controller('api/dividas')
@ApiBearerAuth()
export class DividasController {
  constructor(private readonly dividasService: DividasService) {}

  @ApiBody({
    schema: {
      default: requestDivida,
    },
  })
  @ApiResponse({
    schema: {
      default: requestDivida,
    },
  })
  @Post()
  create(
    @Body() createDividaDto: CreateDividaDto,
    @CurrentUser() usuario: Usuario,
  ) {
    console.log(usuario);
    return this.dividasService.create(createDividaDto, usuario.usuarioId);
  }

  @ApiResponse({
    schema: {
      default: dividas,
    },
  })
  @ApiQuery({ name: 'filtro', required: false, type: String })
  @Get()
  findAll(@Query('filtro') filtro?: string) {
    return this.dividasService.findAll(filtro);
  }

  @ApiResponse({
    status: 200,
    schema: {
      default: divida,
    },
  })
  @Get(':dividaId')
  findOne(@Param('dividaId') dividaId: string) {
    return this.dividasService.findOne(dividaId);
  }

  // @Put(':dividaId')
  // update(
  //   @Param('dividaId') dividaId: string,
  //   @Body() updateDividaDto: UpdateDividaDto,
  // ) {
  //   return this.dividasService.update(dividaId, updateDividaDto);
  // }

  @ApiResponse({
    schema: {
      default: { dividaId: 'f3d1b43c-bbe9-487b-b416-012ff1cb4f34' },
    },
  })
  @Delete(':dividaId')
  remove(@Param('dividaId') dividaId: string) {
    return this.dividasService.remove(dividaId);
  }
}
