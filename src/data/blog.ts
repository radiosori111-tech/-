import { getCollection, type CollectionEntry } from 'astro:content';
import { blogPath, LANGS, type Lang, type Alternate } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

// 한 언어의 블로그 글을 최신순으로
export async function getPosts(lang: Lang = 'ko') {
  const posts = await getCollection('blog', (p) => p.data.lang === lang);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (post: Post) => `${blogPath(post.data.lang)}${post.data.slug}/`;

// 원문(한국어) 글의 slug. 번역 글은 translationOf로 원문을 가리킨다
const originalSlug = (post: Post) => post.data.translationOf ?? post.data.slug;

// 같은 글의 언어별 주소 (자기 자신 포함, 한국어 · 영어 · 일본어 순)
export async function postAlternates(post: Post): Promise<Alternate[]> {
  const key = originalSlug(post);
  const all = await getCollection('blog', (p) => originalSlug(p) === key);
  return LANGS.flatMap((lang) => {
    const p = all.find((x) => x.data.lang === lang);
    return p ? [{ lang, href: postUrl(p) }] : [];
  });
}

// 블로그 목록의 언어별 주소
export const listAlternates: Alternate[] = LANGS.map((lang) => ({ lang, href: blogPath(lang) }));

// 티스토리 태그는 "#태그1#태그2"처럼 한 칸에 붙어 들어온 것이 많아 낱개로 나눈다
export function postTags(post: Post) {
  const all = post.data.tags.flatMap((t) => t.split(/[#\s,]+/)).map((t) => t.trim()).filter(Boolean);
  return [...new Set(all)];
}

// 읽는 시간: 한국어 1분에 500자, 일본어 600자, 영어 230단어 정도로 계산
export function postMinutes(post: Post) {
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*|]/g, '');
  const n =
    post.data.lang === 'en' ? text.split(/\s+/).filter(Boolean).length / 230
    : text.replace(/[\s-]/g, '').length / (post.data.lang === 'ja' ? 600 : 500);
  return Math.max(1, Math.round(n));
}
