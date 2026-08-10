import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  const projectsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: projectsService }],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('delegates listing projects to the service', async () => {
    const projects = [{ id: '7b12ea46-3bdf-4f2f-9187-0da9ae13596b' }];
    projectsService.findAll.mockResolvedValue(projects);

    await expect(controller.findAll()).resolves.toEqual(projects);
    expect(projectsService.findAll).toHaveBeenCalledTimes(1);
  });
});
