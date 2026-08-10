import { Test, TestingModule } from '@nestjs/testing';
import { DRIZZLE } from '../db/drizzle.provider';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const limit = jest.fn().mockResolvedValue([]);
  const where = jest.fn().mockReturnValue({ limit });
  const from = jest.fn().mockReturnValue({ where });
  const database = { select: jest.fn().mockReturnValue({ from }) };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, { provide: DRIZZLE, useValue: database }],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('can be constructed with the database dependency', () => {
    expect(service).toBeDefined();
  });

  it('returns a meaningful error when a project does not exist', async () => {
    await expect(
      service.findOne('7b12ea46-3bdf-4f2f-9187-0da9ae13596b'),
    ).rejects.toThrow(
      'Project 7b12ea46-3bdf-4f2f-9187-0da9ae13596b was not found',
    );
  });
});
