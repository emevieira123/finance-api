import { Usuario } from '../entities/usuario.entity';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto extends Usuario {
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha informada é muito fraca',
  })
  senha: string;

  @IsString()
  nome: string;

  @IsString()
  usuarioGithub: string;
}
