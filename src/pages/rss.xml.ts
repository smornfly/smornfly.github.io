import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../data/site";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site: configuredSite }) => {
  const base = configuredSite ?? new URL(site.url);
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const items = posts.map((post) => {
    const url = new URL(`/writing/${post.id}/`, base).toString();
    return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <description>${escapeXml(post.data.description)}</description>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
</item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(site.title)}</title>
  <description>${escapeXml(site.description)}</description>
  <link>${escapeXml(base.toString())}</link>
  <language>zh-CN</language>
  ${items.join("\n  ")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
};
