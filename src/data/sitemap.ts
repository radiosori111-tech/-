import { getCollection } from 'astro:content';
import { CATEGORIES } from '../content.config';
import { articleUrl, articleSlug, type Article } from './articles';
import { postUrl, type Post } from './blog';
import { minutesOfDay } from './site';
import { LANGS, type Lang } from '../i18n/ui';

// 사이트맵 한 줄: 지금 언어의 제목(없으면 한국어 원문)과, 언어별 주소(번역이 없으면 null)
export interface SitemapEntry {
  title: string;
  href: string;
  titleLang: Lang;
  links: { lang: Lang; href: string | null }[];
}
export interface SitemapGroup { key: string; entries: SitemapEntry[] }

function entryOf<T extends { data: { lang: Lang; title: string } }>(versions: T[], lang: Lang, url: (x: T) => string): SitemapEntry {
  const shown = versions.find((v) => v.data.lang === lang) ?? versions.find((v) => v.data.lang === 'ko')!;
  return {
    title: shown.data.title,
    href: url(shown),
    titleLang: shown.data.lang,
    links: LANGS.map((l) => {
      const v = versions.find((x) => x.data.lang === l);
      return { lang: l, href: v ? url(v) : null };
    }),
  };
}

// 아티클: 한국어 원문을 기준으로 묶고, 카테고리별로 하루의 순서대로
export async function sitemapArticles(lang: Lang): Promise<SitemapGroup[]> {
  const all = await getCollection('articles');
  const key = (a: Article) => a.data.translationOf ?? articleSlug(a);
  const originals = all
    .filter((a) => a.data.lang === 'ko')
    .sort((a, b) => (minutesOfDay(a.data.time) ?? 9999) - (minutesOfDay(b.data.time) ?? 9999));
  return CATEGORIES.map((c) => ({
    key: c,
    entries: originals
      .filter((a) => a.data.category === c)
      .map((a) => entryOf(all.filter((x) => key(x) === key(a)), lang, articleUrl)),
  })).filter((g) => g.entries.length > 0);
}

// 블로그 글에는 카테고리가 없어서, 한국어 원문 제목의 낱말로 주제를 나눈다 (위에서부터 먼저 맞는 주제)
export const BLOG_TOPICS = ['exercise', 'food', 'mind', 'habits', 'health'] as const;
export type BlogTopic = (typeof BLOG_TOPICS)[number];
const TOPIC_RULES: [BlogTopic, RegExp][] = [
  ['exercise', /러닝|운동|HIIE|뛰어|발아치|땀방울/],
  ['food', /식단|카니보어|혈당|인슐린|단식|음식|먹을|브레인포그/],
  ['mind', /감정|불안|생각은|후회|번아웃|플라시보|호흡|숨은|기억|관찰|난제/],
  ['habits', /가소성|습관|작심삼일|의지|확언|목표|성공|aMCC|변하고/],
];
export const blogTopic = (title: string): BlogTopic => TOPIC_RULES.find(([, re]) => re.test(title))?.[0] ?? 'health';

// 블로그: 주제별로, 최신 글부터
export async function sitemapPosts(lang: Lang): Promise<SitemapGroup[]> {
  const all = await getCollection('blog');
  const key = (p: Post) => p.data.translationOf ?? p.data.slug;
  const originals = all.filter((p) => p.data.lang === 'ko').sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return BLOG_TOPICS.map((topic) => ({
    key: topic,
    entries: originals
      .filter((p) => blogTopic(p.data.title) === topic)
      .map((p) => entryOf(all.filter((x) => key(x) === key(p)), lang, postUrl)),
  })).filter((g) => g.entries.length > 0);
}
