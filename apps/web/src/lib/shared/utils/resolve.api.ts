import { PUBLIC_API_BASE_URL } from '$env/static/public';

export function resolveApiUrl(pathname: string): string {
  return new URL(pathname, PUBLIC_API_BASE_URL).toString();
}