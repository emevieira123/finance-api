import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
// import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    schema: {
      default: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp.eyJzdWIiOiI0NTYyMmRlOS1lNWQzLTRhMDItYmM0ZC1hMDFmMjk4NmNhMWUiLCJlbWFpbCI6ImFkbWluQHRlc3RlLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTcwNjIyMDA5MywiZX.Iud8es4WdhDoCzhl4ziT',
      },
    },
  })
  @ApiBody({
    schema: {
      default: {
        email: 'teste@example.com',
        password: '@Example1234',
      },
    },
  })
  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.usuario);
  }
}
