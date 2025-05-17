import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  QueryOption,
  QueryOptionInterface,
} from '@backend/shared/decorators/query-option.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user directly' })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  findAll(@QueryOption() options: QueryOptionInterface) {
    console.log('Options:', options);
    return this.usersService.findAll(options);
  }

  @Get(':id/auth')
  @ApiOperation({ summary: 'Retrieve user auth profile' })
  getAuth(@Param('id') id: string) {
    return this.usersService.getAuth(+id);
  }

  @Put(':id/auth')
  @ApiOperation({ summary: 'Link local user and fdnet user' })
  linkAuth(@Param('id') id: string, @Body() body: any) {
    if (!body.username) {
      throw new Error('Username is required');
    }
    return this.usersService.linkAuth(+id, body.username);
  }

  @Delete(':id/auth')
  @ApiOperation({ summary: 'Remove local user and fdnet user' })
  removeAuth(@Param('id') id: string) {
    return this.usersService.removeAuth(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user profile' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
