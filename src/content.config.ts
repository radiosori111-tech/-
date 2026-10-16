import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = ['뇌과학 기초', '뇌과학 이슈', '습관 형성', '수면 · 리듬'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    // 습관이 실제로 일어나는 시각. 시간과 무관한 글은 비워 두면 '언제든'으로 표시됩니다.
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    moment: z.string(),
    date: z.coerce.date(),
    readMinutes: z.number(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles };
