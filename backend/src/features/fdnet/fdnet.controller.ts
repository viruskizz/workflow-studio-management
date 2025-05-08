import { Controller, Get } from '@nestjs/common';
import { FdnetService } from './fdnet.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('fdnet')
export class FdnetController {
  constructor(private service: FdnetService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Create new project' })
  async hello() {
    return {};
  }
}
