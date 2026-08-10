import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

import { Priority, Status } from '../projects.type';
import { IsValidDateRange } from './is-valid-date-range.validator';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const statusAliases: Record<string, Status> = {
  Planning: Status.Planning,
  'In Progress': Status.InProgress,
  'On Hold': Status.OnHold,
  Completed: Status.Completed,
};

const priorityAliases: Record<string, Priority> = {
  Low: Priority.Low,
  Medium: Priority.Medium,
  High: Priority.High,
};

function normalizeValue<Value>(
  value: unknown,
  aliases: Record<string, Value>,
): unknown {
  return typeof value === 'string' ? (aliases[value] ?? value) : value;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'clientName cannot be blank' })
  clientName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'projectName cannot be blank' })
  projectName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(Object.values(Status))
  @Transform((parameters: TransformFnParams): unknown =>
    normalizeValue(parameters.value as unknown, statusAliases),
  )
  status!: Status;

  @IsIn(Object.values(Priority))
  @Transform((parameters: TransformFnParams): unknown =>
    normalizeValue(parameters.value as unknown, priorityAliases),
  )
  priority!: Priority;

  @IsDateString({ strict: true })
  @Matches(DATE_ONLY_PATTERN, { message: 'startDate must use YYYY-MM-DD' })
  startDate!: string;

  @IsDateString({ strict: true })
  @Matches(DATE_ONLY_PATTERN, { message: 'dueDate must use YYYY-MM-DD' })
  @Validate(IsValidDateRange)
  dueDate!: string;
}
