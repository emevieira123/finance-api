import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioPayload } from './models/UsuarioPayload';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuarioToken } from './models/UsuarioToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(usuario: Usuario): Promise<UsuarioToken> {
    const payload: UsuarioPayload = {
      sub: usuario.usuarioId,
      email: usuario.email,
      nome: usuario.nome,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const usuario = await this.usuariosService.findByEmail(email);

    if (usuario) {
      const isPasswordValid = await bcrypt.compare(password, usuario.senha);

      if (isPasswordValid) {
        return {
          ...usuario,
          senha: undefined,
        };
      }
    }

    throw new Error('Email ou senha é inválido');
  }
}
