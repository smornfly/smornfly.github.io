import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://smornfly.github.io");
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  const staticPaths = ["/", "/writing/", "/works/", "/about/"];
  const contentPaths = [
    ...posts.map((post) => ({
      path: `/writing/${post.id}/`,
      updated: post.data.updated ?? post.data.date
    })),
    ...projects.map((project) => ({
      path: `/works/${project.id}/`,
      updated: project.data.updated ?? project.data.date
    }))
  ];

  const staticEntries = staticPaths.map(
    (path) => `  <url><loc>${escapeXml(new URL(path, base).toString())}</loc></url>`
  );
  const contentEntries = contentPaths.map(
    ({ path, updated }) =>
      `  <url><loc>${escapeXml(new URL(path, base).toString())}</loc><lastmod>${updated.toISOString().slice(0, 10)}</lastmod></url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...contentEntries].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
