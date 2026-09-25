import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://manman88.github.io',
  base: '/first-moves',
  trailingSlash: 'always',
  integrations: [mdx()],
});
