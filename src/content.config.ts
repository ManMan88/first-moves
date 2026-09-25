import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    part: z.number().int().min(0).max(6),
    order: z.number().int().min(1).max(26),
    summary: z.string(),
    needs: z.array(z.string()).optional(),
    video: z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{11}$/), title: z.string() }).optional(),
    sources: z.array(z.string()).min(1),
    firmware: z.string().optional(),
  }),
});

export const collections = { lessons };
