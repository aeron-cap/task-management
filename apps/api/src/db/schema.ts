import { sql } from 'drizzle-orm';
import { check, date, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'in_progress',
  'on_hold',
  'completed',
]);

export const projectPriorityEnum = pgEnum('project_priority', [
  'low',
  'medium',
  'high',
]);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clientName: text('client_name').notNull(),
    projectName: text('project_name').notNull(),
    description: text('description'),
    status: projectStatusEnum('status').notNull(),
    priority: projectPriorityEnum('priority').notNull(),
    startDate: date('start_date').notNull(),
    dueDate: date('due_date').notNull(),
  },
  (table) => [
    check(
      'projects_valid_date_range',
      sql`${table.dueDate} >= ${table.startDate}`,
    ),
  ],
);
