import { decodeHtmlEntity, getQueryParam } from '../util';

export async function parseBaeminStoreId(rawUrl: string): Promise<string | undefined> {
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