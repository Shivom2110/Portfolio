// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO(shivom): swap for the real production domain once you've picked one
  site: 'https://shivomraskar.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()]
});