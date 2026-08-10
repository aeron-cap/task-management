import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DRIZZLE } from '../db/drizzle.provider';
import * as schema from '../db/schema';
import { projects } from '../db/schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

type Database = NodePgDatabase<typeof schema>;
type Project = typeof projects.$inferSelect;

@Injectable()
export class ProjectsService {
  constructor(@Inject(DRIZZLE) private readonly database: Database) {}

  findAll(): Promise<Project[]> {
    return this.database.select().from(projects);
  }

  async findOne(id: string): Promise<Project> {
    const [project] = await this.database
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) {
      throw new NotFoundException(`Project ${id} was not found`);
    }

    return project;
  }

  async create(project: CreateProjectDto): Promise<Project> {
    const [createdProject] = await this.database
      .insert(projects)
      .values({ ...project, description: project.description ?? null })
      .returning();

    return createdProject;
  }

  async update(id: string, project: UpdateProjectDto): Promise<Project> {
    const [updatedProject] = await this.database
      .update(projects)
      .set({ ...project, description: project.description ?? null })
      .where(eq(projects.id, id))
      .returning();

    if (!updatedProject) {
      throw new NotFoundException(`Project ${id} was not found`);
    }

    return updatedProject;
  }

  async remove(id: string): Promise<void> {
    const [deletedProject] = await this.database
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    if (!deletedProject) {
      throw new NotFoundException(`Project ${id} was not found`);
    }
  }
}
