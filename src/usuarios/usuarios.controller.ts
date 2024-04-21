import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('/api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get(':usuarioId')
  findOne(@Param('usuarioId') usuarioId: string) {
    return this.usuariosService.findOne(usuarioId);
  }

  @Patch(':usuarioId')
  update(
    @Param('usuarioId') usuarioId: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(usuarioId, updateUsuarioDto);
  }
}
