import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  /**
   * O email é usado para realizar o login do usuário
   * @example example@gmail.com
   * */
  @IsEmail()
  email: string;

  /**
   * O password é a senha usada para login
   * @example Abc@123
   * */
  @IsString()
  senha: string;
}
