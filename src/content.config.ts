import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SCENES } from './components/comic/scenes';

// 글 머리의 4컷 만화. scene은 src/components/comic/scenes.ts의 그림 이름, image를 주면 그림 대신 그 이미지를 쓴다
const comic = z
  .object({
    title: z.string().optional(),
    panels: z
      .array(
        z.object({
          scene: z.enum(SCENES).optional(),
          image: z.string().optional(),
          alt: z.string(),
          label: z.string(),
          caption: z.string(),
          bubble: z.string().optional(),
        }),
      )
      .length(4),
  })
  .optional();

export const CATEGORIES = ['뇌과학 기초', '뇌과학 이슈', '습관 형성', '수면 · 리듬'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
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
    comic,
    // 번역 아티클은 src/content/articles/en/, ja/ 아래에 두고 translationOf에 원문 파일 이름을 적는다
    lang: z.enum(['ko', 'en', 'ja']).default('ko'),
    translationOf: z.string().optional(),
  }),
});

// 블로그 글. 티스토리에서 옮겨 온 글(scripts/tistory-import.mjs가 만든다)은 source에 원문 주소가 있고,
// 이 사이트에서 새로 쓴 글은 source가 없다.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
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
    // 언어. 번역 글은 src/content/blog/en/, ja/ 아래에 두고 translationOf에 원문(한국어) slug를 적는다
    lang: z.enum(['ko', 'en', 'ja']).default('ko'),
    translationOf: z.string().optional(),
    // true면 비공개: 글 페이지 · 목록 · 사이트맵 · RSS · 지식 지도 · 함께 읽기 어디에도 나오지 않는다 (src/data/blog.ts의 isPublished)
    draft: z.boolean().default(false),
    comic,
  }),
});

export const collections = { articles, blog };
