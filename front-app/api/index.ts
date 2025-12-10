import 'react-native-url-polyfill/auto';
import humps from 'humps';

import API_URL from './const';

export async function getStoreIdByPlatform(platform: string, platform_store_id: string): Promise<number | undefined> {
  const url = new URL(API_URL.GET_STORE_ID_BY_PLATFORM_API_URL);
  url.searchParams.append('pf_name', platform);
  url.searchParams.append('pf_sid', platform_store_id);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    const bodyJson: {
      store_id: number;
    } = await res.json();

    return bodyJson?.store_id;
  }).catch(err => {
    return undefined;
  });
}

export type GetStoreResponse = {
  id: number;
  name: string;
  menus: Array<{
    id: number;
    name: string;
    price: number;
    allergies: Array<{
      code: number;
      description: string;
    }>;
    options: Array<{
      id: number;
      name: string;
      minSelected: number;
      maxSelected: number;
      items: Array<{
        id: number;
        name: string;
        price: number;
        allergies: Array<{
          code: number;
          description: string;
        }>;
      }>;
    }>;
  }>;
};

export async function getStore(storeId: number): Promise<GetStoreResponse | undefined> {
  const url = new URL(`${API_URL.GET_STORE_API_URL}/${storeId}`);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson) as GetStoreResponse;
  }).catch(err => {
    return undefined;
  });
}

export type GetMenuResponse = {
  id: number;
  name: string;
  price: number;
  allergies: Array<{
    code: number;
    description: string;
  }>;
  options: Array<{
    id: number;
    name: string;
    minSelected: number;
    maxSelected: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      allergies: Array<{
        code: number;
        description: string;
      }>;
    }>;
  }>;
};

export async function getMenu(menuId: number): Promise<GetMenuResponse | undefined> {
  const url = new URL(`${API_URL.GET_MENU_API_URL}/${menuId}`);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson) as GetMenuResponse;
  }).catch(err => {
    return undefined;
  });
}

export type GetLocationResponse = {
  latitude: number;
  longitude: number;
};

export async function getLocation(roadAddress: string): Promise<GetLocationResponse | undefined> {
  const url = new URL(`${API_URL.GET_LOCATION_API_URL}`);
  url.searchParams.append('road_address', roadAddress);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson) as GetLocationResponse;
  }).catch(err => {
    return undefined;
  });
}

export type GetRecommendsResponse = {
  items: Array<{
    storeId: number;
    storeName: string;
    menuId: number;
    menuName: string;
  }>;
}

export async function getRecommends(userId: string, allergyMask: number): Promise<GetRecommendsResponse | undefined> {
  const url = new URL(`${API_URL.GET_RECOMMENDS_API_URL}`);
  url.searchParams.append('user_id', userId);
  url.searchParams.append('allergy_mask', `${allergyMask}`);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson) as GetRecommendsResponse;
  }).catch(err => {
    return undefined;
  });
}

export async function createUser(userId: string, latitude: number, longitude: number): Promise<void> {
  const url = new URL(`${API_URL.CREATE_USER_API_URL}`);
  const urlStr = url.toString();

  fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: userId,
      latitude: latitude,
      longitude: longitude,
    }),
  }).then((res) => {
    return undefined;
  }).catch(err => {
    return undefined;
  });
}

export async function createOrder(userId: string, menuId: number, quantity: number): Promise<void> {
  const url = new URL(`${API_URL.CREATE_ORDER_API_URL}`);
  const urlStr = url.toString();

  fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      menu_id: menuId,
      quantity: quantity,
    }),
  }).then((res) => {
    return undefined;
  }).catch(err => {
    return undefined;
  });
}