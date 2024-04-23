import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  /**
   * O email é usado para realizar o login do usuário
   * @example marcos.augusto@gmail.com
   * */
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  /**
   * A senha é usada para realizar o login, ela devem ter no mínimo 4 e no máximo 20 caracteres, contendo letras maiúsculas, minusculas e números
   * @example ABC@123
   * */
  @IsString()
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha informada é muito fraca',
  })
  senha: string;

  /**
   * O nome é usado para exibição no perfil
   * @example Antonio Augusto
   * */
  @IsString()
  nome: string;

  /**
   * O usuario do github é usado para exibição do avatar
   * @example fulano
   * */
  @IsString()
  usuarioGithub: string;
}
