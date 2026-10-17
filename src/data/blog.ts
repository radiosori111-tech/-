import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// 최신 글이 먼저 오도록 정렬한 블로그 글
export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (post: Post) => `/blog/${post.data.slug}/`;

// 티스토리 태그는 "#태그1#태그2"처럼 한 칸에 붙어 들어온 것이 많아 낱개로 나눈다
export function postTags(post: Post) {
  const all = post.data.tags.flatMap((t) => t.split(/[#\s,]+/)).map((t) => t.trim()).filter(Boolean);
  return [...new Set(all)];
}

// 한국어 본문 기준 1분에 500자 정도로 계산한 읽는 시간
export function postMinutes(post: Post) {
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*\-\s]/g, '');
  return Math.max(1, Math.round(text.length / 500));
}
