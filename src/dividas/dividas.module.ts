import { Module } from '@nestjs/common';
import { DividasService } from './dividas.service';
import { DividasController } from './dividas.controller';

@Module({
  controllers: [DividasController],
  providers: [DividasService],
})
export class DividasModule {}
