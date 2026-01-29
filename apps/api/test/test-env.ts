import * as path from 'path';
import * as dotenv from 'dotenv';

export function loadTestEnv() {
  dotenv.config({
    path: path.join(process.cwd(), '.env.test'),
    override: true,
  });
}
