import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { projects } from './schema';

config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({ connectionString });
const database = drizzle(pool);

const sampleProjects: (typeof projects.$inferInsert)[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    clientName: 'Acme Corporation',
    projectName: 'Corporate Website Redesign',
    description: "Redesign and modernize the company's corporate website.",
    status: 'in_progress',
    priority: 'high',
    startDate: '2026-06-01',
    dueDate: '2026-07-15',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    clientName: 'GreenLeaf Cafe',
    projectName: 'Online Ordering System',
    description: 'Develop an online ordering platform for customers.',
    status: 'planning',
    priority: 'medium',
    startDate: '2026-06-10',
    dueDate: '2026-08-01',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    clientName: 'Bright Realty',
    projectName: 'Property Listing Portal',
    description: 'Build a portal for managing property listings.',
    status: 'on_hold',
    priority: 'medium',
    startDate: '2026-05-15',
    dueDate: '2026-07-30',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    clientName: 'Nova Fitness',
    projectName: 'Mobile App MVP',
    description: 'Develop the first version of the fitness tracking app.',
    status: 'in_progress',
    priority: 'high',
    startDate: '2026-06-05',
    dueDate: '2026-08-20',
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    clientName: 'Blue Ocean Travel',
    projectName: 'Booking Platform Enhancement',
    description: 'Improve search and booking functionalities.',
    status: 'completed',
    priority: 'medium',
    startDate: '2026-04-01',
    dueDate: '2026-05-30',
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    clientName: 'TechVision Solutions',
    projectName: 'CRM Dashboard',
    description: 'Develop an internal CRM dashboard.',
    status: 'planning',
    priority: 'high',
    startDate: '2026-06-15',
    dueDate: '2026-08-15',
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    clientName: 'Urban Living',
    projectName: 'Property Management System',
    description: 'Create a platform for managing rental properties.',
    status: 'in_progress',
    priority: 'medium',
    startDate: '2026-05-20',
    dueDate: '2026-08-10',
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    clientName: 'Elite Events',
    projectName: 'Event Registration Portal',
    description: 'Develop a registration and ticketing portal.',
    status: 'planning',
    priority: 'low',
    startDate: '2026-06-20',
    dueDate: '2026-09-01',
  },
  {
    id: '00000000-0000-4000-8000-000000000009',
    clientName: 'HealthFirst Clinic',
    projectName: 'Patient Appointment System',
    description: 'Build an appointment scheduling application.',
    status: 'completed',
    priority: 'high',
    startDate: '2026-03-01',
    dueDate: '2026-05-01',
  },
  {
    id: '00000000-0000-4000-8000-000000000010',
    clientName: 'MarketPro',
    projectName: 'Marketing Campaign Dashboard',
    description: 'Track and manage digital marketing campaigns.',
    status: 'in_progress',
    priority: 'medium',
    startDate: '2026-06-01',
    dueDate: '2026-07-31',
  },
  {
    id: '00000000-0000-4000-8000-000000000011',
    clientName: 'Sunrise Education',
    projectName: 'Learning Management Portal',
    description: 'Develop a portal for students and instructors.',
    status: 'planning',
    priority: 'high',
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
  },
  {
    id: '00000000-0000-4000-8000-000000000012',
    clientName: 'FreshFarm',
    projectName: 'Inventory Management System',
    description: 'Track inventory across multiple locations.',
    status: 'on_hold',
    priority: 'low',
    startDate: '2026-05-01',
    dueDate: '2026-08-01',
  },
];

async function seed(): Promise<void> {
  await database.insert(projects).values(sampleProjects).onConflictDoNothing();
  await pool.end();
}

void seed().catch(async (error: unknown) => {
  console.error(error);
  await pool.end();
  process.exitCode = 1;
});
