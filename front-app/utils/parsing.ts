function decodeHtmlEntity(str: string): string {
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

function getQueryParam(rawUrl: string, key: string): string | undefined {
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

async function parseBaeminStoreId(rawUrl: string): Promise<string | undefined> {
  return await fetch(rawUrl, {
    method: 'GET',
  }).then(async res => {
    const body = await res.text();

    const mMeta = /<meta\s+[^>]*name=["']redirectUrl["'][^>]*>/i.exec(body);
    if (!mMeta) return undefined;

    const mContent = /content=(["'])(.*?)\1/i.exec(mMeta[0]);
    if (!mContent) return undefined;

    const link = decodeHtmlEntity(mContent[2]);
    return getQueryParam(link, 'shopDetail_shopNo');
  }).catch(err => {
    return undefined;
  });
}

export async function parseCoupangStoreId(rawUrl: string): Promise<string | undefined> {
  return getQueryParam(rawUrl, 'storeId');
}

export async function parseStoreFromDeepLink(str: string): Promise<{
  platform: 'baemin' | 'coupang';
  storeId: string;
} | undefined> {
  const mBaemin = /\bhttps?:\/\/s\.baemin\.com\/[^\s<>"'’”)\]]*(?=$|[\s)"'”’.,!?;:>\]])/gi.exec(str);
  if (mBaemin) {
    const id = await parseBaeminStoreId(mBaemin[0]);
    if (!id) return undefined;
    return {
      platform: 'baemin',
      storeId: id,
    };
  }

  const mCoupang = /\bhttps?:\/\/web\.coupangeats\.com\/share[^\s<>"'’”)\]]*(?=$|[\s)"'”’.,!?;:>\]])/gi.exec(str);
  if (mCoupang) {
    const id = await parseCoupangStoreId(mCoupang[0]);
    if (!id) return undefined;
    return {
      platform: 'coupang',
      storeId: id,
    };
  }

  return undefined;
}