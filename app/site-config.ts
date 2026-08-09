export function getSiteUrl(): URL | undefined {
  const configuredUrl = process.env.SITE_URL?.trim();

  if (!configuredUrl) {
    return undefined;
  }

  let siteUrl: URL;

  try {
    siteUrl = new URL(configuredUrl);
  } catch {
    throw new Error("SITE_URL must be a valid absolute URL.");
  }

  if (
    siteUrl.protocol !== "https:" ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin without credentials, a path, query, or hash.",
    );
  }

  return siteUrl;
}
