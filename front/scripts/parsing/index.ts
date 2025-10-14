import { parseBaeminStoreId } from './baemin';
import { parseCoupangStoreId } from './coupang';

export async function parseStoreFromDeepLink(str: string): Promise<{
  platform: 'baemin' | 'coupang';
  store_id: string;
} | undefined> {
  const mBaemin = /\bhttps?:\/\/s\.baemin\.com\/[^\s<>"'’”)\]]*(?=$|[\s)"'”’.,!?;:>\]])/gi.exec(str);
  if (mBaemin) {
    const id = await parseBaeminStoreId(mBaemin[0]);
    if (!id) return undefined;
    return {
      platform: 'baemin',
      store_id: id,
    };
  }

  const mCoupang = /\bhttps?:\/\/web\.coupangeats\.com\/share[^\s<>"'’”)\]]*(?=$|[\s)"'”’.,!?;:>\]])/gi.exec(str);
  if (mCoupang) {
    const id = await parseCoupangStoreId(mCoupang[0]);
    if (!id) return undefined;
    return {
      platform: 'coupang',
      store_id: id,
    };
  }

  return undefined;
}