import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

export async function GET(context) {
  const articles = (await getCollection('articles', (a) => a.data.lang === 'ko')).map((article) => ({
    title: article.data.title,
    description: article.data.description,
    pubDate: article.data.date,
    categories: [article.data.category],
    link: `/articles/${article.id}/`,
  }));
  const posts = (await getCollection('blog', (p) => !p.data.draft && p.data.lang === 'ko')).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    categories: ['블로그'],
    link: `/blog/${post.data.slug}/`,
  }));

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: [...articles, ...posts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
    customData: '<language>ko-KR</language>',
  });
}
