import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Usuario } from './entities/usuario.entity';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Usuários')
@Controller('api/usuarios')
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @IsPublic()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Usuario),
    },
  })
  @Get(':usuarioId')
  findOne(@Param('usuarioId') usuarioId: string) {
    return this.usuariosService.findOne(usuarioId);
  }

  @Put(':usuarioId')
  update(
    @Param('usuarioId') usuarioId: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(usuarioId, updateUsuarioDto);
  }
}
