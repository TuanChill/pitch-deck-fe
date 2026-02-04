import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    // Use .optional() and provide fallback to handle localhost URLs
    NEXT_PUBLIC_API_BASE: z.string().url().optional()
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE
  }
});
