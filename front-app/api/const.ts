import { API_BASE } from '@env';

const API_URL = {
  GET_STORE_ID_BY_PLATFORM_API_URL: `${API_BASE}/platform`,
  GET_STORE_API_URL: `${API_BASE}/store`,
  GET_MENU_API_URL: `${API_BASE}/menu`,
  GET_LOCATION_API_URL: `${API_BASE}/geo`,
  GET_RECOMMENDS_API_URL: `${API_BASE}/recommend`,
  CREATE_USER_API_URL: `${API_BASE}/recommend/user`,
  CREATE_ORDER_API_URL: `${API_BASE}/recommend/order`,
};

export default API_URL;