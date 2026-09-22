import { translate } from "@/lib/catalog";
import { posterSrc, publishedMediaPoster, publishedSiteSettings } from "@/lib/publishedListings";

function mimeFromStoragePath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

export async function GET() {
  const settings = await publishedSiteSettings();
  const poster = await publishedMediaPoster(settings?.appIconMediaId ?? null);
  const href = posterSrc(poster);
  if (poster === null || href === null) {
    return new Response(null, { status: 404 });
  }

  const name = translate("ar", "header.markFallback");
  const body = {
    name,
    short_name: name,
    display: "standalone",
    start_url: "/ar",
    icons: [
      {
        src: href,
        type: mimeFromStoragePath(poster.storagePath),
        sizes: "any",
        purpose: "any",
      },
    ],
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
