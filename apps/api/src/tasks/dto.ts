import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;

  @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
  @IsOptional() @IsEnum(TaskPriority) priority?: TaskPriority;

  @IsOptional() @IsISO8601() dueDate?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) tagIds?: string[];
}

export class UpdateTaskDto extends CreateTaskDto {}
