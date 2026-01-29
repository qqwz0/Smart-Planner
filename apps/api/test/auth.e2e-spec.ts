import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { loadTestEnv } from './test-env';
import { PrismaService } from '../src/prisma/prisma.service';

function bodyOf<T>(res: Response): T {
  return res.body as T;
}

type RegisterResponse = {
  token: string;
  user: { id: string; email: string; createdAt: string };
};
type LoginResponse = { token: string };

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
    await prisma.taskTag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers and returns token', async () => {
    const res: Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(201);

    const body = bodyOf<RegisterResponse>(res);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe('a@a.com');
  });

  it('logs in and returns token', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(201);

    const res: Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@a.com', password: '123456' })
      .expect(201);

    const body = bodyOf<LoginResponse>(res);
    expect(body.token).toBeDefined();
  });
});
