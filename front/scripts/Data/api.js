import React from 'react';
import axios from "axios";

async function api() {
  try {
    const response = await axios.get(
    "http://115.21.83.127:15557/api/store/2",
    {
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001c3026df3284f8a5285899ef3c56ed4a3402a7049c3a3d45f22cf61d283c1416d'
    },
    }
    );

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

    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function addMenu() {
  try {
    const response = await axios.post(
    "http://115.21.83.127:15557/api/store",
    {
      "store_id": 0,
      "menu_name": "string",
      "menu_price": 0,
      "menu_allergies": [ 0 ]
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001c3026df3284f8a5285899ef3c56ed4a3402a7049c3a3d45f22cf61d283c1416d'
    },
    }
    );

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
      "menu_id": 0,
      "option_id": 0,
      "option_name": "string",
      "option_price": 0
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001c3026df3284f8a5285899ef3c56ed4a3402a7049c3a3d45f22cf61d283c1416d'
    },
    }
    );

    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

async function getStoreMenu(key){
    try {
    const response = await axios.get(
    `http://115.21.83.127:15557/api/store/${key}`,
    {
    },
    {
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization':'0000000000000001c3026df3284f8a5285899ef3c56ed4a3402a7049c3a3d45f22cf61d283c1416d'
    },
    }
    );
    return response.data; // API로부터 전달받은 데이터
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
}

export {getStoreMenu};