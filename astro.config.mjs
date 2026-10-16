import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jes-lu.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
