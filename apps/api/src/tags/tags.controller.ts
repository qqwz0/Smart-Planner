import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { TagsService } from './tags.service';
import { IsString } from 'class-validator';

class CreateTagDto {
  @IsString() name: string;
}

@UseGuards(JwtGuard)
@Controller('tags')
export class TagsController {
  constructor(private tags: TagsService) {}

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.tags.findAll(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateTagDto) {
    return this.tags.create(user.sub, dto.name);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.tags.remove(user.sub, id);
  }
}
