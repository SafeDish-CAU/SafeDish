import API_URL from './const';

export async function getStoreIdByPlatform(platform: string, platform_store_id: string): Promise<string | undefined> {
  return fetch(API_URL.GET_STORE_ID_BY_PLATFORM_API_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ platform, platform_store_id }),
  }).then(res => {
    return '';
  }).catch(err => {
    return undefined;
  });
}