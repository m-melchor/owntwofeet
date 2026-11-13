import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per language (en/, later es/). The body of each file is the page's HTML,
// kept as written so the layout stays exact; a translator changes only the words.
const manuals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/manuals' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    mark: z.string(), // id prefix for the badge's curved text
    names: z.record(z.string(), z.string()), // screen id -> name shown in the tab title
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { manuals, pages };
