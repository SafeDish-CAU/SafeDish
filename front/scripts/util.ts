export function decodeHtmlEntity(str: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };

  return str
    .replace(/&([a-z]+);/gi, (_, n) => (n in named ? named[n.toLowerCase()] : `&${n};`))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

export function getQueryParam(rawUrl: string, key: string): string | undefined {
  const escape = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`[?&]${escape}=([^&#]*)`, "i");
  const m = re.exec(rawUrl);
  if (!m) return undefined;

  const rawVal = m[1].replace(/\+/g, " ");
  try {
    return decodeURIComponent(rawVal);
  } catch {
    return undefined;
  }
}