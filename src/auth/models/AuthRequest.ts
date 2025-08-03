import { Request } from 'express';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export interface AuthRequest extends Request {
  user: Usuario;
}
