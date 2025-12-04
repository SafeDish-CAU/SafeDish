import React from 'react';
import axios from "axios";

async function api() {
  try {
    const response = await axios.get(
    "http://115.21.83.127:15557/api/store/1",
    {
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
    },
    }
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function getStore(store_id) {
  try {
    const response = await axios.get(
    `http://115.21.83.127:15557/api/store/${store_id}`,
    {
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
    },
    }
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function login() {
  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/auth/login",
    {
      "email": "leejuho2001@gmail.com",
      "password": "Blastix!"
    },
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:");//, error);
    throw error;
  }
}

async function createStore() {

  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/store",
    {
      "store_name": "만능집",
      "store_road_address": "경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)",
      "store_postal_code": "13529",
      "store_detail_address": "ㅁㅁㅁ"
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
    },
    }
    );

    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function addMenu() {

  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/menu",
    {
      "store_id": 1,
      "menu_name": "함박스테이크",
      "menu_price": 12000,
      "menu_allergies": [ 0, 1, 4, 5, 9, 15 ],
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
    },
    }
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function addOption() {
  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/option",
    {
    "menu_id": 10,
       "option_name": "버섯 추가",
       "option_price": 700,
       "option_allergies": []
   },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
                          },
    }
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function getStoreMenu(key){
    try {
    const response = await axios.get(
    `http://115.21.83.127:15557/api/menu/${key}`,
    {
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001a4cc069c752a5a2c637b068698dc6791f9f285bd82c02950f531808e5d5a6de8'
    },
    }
    );
    console.log(response.data);
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function createAccount() {
  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/owner",
    {
      "email": "leejuho2001@gmail.com",
      "password": "Blastix!"
    },
    );

    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}
getStoreMenu(4);
//addOption();

//createStore();
//createAccount();

//login();
export {getStore, getStoreMenu};