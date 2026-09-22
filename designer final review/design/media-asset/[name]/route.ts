import { fetchAnonStorageObject } from "@/lib/supabaseRest";

const OBJECT_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpeg|jpg|png|webp)$/i;

type Props = { params: Promise<{ name: string }> };

export async function GET(_request: Request, context: Props) {
  const { name } = await context.params;
  if (!OBJECT_NAME.test(name)) {
    return new Response(null, { status: 404 });
  }

  const upstream = await fetchAnonStorageObject("media-asset", name);
  if (upstream === null) {
    return new Response(null, { status: 404 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
