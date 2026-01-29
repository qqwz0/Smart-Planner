import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.tasks.findAll(user.sub);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.tasks.findOne(user.sub, id);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateTaskDto) {
    return this.tasks.create(user.sub, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.tasks.remove(user.sub, id);
  }
}
