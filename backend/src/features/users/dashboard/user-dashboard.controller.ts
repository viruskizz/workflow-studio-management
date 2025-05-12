import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDashboardService } from './user-dashboard.service';
import { TaskStatus } from '@backend/typeorm/task.entity';

@ApiTags('User Dashboard')
@Controller('users/:id/dashboard')
export class UserDashboardController {
  constructor(private readonly dashboardService: UserDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get user dashboard summary data' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  getDashboardSummary(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getDashboardSummary(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user task statistics' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  getTaskStats(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getTaskStats(id);
  }

  @Get('working-on')
  @ApiOperation({ summary: 'Get projects user is working on' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  getWorkingOn(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getWorkingOn(id);
  }

  @Get('working-with')
  @ApiOperation({ summary: 'Get users working with this user' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  getWorkingWith(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getWorkingWith(id);
  }

  @Get(':feature')
  @ApiOperation({ summary: 'Get specific dashboard feature data' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiParam({
    name: 'feature',
    type: 'string',
    description: 'Dashboard feature name',
  })
  getDashboardFeature(
    @Param('id', ParseIntPipe) id: number,
    @Param('feature') feature: string,
  ) {
    return this.dashboardService.getDashboardFeature(id, feature);
  }

  @Patch('tasks/:taskId/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateDto: { status: TaskStatus },
  ) {
    return this.dashboardService.updateTaskStatus(
      userId,
      taskId,
      updateDto.status,
    );
  }
}
