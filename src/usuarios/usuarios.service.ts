import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const data: Prisma.UsuariosCreateInput = {
      ...createUsuarioDto,
      senha: await bcrypt.hash(createUsuarioDto.senha, 10),
    };

    const createUsuario = await this.prisma.usuarios.create({ data });

    return {
      ...createUsuario,
      senha: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.usuarios.findUnique({
      where: { email },
    });
  }

  async findOne(usuarioId: string) {
    const usuarioExist = await this.prisma.usuarios.findUnique({
      where: { usuarioId },
      select: {
        usuarioId: true,
        nome: true,
        email: true,
      },
    });

    if (!usuarioExist) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return usuarioExist;
  }

  async update(
    usuarioId: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuarioExist = await this.prisma.usuarios.findUnique({
      where: { usuarioId },
    });

    if (!usuarioExist) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const data: Prisma.UsuariosUpdateInput = {
      ...updateUsuarioDto,
      senha: updateUsuarioDto.senha
        ? await bcrypt.hash(updateUsuarioDto.senha, 10)
        : undefined,
    };

    const updateUsuario = await this.prisma.usuarios.update({
      where: { usuarioId },
      data,
    });

    return {
      ...updateUsuario,
      senha: undefined,
    };
  }
}
