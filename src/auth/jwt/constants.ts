import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3600s',
};
