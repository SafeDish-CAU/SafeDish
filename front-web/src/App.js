// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SigninPage from './SigninPage';
import SignupPage from './SignupPage';
import MyPage from './MyPage';

function Home() {
  // 기본 / 페이지 (원하면 여기다 기존 로고 화면 넣어도 됨)
  return (
    <div className="App">
      <header className="App-header">
        <p>홈 페이지 입니다.</p>
      </header>
    </div>
  );
}

const mockStores = [
  {
    id: 1,
    name: '세이프디쉬 홍대점',
    roadAddress: '서울 마포구 어딘가로 123',
    detailAddress: '2층 201호',
    // businessNumber: '123-45-67890',
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 주소 */}
        <Route path="/" element={<Home />} />

        {/* /signin 주소에서 로그인 페이지 렌더 */}
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/mypage"
          element={<MyPage userName="USER" stores={mockStores} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/*
type Store = {
  name: string; // 가게명
  type: number; // 음식점 카테고리, [0, 6] - '한식', '중식', '일식', '양식', '아시안', '패스트푸드', '카페디저트'
  roadAddress: string; // 도로명주소
  postalCode: string; // 우편번호
  detailAddress: string; // 상세주소
  menus: Array<{
    name: string; // 메뉴명
    type: number; // 메뉴 카테고리 [0, 6] - '한식', '중식', '일식', '양식', '아시안', '패스트푸드', '카페디저트'
    price: number; // 가격
    allergies: number[]; // 메뉴에 기본적으로 포함되는 알레르기 유발 재료, [0, 24] - 하단 알레르기 정보 참고 
  }> ;
  options: Array<{
    name: string; // 옵션 그룹명
    minSelected: number; // 최소 선택 개수
    maxSelected: number; // 최대 선택 개수
    // minSelected = 0 인 경우, 이 옵션은 최대 선택 개수만큼 '선택'적으로 적용 가능
    // minSelected = 1 인 경우, 최대 선택 개수도 1개이고 '필수'적으로 1개를 적용 해야 함
    items: Array<{
      name: string; // 옵션명
      price: number; // 추가 금액
      allergies: number[]; // 옵션을 선택했을 때 포함되는 알레르기 유발 재료, [0, 24] - 하단 알레르기 정보 참고 
    }>;
  }>;
}

알레르기 정보
export const ALLERGY_TEXT_LIST = [
  '알류(가금류)', // 0
  '우유', // 1
  '메밀', // 2
  '땅콩', // 3
  '대두', // 4
  '밀', // 5
  '고등어', // 6
  '게', // 7
  '새우', // 8
  '돼지고기', // 9
  '복숭아', // 10
  '토마토', // 11
  '아황산류', // 12
  '호두', // 13
  '닭고기', // 14
  '쇠고기', // 15
  '오징어', // 16
  '굴', // 17
  '전복', // 18
  '홍합', // 19
  '조개류', // 20
  '잣', // 21
  '고열량·저영양', // 22
  'GMO 식품', // 23
  '고카페인', //24
];
*/