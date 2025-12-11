import humps from 'humps';

const API_BASE_URL = '';

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {{
 *   id: number;
 *   token: string;
 * } | undefined}
 */
export async function login(email, password) {
  const url = new URL(`${API_BASE_URL}/auth/login`);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {{
 *   id: number;
 *   token: string;
 * } | undefined}
 */
export async function createUser(email, password) {
  const url = new URL(`${API_BASE_URL}/owner`);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {number} ownerId 
 * @returns {{
 *   items: Array<{
 *     id: number;
 *     name: string;
 *     type: number;
 *     roadAddress: string;
 *     postalCode: string;
 *     detailAddress: string;   
 *   }>; 
 * } | undefined}
 */
export async function getStores(ownerId) {
  const url = new URL(`${API_BASE_URL}/store`);
  url.searchParams.append('id', ownerId);
  const urlStr = url.toString();

  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} name 
 * @param {number} type 
 * @param {string} roadAddress 
 * @param {string} postalCode 
 * @param {string} detailAddress 
 * @returns {{
 *   id: number;
 *   name: string;
 *   type: number;
 * } | undefined}
 */
export async function registerStore(token, name, type, roadAddress, postalCode, detailAddress) {
  const url = new URL(`${API_BASE_URL}/store`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      name: name,
      type: type,
      road_address: roadAddress,
      postal_code: postalCode,
      detail_address: detailAddress,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {number} storeId 
 * @returns {{
 *     id: number;
 *     name: string;
 *     type: number;
 *     menus: Array<{
 *       id: number;
 *       name: string;
 *       price: number;
 *       allergies: Array<{
 *         code: number;
 *         description: string;
 *       }>;
 *       options: Array<{
 *         id: number;
 *         name: string;
 *         minSelected: number;
 *         maxSelected: number;
 *         items: Array<{
 *           id: number;
 *           name: string;
 *           price: number;
 *           allergies: Array<{
 *             code: number;
 *             description: string;
 *           }>;
 *         }>;
 *       }>;
 *     }>;
 * } | undefined}
 */
export async function getStore(storeId) {
  const url = new URL(`${API_BASE_URL}/store/${storeId}`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} storeId 
 * @param {string} pfName 
 * @param {number} pfSid 
 * @returns 
 */
export async function registerPlatform(token, storeId, pfName, pfSid) {
  const url = new URL(`${API_BASE_URL}/platform`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      store_id: storeId,
      pf_name: pfName,
      pf_sid: pfSid,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {number} storeId 
 * @returns {{
 *   items: Array<{
 *     pfName: 'baemin' | 'coupnag';
 *     pfSid: number;
 *   }>;
 * } | undefined}
 */
export async function getPlatforms(storeId) {
  const url = new URL(`${API_BASE_URL}/platform/${storeId}`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {string} pfName 
 * @param {number} pfSid 
 * @returns {boolean | undefined}
 */
export async function deletePlatform(token, pfName, pfSid) {
  const url = new URL(`${API_BASE_URL}/platform/delete`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      pf_name: pfName,
      pf_sid: pfSid,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    return true;
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {'main' | 'option'} type 
 * @param {string} menuName 
 * @param {string} description 
 * @param {string | undefined} groupName 
 * @param {string | undefined} itemName 
 * @returns {{
 *   allergies: number[];
 * } | undefined}
 */
export async function guessAllergies(token, type, menuName, description, groupName, itemName) {
  const url = new URL(`${API_BASE_URL}/allergy/infer`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      type: type,
      menu_name: menuName,
      option_group_name: groupName,
      option_item_name: itemName,
      description: description,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} storeId 
 * @param {string} name 
 * @param {number} type 
 * @param {number} price 
 * @param {number[]} allergies 
 * @returns  {{
 *   storeId: number;
 *   id: number;
 *   name: string;
 *   type: number;
 *   price: number;
 *   allergies: Array<{
 *     code: number;
 *     description: string; 
 *   }>;
 * } | undefined}
 */
export async function registerMenu(token, storeId, name, type, price, allergies) {
  const url = new URL(`${API_BASE_URL}/menu`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      store_id: storeId,
      name: name,
      type: type,
      price: price,
      allergies: allergies,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} menuId 
 * @returns {boolean | undefined}
 */
export async function deleteMenu(token, menuId) {
  const url = new URL(`${API_BASE_URL}/menu/${menuId}/delete`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    return true;
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} menuId 
 * @param {string} name 
 * @param {number} type 
 * @param {number} price 
 * @param {number[]} allergies 
 * @returns {{
 *   id: number;
 *   name: string;
 *   type: number;
 *   price: number;
 *   allergies: Array<{
 *     code: number;
 *     description: string; 
 *   }>;
 * } | undefined}
 */
export async function editMenu(token, menuId, name, type, price, allergies) {
  const url = new URL(`${API_BASE_URL}/menu/${menuId}/edit`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      name: name,
      type: type,
      price: price,
      allergies: allergies,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} menuId 
 * @param {string} name 
 * @returns {{
 *   menuId: number;
 *   id: number;
 *   name: string;
 *   minSelected: number;
 *   maxSelected: number;
 * } | undefined}
 */
export async function registerOptionGroup(token, menuId, name) {
  const url = new URL(`${API_BASE_URL}/option`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      menu_id: menuId,
      name: name,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} groupId 
 * @param {string} name 
 * @param {number} price 
 * @param {number[]} allergies 
 * @returns {{
 *   groupId: number;
 *   id: number;
 *   name: string;
 *   price: number;
 *   allergies: Array<{
 *     code: number;
 *     description: string; 
 *   }>;
 * } | undefined}
 */
export async function registerOptionItem(token, groupId, name, price, allergies) {
  const url = new URL(`${API_BASE_URL}/option/${groupId}/item`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      name: name,
      price: price,
      allergies: allergies,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} groupId 
 * @returns {boolean | undefined}
 */
export async function deleteOptionGroup(token, groupId) {
  const url = new URL(`${API_BASE_URL}/option/${groupId}/delete`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    return true;
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} groupId 
 * @param {number} itemId 
 * @returns {boolean | undefined}
 */
export async function deleteOptionItem(token, groupId, itemId) {
  const url = new URL(`${API_BASE_URL}/option/${groupId}/item/${itemId}/delete`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  }).then(async (res) => {
    if (!res.ok) return undefined;
    return true;
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} groupId 
 * @param {string} name 
 * @param {number} minSelected 
 * @param {number} maxSelected 
 * @returns {{
 *   menuId: number;
 *   id: number;
 *   name: string;
 *   minSelected: number;
 *   maxSelected: number;
 * } | undefined}
 */
export async function editOptionGroup(token, groupId, name, minSelected, maxSelected) {
  const url = new URL(`${API_BASE_URL}/option/${groupId}/edit`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      name: name,
      min_selected: minSelected,
      max_selected: maxSelected,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}

/**
 * 
 * @param {string} token 
 * @param {number} groupId 
 * @param {number} itemId 
 * @param {string} name 
 * @param {number} price 
 * @param {number[]} allergies 
 * @returns {{
 *   groupId: number;
 *   id: number;
 *   name: string;
 *   price: number;
 *   allergies: Array<{
 *     code: number;
 *     description: string; 
 *   }>;
 * } | undefined}
 */
export async function editOptionItem(token, groupId, itemId, name, price, allergies) {
  const url = new URL(`${API_BASE_URL}/option/${groupId}/item/${itemId}/edit`);
  const urlStr = url.toString();
  return fetch(urlStr, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      name: name,
      price: price,
      allergies: allergies,
    }),
  }).then(async (res) => {
    if (!res.ok) return undefined;
    const bodyJson = await res.json();
    return humps.camelizeKeys(bodyJson);
  }).catch(err => {
    return undefined;
  });
}