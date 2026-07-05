const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function resolveAssetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${apiUrl}${path}`;
}
