import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';
import { DRIZZLE, PG_POOL } from '../src/db/drizzle.provider';
import { ProjectsService } from '../src/projects/projects.service';

const project = {
  id: '7b12ea46-3bdf-4f2f-9187-0da9ae13596b',
  clientName: 'Acme Corporation',
  projectName: 'Website Redesign',
  description: null,
  status: 'in_progress' as const,
  priority: 'high' as const,
  startDate: '2026-06-01',
  dueDate: '2026-07-15',
};

describe('Projects API (e2e)', () => {
  let app: INestApplication<App>;
  const projectsService = {
    findAll: jest.fn().mockResolvedValue([project]),
    findOne: jest.fn().mockResolvedValue(project),
    create: jest.fn().mockResolvedValue(project),
    update: jest.fn().mockResolvedValue(project),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PG_POOL)
      .useValue({ end: jest.fn() })
      .overrideProvider(DRIZZLE)
      .useValue({})
      .overrideProvider(ProjectsService)
      .useValue(projectsService)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists projects', async () => {
    await request(app.getHttpServer())
      .get('/api/projects')
      .expect(200)
      .expect([project]);
  });

  it('creates a valid project', async () => {
    await request(app.getHttpServer())
      .post('/api/projects')
      .send({
        clientName: project.clientName,
        projectName: project.projectName,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate,
        dueDate: project.dueDate,
      })
      .expect(201)
      .expect(project);
  });

  it('rejects a due date earlier than the start date', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/projects')
      .send({
        clientName: project.clientName,
        projectName: project.projectName,
        status: project.status,
        priority: project.priority,
        startDate: '2026-07-15',
        dueDate: '2026-06-01',
      })
      .expect(400);
    const body = response.body as { message: string[] };

    expect(body.message).toContain('dueDate cannot be earlier than startDate');
  });

  it('rejects impossible calendar dates', async () => {
    await request(app.getHttpServer())
      .post('/api/projects')
      .send({
        clientName: project.clientName,
        projectName: project.projectName,
        status: project.status,
        priority: project.priority,
        startDate: '2026-02-31',
        dueDate: project.dueDate,
      })
      .expect(400);
  });

  it('accepts the human-readable enum values from the assessment', async () => {
    await request(app.getHttpServer())
      .post('/api/projects')
      .send({
        clientName: project.clientName,
        projectName: project.projectName,
        status: 'In Progress',
        priority: 'High',
        startDate: project.startDate,
        dueDate: project.dueDate,
      })
      .expect(201);

    expect(projectsService.create).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: 'in_progress', priority: 'high' }),
    );
  });

  it('rejects malformed project IDs', async () => {
    await request(app.getHttpServer())
      .get('/api/projects/not-a-uuid')
      .expect(400);
  });

  it('deletes a project without a response body', async () => {
    await request(app.getHttpServer())
      .delete(`/api/projects/${project.id}`)
      .expect(204)
      .expect('');
  });
});
