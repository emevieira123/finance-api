import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DividasModule } from './dividas/dividas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParcelasModule } from './parcelas/parcelas.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    AuthModule,
    DividasModule,
    DashboardModule,
    ParcelasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
