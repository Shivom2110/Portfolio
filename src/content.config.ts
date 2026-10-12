import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        org: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        order: z.number().default(0),
        repoUrl: z.string().url().optional(),
        image: z.string().optional(),
    }),
});

export const collections = { projects };
