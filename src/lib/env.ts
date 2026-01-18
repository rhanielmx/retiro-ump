import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  
  // App
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
  
  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parseEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: baseUrl,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error('❌ Erro nas variáveis de ambiente:', parsed.error.flatten().fieldErrors);
    throw new Error('Variáveis de ambiente inválidas');
  }

  return parsed.data;
};

export const env = parseEnv();