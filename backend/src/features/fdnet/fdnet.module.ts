import { Module } from '@nestjs/common';
import { FdnetController } from './fdnet.controller';
import { FdnetService } from './fdnet.service';
import { Auth } from '@backend/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [FdnetController],
  providers: [FdnetService],
  exports: [FdnetService],
})
export class FdnetModule {}
