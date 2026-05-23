type CookieOptions = {
  domain?: string;
  [key: string]: unknown;
};

const sharedSessionHosts = new Set(["alvaral.dev", "www.alvaral.dev"]);

export function getCookieDomain(host: string | null) {
  const hostname = host?.split(":")[0].toLowerCase();

  if (!hostname || !sharedSessionHosts.has(hostname)) {
    return undefined;
  }

  return ".alvaral.dev";
}

export function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("-auth-token");
}

export function withCookieDomain<TOptions extends CookieOptions>(
  options: TOptions,
  host: string | null
) {
  const domain = getCookieDomain(host);

  if (!domain) {
    return options;
  }

  return { ...options, domain };
}
