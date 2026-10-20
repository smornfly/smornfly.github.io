import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}"
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.{md,mdx}"
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    role: z.string().optional(),
    status: z.enum(["进行中", "已完成", "持续迭代", "实验"]).default("进行中"),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts, projects };
