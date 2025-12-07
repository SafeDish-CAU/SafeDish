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
    optionGroups: Array<{
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
  // const url = new URL(`${API_URL.GET_STORE_API_URL}/${storeId}`);
  // const urlStr = url.toString();

  // return fetch(urlStr, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }).then(async (res) => {
  //   const bodyJson = await res.json();
  //   return humps.camelizeKeys(bodyJson) as GetStoreResponse;
  // }).catch(err => {
  //   return undefined;
  // });
  
  return {
    id: 1,
    name: '테스트 가게',
    menus: [
      {
        id: 101,
        name: '알레르기 없는 비빔밥',
        price: 9000,
        allergies: [],
        optionGroups: [
          {
            id: 1001,
            name: '곁들임 반찬 선택',
            minSelected: 0,
            maxSelected: 2,
            items: [
              {
                id: 2001,
                name: '계란후라이',
                price: 1000,
                allergies: [
                  { code: 1, description: '난류(계란)' },
                ],
              },
              {
                id: 2002,
                name: '김치',
                price: 500,
                allergies: [],
              },
            ],
          },
        ],
      },
      {
        id: 102,
        name: '치즈 돈까스',
        price: 11000,
        allergies: [
          { code: 2, description: '우유' },
          { code: 3, description: '밀(글루텐)' },
          { code: 4, description: '돼지고기' },
        ],
        optionGroups: [
          {
            id: 1002,
            name: '소스 선택',
            minSelected: 1,
            maxSelected: 1,
            items: [
              {
                id: 2003,
                name: '데미글라스 소스',
                price: 0,
                allergies: [
                  { code: 3, description: '밀(글루텐)' },
                ],
              },
              {
                id: 2004,
                name: '크림 소스',
                price: 500,
                allergies: [
                  { code: 2, description: '우유' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export type GetMenuResponse = {
  id: number;
  name: string;
  price: number;
  allergies: Array<{
    code: number;
    description: string;
  }>;
  optionGroups: Array<{
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
  // const url = new URL(`${API_URL.GET_MENU_API_URL}/${menuId}`);
  // const urlStr = url.toString();

  // return fetch(urlStr, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }).then(async (res) => {
  //   const bodyJson = await res.json();
  //   return humps.camelizeKeys(bodyJson) as GetMenuResponse;
  // }).catch(err => {
  //   return undefined;
  // });

  return {
    id: 1,
    name: '불고기버거 세트',
    price: 6900,
    allergies: [
      { code: 0, description: '난류' },
      { code: 1, description: '우유' },
    ],
    optionGroups: [
      {
        id: 101,
        name: '사이드 선택',
        minSelected: 1,
        maxSelected: 1,
        items: [
          {
            id: 1001,
            name: '후렌치후라이(M)',
            price: 0,
            allergies: [{ code: 2, description: '대두' }],
          },
          {
            id: 1002,
            name: '치즈스틱(2조각)',
            price: 1000,
            allergies: [
              { code: 1, description: '우유' },
              { code: 3, description: '밀' },
            ],
          },
        ],
      },
      {
        id: 102,
        name: '음료 변경',
        minSelected: 0,
        maxSelected: 2,
        items: [
          {
            id: 2001,
            name: '콜라(M)',
            price: 0,
            allergies: [],
          },
          {
            id: 2002,
            name: '제로 콜라(M)',
            price: 300,
            allergies: [],
          },
          {
            id: 2003,
            name: '오렌지 주스',
            price: 500,
            allergies: [{ code: 4, description: '오렌지' }],
          },
        ],
      },
    ],
  };
}