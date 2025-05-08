import { Module } from '@nestjs/common';
import { FdnetController } from './fdnet.controller';
import { FdnetService } from './fdnet.service';

@Module({
  controllers: [FdnetController],
  providers: [FdnetService],
})
export class FdnetModule {}
