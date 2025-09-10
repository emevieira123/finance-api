import { Module } from '@nestjs/common';
import { ParcelasController } from './parcelas.controller';
import { ParcelasService } from './parcelas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParcelasController],
  providers: [ParcelasService],
  exports: [ParcelasService],
})
export class ParcelasModule {}
