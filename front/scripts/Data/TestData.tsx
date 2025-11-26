
export const TestData = [
  {
    id: '1',
    title: '돼지불백',
    price: 8500,
    allergy_materials: {
      대두: 2,
      돼지고기: 3,
      밀: 2,
    },
  },
  {
    id: '2',
    title: '치킨마요덮밥',
    price: 7000,
    allergy_materials: {
      우유: 2,
      밀: 1,
      대두: 2,
      난류: 1,
      닭고기: 3,
    },
  },
  {
    id: '3',
    title: '새우튀김우동',
    price: 9500,
    allergy_materials: {
      오징어: 1,
      밀: 3,
      새우: 3,
      난류: 1,
      대두: 2,
    },
  },
  {
    id: '4',
    title: '비빔냉면',
    price: 8000,
    allergy_materials: {
      난류: 1,
      대두: 2,
      메밀: 2,
      밀: 2,
      돼지고기: 1,
    },
  },
  {
    id: '5',
    title: '김치볶음밥',
    price: 7000,
    allergy_materials: {
      돼지고기: 2,
      대두: 2,
      난류: 1,
    },
  },
  {
    id: '6',
    title: '크림파스타',
    price: 11000,
    allergy_materials: {
      우유: 3,
      밀: 3,
      돼지고기: 1,
      대두: 1,
    },
  },
  {
    id: '7',
    title: '소고기국밥',
    price: 9000,
    allergy_materials: {
      소고기: 3,
      밀: 1,
      대두: 2,
    },
  },
  {
    id: '8',
    title: '닭갈비덮밥',
    price: 8500,
    allergy_materials: {
      밀: 2,
      닭고기: 3,
      대두: 2,
    },
  },
  {
    id: '9',
    title: '새우볶음밥',
    price: 8000,
    allergy_materials: {
      난류: 1,
      새우: 3,
      대두: 2,
    },
  },
  {
    id: '10',
    title: '함박스테이크',
    price: 12000,
    allergy_materials: {
      난류: 1,
      밀: 1,
      돼지고기: 3,
      소고기: 3,
      우유: 2,
      대두: 2,
    },
  },
];


export const TestData2 = {
"store_id": 3,
"store_name": "만능집",
"menus": [
 {
   "menu_id": 4,
   "menu_name": "돼지불백",
   "menu_price": 8500,
   "menu_allergies": [
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 9,
       "allergy_description": "돼지고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 2,
       "option_name": "치즈 추가",
       "option_price": 1000,
       "option_allergies": [
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     },
     {
       "option_id": 3,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     },
     {
       "option_id": 4,
       "option_name": "매운 소스 추가",
       "option_price": 300,
       "option_allergies": []
     }
   ]
 },
 {
   "menu_id": 5,
   "menu_name": "치킨마요덮밥",
   "menu_price": 7000,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 1,
       "allergy_description": "우유"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 14,
       "allergy_description": "닭고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 5,
       "option_name": "추가 닭고기",
       "option_price": 2000,
       "option_allergies": [
         {
           "allergy_code": 14,
           "allergy_description": "닭고기"
         }
       ]
     },
     {
       "option_id": 6,
       "option_name": "마요네즈 소스 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         },
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 6,
   "menu_name": "새우튀김우동",
   "menu_price": 9500,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 8,
       "allergy_description": "새우"
     },
     {
       "allergy_code": 16,
       "allergy_description": "오징어"
     }
   ],
   "menu_options": [
     {
       "option_id": 7,
       "option_name": "튀김 추가",
       "option_price": 2000,
       "option_allergies": [
         {
           "allergy_code": 8,
           "allergy_description": "새우"
         }
       ]
     },
     {
       "option_id": 8,
       "option_name": "계란 토핑",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 7,
   "menu_name": "비빔냉면",
   "menu_price": 8000,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 2,
       "allergy_description": "메밀"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 9,
       "allergy_description": "돼지고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 9,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     },
     {
       "option_id": 10,
       "option_name": "참깨소스 추가",
       "option_price": 300,
       "option_allergies": [
         {
           "allergy_code": 4,
           "allergy_description": "대두"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 8,
   "menu_name": "김치볶음밥",
   "menu_price": 7000,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 9,
       "allergy_description": "돼지고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 11,
       "option_name": "계란 프라이 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     },
     {
       "option_id": 12,
       "option_name": "치즈 토핑",
       "option_price": 1000,
       "option_allergies": [
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 9,
   "menu_name": "크림파스타",
   "menu_price": 11000,
   "menu_allergies": [
     {
       "allergy_code": 1,
       "allergy_description": "우유"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 9,
       "allergy_description": "돼지고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 13,
       "option_name": "베이컨 추가",
       "option_price": 1500,
       "option_allergies": [
         {
           "allergy_code": 9,
           "allergy_description": "돼지고기"
         }
       ]
     },
     {
       "option_id": 14,
       "option_name": "치즈 추가",
       "option_price": 1000,
       "option_allergies": [
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 10,
   "menu_name": "소고기국밥",
   "menu_price": 9000,
   "menu_allergies": [
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 15,
       "allergy_description": "쇠고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 15,
       "option_name": "추가 소고기",
       "option_price": 2000,
       "option_allergies": [
         {
           "allergy_code": 15,
           "allergy_description": "쇠고기"
         }
       ]
     },
     {
       "option_id": 16,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 11,
   "menu_name": "닭갈비덮밥",
   "menu_price": 8500,
   "menu_allergies": [
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 14,
       "allergy_description": "닭고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 17,
       "option_name": "치즈 토핑",
       "option_price": 1000,
       "option_allergies": [
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     },
     {
       "option_id": 18,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 12,
   "menu_name": "새우볶음밥",
   "menu_price": 8000,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 8,
       "allergy_description": "새우"
     }
   ],
   "menu_options": [
     {
       "option_id": 19,
       "option_name": "새우 추가",
       "option_price": 1500,
       "option_allergies": [
         {
           "allergy_code": 8,
           "allergy_description": "새우"
         }
       ]
     },
     {
       "option_id": 20,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     }
   ]
 },
 {
   "menu_id": 13,
   "menu_name": "함박스테이크",
   "menu_price": 12000,
   "menu_allergies": [
     {
       "allergy_code": 0,
       "allergy_description": "알류(가금류)"
     },
     {
       "allergy_code": 1,
       "allergy_description": "우유"
     },
     {
       "allergy_code": 4,
       "allergy_description": "대두"
     },
     {
       "allergy_code": 5,
       "allergy_description": "밀"
     },
     {
       "allergy_code": 9,
       "allergy_description": "돼지고기"
     },
     {
       "allergy_code": 15,
       "allergy_description": "쇠고기"
     }
   ],
   "menu_options": [
     {
       "option_id": 21,
       "option_name": "치즈 추가",
       "option_price": 1000,
       "option_allergies": [
         {
           "allergy_code": 1,
           "allergy_description": "우유"
         }
       ]
     },
     {
       "option_id": 22,
       "option_name": "계란 추가",
       "option_price": 500,
       "option_allergies": [
         {
           "allergy_code": 0,
           "allergy_description": "알류(가금류)"
         }
       ]
     },
     {
       "option_id": 23,
       "option_name": "버섯 추가",
       "option_price": 700,
       "option_allergies": []
     }
   ]
 }
]
}





export const TestUserData =[
  {
    uid: 2021130612321,
    name: '푸앙이',
    allergy_materials: [
      '난류',
      '소고기',
    ],
  }
];



export const TestUserDataObject = () => {

  const UserData =
    {
      uid: 2021130612321,
          name: '푸앙이',
          allergy_materials: [
            '난류',
            '소고기',
      ],
    };

  const getComponent =()=>{
        return UserData;
  }

  const allergySetter =(option, tag)=> {
    if(option == 'add') addTag(tag);
    else if(option == 'remove')removeTag(tag);
    }

  const addTag=(tag) =>{
    if(UserData.allergy_materials.includes(tag)) {
        console.log ('UserDataError : allergyList already includes :: ', tag);
    } else UserData.allergy_materials.push(tag)
  }

  const removeTag=(tag) =>{
    if(!UserData.allergy_materials.includes(tag)){
        console.log('UserDataError : allergyList already does not includes :: ', tag);
    }else {
        const idx = UserData.allergy_materials.findIndex(item => item == tag);
        UserData.allergy_materials.splice(idx, 1);
        }
  }
  return {getComponent, allergySetter};
};