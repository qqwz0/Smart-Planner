import request, { Response } from 'supertest';
import { INestApplication } from '@nestjs/common';

export function bodyOf<T>(res: Response): T {
  return res.body as T;
}

export async function register(
  app: INestApplication,
  email: string,
  password = '123456',
) {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password })
    .expect(201);
}

export async function login(
  app: INestApplication,
  email: string,
  password = '123456',
): Promise<string> {
  const res: Response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201);

  return bodyOf<{ token: string }>(res).token;
}
