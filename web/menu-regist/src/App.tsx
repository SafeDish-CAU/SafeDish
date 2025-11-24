import React, { useState } from 'react';
import './App.css';

const allergyItems = [
  '대두','밀','난류','우유','닭고기',
  '돼지고기','소고기','새우','오징어','메밀',
  '땅콩','조개류','참치','연어','호두',
  '아몬드','게','복숭아','토마토','참깨'
];

const preselectedAllergies = ['대두','밀','난류'];

function App() {
  const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [selected, setSelected] = useState({});
  const [resultJson, setResultJson] = useState(null);

  // 메뉴 옵션: optionName + 배열(dropdowns)
  const [menuOptions, setMenuOptions] = useState([
    { optionName: '', dropdowns: [''] }
  ]);

  const toggleAllergy = (item) => {
    setSelected(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSubmit = () => {
    const newSelected = {};
    allergyItems.forEach(item => {
      newSelected[item] = preselectedAllergies.includes(item);
    });
    setSelected(newSelected);
  };

  const handleSendAPI = async () => {
    if (!resultJson) return;
    console.log("handle", resultJson);
    try {
      const response = await fetch('http://115.21.83.127:15557/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'0000000000000001c3026df3284f8a5285899ef3c56ed4a3402a7049c3a3d45f22cf61d283c1416d'
        },
        body: JSON.stringify(resultJson)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('서버 응답:', data);
      alert('메뉴가 성공적으로 전송되었습니다!');
    } catch (error) {
      console.error('API 전송 실패:', error);
      alert('API 전송 실패: ' + error.message);
    }
  };

  const handleRegister = () => {
    const menu_allergies = allergyItems
      .filter(item => selected[item])
      .map((item, idx) => ({
        allergy_code: idx + 1,
        allergy_description: item
      }));

    const result = {
      //store_name: storeName,
      "store_id": parseInt(storeId || 0),
      "menu_name": menuName,
      "menu_price": parseInt(menuPrice || 0),
      "menu_allergies":menu_allergies.map(item => item.allergy_code),


      /*
      menu_options: menuOptions.map(opt => ({
        option_name: opt.optionName,
        option_allergies: opt.dropdowns.filter(d => d).map(a => ({ allergy_description: a }))
      }))
        */
    };

    setResultJson(result);
    handleSendAPI();
    console.log(result);
  };

  // 새 옵션 추가
  const addOption = () => {
    setMenuOptions([...menuOptions, { optionName: '', dropdowns: [''] }]);
  };

  // 옵션 이름 변경
  const handleOptionNameChange = (index, value) => {
    const newOptions = [...menuOptions];
    newOptions[index].optionName = value;
    setMenuOptions(newOptions);
  };

  // 옵션 내 드롭다운 선택 변경
  const handleDropdownChange = (optionIndex, dropdownIndex, value) => {
    const newOptions = [...menuOptions];
    newOptions[optionIndex].dropdowns[dropdownIndex] = value;
    setMenuOptions(newOptions);
  };

  // 옵션 내 드롭다운 추가
  const addDropdown = (optionIndex) => {
    const newOptions = [...menuOptions];
    newOptions[optionIndex].dropdowns.push('');
    setMenuOptions(newOptions);
  };

  return (
    <div className="container">
      <div className="wrapper" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* 왼쪽: 기존 UI */}
        <div className="left" style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center' }}>
          <h2>알러지 메뉴 등록</h2>
          <input
            placeholder="가게 이름"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <input
            placeholder="가게 ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
          <input
            placeholder="메뉴 이름"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
          <input
            placeholder="메뉴 가격"
            type="number"
            value={menuPrice}
            onChange={(e) => setMenuPrice(e.target.value)}
          />

          <button className="submit-btn" onClick={handleSubmit}>
            제출하기
          </button>

          <div className="allergy-grid">
            {allergyItems.map((item) => (
              <button
                key={item}
                className={`allergy-btn ${selected[item] ? 'selected' : ''}`}
                onClick={() => toggleAllergy(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="register-btn" onClick={handleRegister}>
            메뉴 등록
          </button>
        </div>

        {/* 오른쪽: 옵션 입력 UI */}
        <div className="right" style={{ flex: 1 }}>
          <h3>메뉴 옵션 입력</h3>
          {menuOptions.map((option, optionIndex) => (
            <div key={optionIndex} style={{ marginBottom: '15px', display:'flex', alignItems:'center' }}>
              <input
                placeholder="옵션 이름"
                value={option.optionName}
                onChange={(e) => handleOptionNameChange(optionIndex, e.target.value)}
                style={{ marginBottom: '5px', width: '70%' }}
              />
              {option.dropdowns.map((dropdownValue, dropdownIndex) => (
                <div key={dropdownIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', gap: '5px' }}>
                  <select
                    value={dropdownValue}
                    onChange={(e) => handleDropdownChange(optionIndex, dropdownIndex, e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="">알러지 선택</option>
                    {allergyItems.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <button onClick={() => addDropdown(optionIndex)}>+</button>
                </div>
              ))}
            </div>
          ))}

          <button onClick={addOption}>+ 옵션 추가</button>
        </div>
      </div>
    </div>
  );
}

export default App;



/*import React, { useState } from 'react';
import './App.css'; // 스타일링

const allergyItems = [
  '대두','밀','난류','우유','닭고기',
  '돼지고기','소고기','새우','오징어','메밀',
  '땅콩','조개류','참치','연어','호두',
  '아몬드','게','복숭아','토마토','참깨'
];

// 미리 선택할 버튼 (예시)
const preselectedAllergies = ['대두','밀','난류'];

function App() {
  const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [selected, setSelected] = useState({});
  const [resultJson, setResultJson] = useState(null);

  // 알러지 버튼 토글
  const toggleAllergy = (item) => {
    setSelected(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // 메뉴 이름 제출 → 미리 선택
  const handleSubmit = () => {
    const newSelected = {};
    allergyItems.forEach(item => {
      newSelected[item] = preselectedAllergies.includes(item);
    });
    setSelected(newSelected);
  };

   const handleSendAPI = async () => {
    if (!resultJson) return;

    try {
      const response = await fetch('http://115.21.83.127:15557/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultJson)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('서버 응답:', data);
      alert('메뉴가 성공적으로 전송되었습니다!');
    } catch (error) {
      console.error('API 전송 실패:', error);
      alert('API 전송 실패: ' + error.message);
    }
  };

  // 메뉴 등록 → JSON 생성
  const handleRegister = () => {
    const menu_allergies = allergyItems
      .filter(item => selected[item])
      .map((item, idx) => ({
        allergy_code: idx + 1, // index 기준 코드
        allergy_description: item
      }));

    const result = {
      store_name: storeName,
      store_id: storeId,
      menu_name: menuName,
      menu_price: parseInt(menuPrice || 0),
      menu_allergies
    };

    setResultJson(result);
    handleSendAPI();
    console.log(result);
  };

  return (
    <div className="container">
      <h2>알러지 메뉴 등록</h2>

      <input
        placeholder="가게 이름"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      />
      <input
        placeholder="가게 ID"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
      />
      <input
        placeholder="메뉴 이름"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />
      <input
        placeholder="메뉴 가격"
        type="number"
        value={menuPrice}
        onChange={(e) => setMenuPrice(e.target.value)}
      />

      <button className="submit-btn" onClick={handleSubmit}>
        제출하기
      </button>

      <div className="allergy-grid">
        {allergyItems.map((item) => (
          <button
            key={item}
            className={`allergy-btn ${selected[item] ? 'selected' : ''}`}
            onClick={() => toggleAllergy(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <button className="register-btn" onClick={handleRegister}>
        메뉴 등록
      </button>

      
    </div>
  );
}

export default App;*/
