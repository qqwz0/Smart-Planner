import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { loadTestEnv } from './test-env';
import { PrismaService } from '../src/prisma/prisma.service';

function bodyOf<T>(res: Response): T {
  return res.body as T;
}

type AuthLoginResponse = { token: string };
type TagResponse = { id: string; name: string; userId: string };
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
type TaskResponse = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  taskTags: Array<{ tag: TagResponse }>;
};
type AnalyticsSummaryResponse = {
  total: number;
  done: number;
  byStatus: Partial<Record<TaskStatus, number>>;
};

describe('API flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  async function resetDb() {
    // same prisma instance as the app uses
    await prisma.taskTag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
  }

  async function registerAndLogin(): Promise<string> {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'user@x.com', password: '123456' })
      .expect(201);

    const loginRes: Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@x.com', password: '123456' })
      .expect(201);

    return bodyOf<AuthLoginResponse>(loginRes).token;
  }

  beforeAll(async () => {
    loadTestEnv();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await app.close(); // PrismaService onModuleDestroy will disconnect if you added it
  });

  it('creates tag -> creates task with tag -> analytics summary works', async () => {
    const token = await registerAndLogin();

    const tagRes: Response = await request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'uni' })
      .expect(201);

    const tagBody = bodyOf<TagResponse>(tagRes);
    const tagId = tagBody.id;

    const taskRes: Response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Write coursework',
        priority: 'HIGH',
        status: 'TODO',
        tagIds: [tagId],
      })
      .expect(201);

    const taskBody = bodyOf<TaskResponse>(taskRes);
    expect(taskBody.title).toBe('Write coursework');
    expect(taskBody.taskTags.length).toBe(1);
    expect(taskBody.taskTags[0].tag.id).toBe(tagId);

    const summaryRes: Response = await request(app.getHttpServer())
      .get('/analytics/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const summary = bodyOf<AnalyticsSummaryResponse>(summaryRes);
    expect(summary.total).toBe(1);
    expect(summary.byStatus.TODO).toBe(1);
  });
  it('login fails with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'x@x.com', password: '123456' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'x@x.com', password: 'WRONG' })
      .expect(401);
  });

  it('cannot register same email twice', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'dup@x.com', password: '123456' })
      .expect(201);

    // depends on your error mapping; if you return 400, keep 400
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'dup@x.com', password: '123456' })
      .expect(400);
  });

  it('tag name is unique per user', async () => {
    // user A
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(201);

    const aLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(201);

    const tokenA = bodyOf<{ token: string }>(aLogin).token;

    await request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'uni' })
      .expect(201);

    // creating same tag again for same user should fail (likely 409/400/500 right now)
    await request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'uni' })
      .expect(400); // change to 409 if you map P2002 to 409
  });

  it('user B cannot access user A task', async () => {
    // User A
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'a@x.com', password: '123456' })
      .expect(201);

    const aLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@x.com', password: '123456' })
      .expect(201);

    const tokenA = bodyOf<{ token: string }>(aLogin).token;

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Secret task' })
      .expect(201);

    const taskId = bodyOf<{ id: string }>(taskRes).id;

    // User B
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'b@x.com', password: '123456' })
      .expect(201);

    const bLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'b@x.com', password: '123456' })
      .expect(201);

    const tokenB = bodyOf<{ token: string }>(bLogin).token;

    // should be forbidden (or 404 if you hide resource existence)
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(403);
  });
});
