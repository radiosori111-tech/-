import { getCollection, type CollectionEntry } from 'astro:content';
import { minutesOfDay } from './site';
import { LANGS, type Lang, type Alternate } from '../i18n/ui';

export type Article = CollectionEntry<'articles'>;

// 번역 아티클의 id는 'en/morning-light'처럼 폴더가 붙으므로 마지막 부분만 주소에 쓴다
export const articleSlug = (a: Article) => a.id.split('/').pop()!;

export const articleUrl = (a: Article) =>
  a.data.lang === 'ko' ? `/articles/${a.id}/` : `/${a.data.lang}/articles/${articleSlug(a)}/`;

// 한 언어의 아티클을 하루의 순서대로 ('언제든' 글은 뒤로)
export async function getArticles(lang: Lang = 'ko') {
  const all = await getCollection('articles', (a) => a.data.lang === lang);
  return all.sort((a, b) => (minutesOfDay(a.data.time) ?? 9999) - (minutesOfDay(b.data.time) ?? 9999));
}

const originalKey = (a: Article) => a.data.translationOf ?? articleSlug(a);

// 같은 아티클의 언어별 주소 (자기 자신 포함)
export async function articleAlternates(a: Article): Promise<Alternate[]> {
  const key = originalKey(a);
  const all = await getCollection('articles', (x) => originalKey(x) === key);
  return LANGS.flatMap((lang) => {
    const x = all.find((y) => y.data.lang === lang);
    return x ? [{ lang, href: articleUrl(x) }] : [];
  });
}
