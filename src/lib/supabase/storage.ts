import {
  SUPABASE_MEDIA_BUCKET,
  getSupabaseConfig,
} from "@/lib/supabase/config";

export function getPublicMediaUrl(path: string | null | undefined) {
  if (!path) return null;

  const config = getSupabaseConfig();
  if (!config) return null;

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${config.url}/storage/v1/object/public/${SUPABASE_MEDIA_BUCKET}/${encodedPath}`;
}
