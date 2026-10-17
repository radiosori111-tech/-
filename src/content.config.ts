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

// 블로그 글. 티스토리에서 옮겨 온 글(scripts/tistory-import.mjs가 만든다)은 source에 원문 주소가 있고,
// 이 사이트에서 새로 쓴 글은 source가 없다.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    source: z.string().url().optional(),
  }),
});

export const collections = { articles, blog };
