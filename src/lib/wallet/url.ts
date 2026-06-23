/** Resolve the public base URL for the current request (mirrors the QR route). */
export function resolveBaseUrl(req: Request): string {
  const requestUrl = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return forwardedProto && forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
}
