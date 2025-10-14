import { getQueryParam } from '../util';

export async function parseCoupangStoreId(rawUrl: string): Promise<string | undefined> {
  return getQueryParam(rawUrl, 'storeId');
}