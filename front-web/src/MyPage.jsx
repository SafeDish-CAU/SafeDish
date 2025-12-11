import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Postcode from '@actbase/react-daum-postcode';
import './MyPage.css';
import {
  getStores,
  registerStore,
  getStore,
  registerPlatform,
  getPlatforms,
  deletePlatform,
  guessAllergies,
  registerMenu,
  deleteMenu,
  editMenu,
  registerOptionGroup,
  registerOptionItem,
} from './api';
import safedishLogo from './assets/safedish_logo.png';

// 간단한 쿠키 파서
function getCookie(name) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : undefined;
}

const STORE_TYPE_LABELS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '아시안',
  '패스트푸드',
  '카페디저트',
];

// 알레르기 목록 (0~24)
const ALLERGY_TEXT_LIST = [
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
  '고카페인', // 24
];

function MyPage() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 'store' = 가게/메뉴 보기, 'createStore' = 가게 등록 화면
  const [viewMode, setViewMode] = useState('store');

  // 오른쪽 상세 패널 모드: 'basic' = 기본 정보, 'menu' = 메뉴 정보, 'createMenu' = 메뉴 등록
  const [detailMode, setDetailMode] = useState(null);

  // 가게 상세 정보 (getStore)
  const [storeDetail, setStoreDetail] = useState(null);
  const [storeDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetailError, setStoreDetailError] = useState('');

  // 플랫폼 리스트
  const [platforms, setPlatforms] = useState([]);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [platformsError, setPlatformsError] = useState('');

  const [newPlatformName, setNewPlatformName] = useState('baemin');
  const [newPlatformSid, setNewPlatformSid] = useState('');

  // 새 가게 등록용 상태
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreType, setNewStoreType] = useState(0);
  const [newRoadAddress, setNewRoadAddress] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newDetailAddress, setNewDetailAddress] = useState('');

  // Kakao postcode 모달 on/off (가게 등록용)
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 새 메뉴 등록용 상태 (1 = 기본 정보, 2 = 알레르기/카테고리/가격)
  const [createMenuStep, setCreateMenuStep] = useState(1);
  const [createMenuName, setCreateMenuName] = useState('');
  const [createMenuType, setCreateMenuType] = useState(0);
  const [createMenuDescription, setCreateMenuDescription] = useState('');
  const [createMenuPrice, setCreateMenuPrice] = useState('');
  const [createMenuAllergies, setCreateMenuAllergies] = useState([]); // number[]
  const [guessLoading, setGuessLoading] = useState(false);
  const [guessError, setGuessError] = useState('');
  const [registerMenuLoading, setRegisterMenuLoading] = useState(false);

  // 메뉴 수정 상태
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuType, setEditMenuType] = useState(0);
  const [editMenuPrice, setEditMenuPrice] = useState('');
  const [editMenuAllergies, setEditMenuAllergies] = useState([]); // number[]
  const [editMenuLoading, setEditMenuLoading] = useState(false);

  // 옵션 그룹 추가 상태
  const [newOptionGroupName, setNewOptionGroupName] = useState('');
  const [optionGroupLoading, setOptionGroupLoading] = useState(false);
  const [optionGroupError, setOptionGroupError] = useState('');

  // 옵션 아이템 추가 상태 (2단계 + 알레르기 추론)
  const [activeOptionGroupId, setActiveOptionGroupId] = useState(null); // 현재 옵션 아이템 추가 중인 그룹 ID
  const [createOptionItemStep, setCreateOptionItemStep] = useState(1); // 1 = 기본 정보, 2 = 알레르기/가격
  const [createOptionItemName, setCreateOptionItemName] = useState('');
  const [createOptionItemDescription, setCreateOptionItemDescription] =
    useState('');
  const [createOptionItemPrice, setCreateOptionItemPrice] = useState('');
  const [createOptionItemAllergies, setCreateOptionItemAllergies] = useState(
    [],
  ); // number[]
  const [optionGuessLoading, setOptionGuessLoading] = useState(false);
  const [optionGuessError, setOptionGuessError] = useState('');
  const [registerOptionItemLoading, setRegisterOptionItemLoading] =
    useState(false);

  const resetOptionItemForm = () => {
    setActiveOptionGroupId(null);
    setCreateOptionItemStep(1);
    setCreateOptionItemName('');
    setCreateOptionItemDescription('');
    setCreateOptionItemPrice('');
    setCreateOptionItemAllergies([]);
    setOptionGuessError('');
    setOptionGuessLoading(false);
    setRegisterOptionItemLoading(false);
  };

  // 가게 목록 조회
  useEffect(() => {
    const userIdCookie = getCookie('sd_user_id');

    if (!userIdCookie) {
      setError('로그인이 필요합니다. 로그인 페이지로 이동해 주세요.');
      return;
    }

    const ownerId = Number(userIdCookie);
    if (Number.isNaN(ownerId)) {
      setError('잘못된 사용자 정보입니다. 다시 로그인해 주세요.');
      return;
    }

    setLoading(true);
    getStores(ownerId)
      .then(result => {
        if (!result || !Array.isArray(result.items)) {
          setError('가게 정보를 불러오지 못했습니다.');
          return;
        }

        setStores(result.items);
        if (result.items.length > 0) {
          setSelectedStoreId(result.items[0].id);
          setDetailMode('basic');
        }
      })
      .catch(() => {
        setError('가게 정보를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  // 선택된 가게의 상세 정보 조회 (메뉴 리스트 등)
  useEffect(() => {
    if (viewMode !== 'store' || !selectedStoreId) {
      setStoreDetail(null);
      setStoreDetailLoading(false);
      setStoreDetailError('');
      return;
    }

    setStoreDetailLoading(true);
    setStoreDetailError('');

    getStore(selectedStoreId)
      .then(result => {
        if (!result) {
          setStoreDetailError('가게 상세 정보를 불러오지 못했습니다.');
          setStoreDetail(null);
          return;
        }
        setStoreDetail(result);
      })
      .catch(() => {
        setStoreDetailError('가게 상세 정보를 불러오지 못했습니다.');
        setStoreDetail(null);
      })
      .finally(() => setStoreDetailLoading(false));
  }, [viewMode, selectedStoreId]);

  // 선택된 가게의 플랫폼 리스트 조회
  useEffect(() => {
    if (viewMode !== 'store' || !selectedStoreId) {
      setPlatforms([]);
      setPlatformsLoading(false);
      setPlatformsError('');
      return;
    }

    setPlatformsLoading(true);
    setPlatformsError('');

    getPlatforms(selectedStoreId)
      .then(result => {
        if (!result || !Array.isArray(result.items)) {
          setPlatformsError('플랫폼 정보를 불러오지 못했습니다.');
          setPlatforms([]);
          return;
        }
        setPlatforms(result.items);
      })
      .catch(() => {
        setPlatformsError('플랫폼 정보를 불러오지 못했습니다.');
        setPlatforms([]);
      })
      .finally(() => setPlatformsLoading(false));
  }, [viewMode, selectedStoreId]);

  const handleStoreClick = storeId => {
    setViewMode('store');
    setSelectedStoreId(storeId);
    setSelectedMenuId(null);
    setDetailMode('basic');
    setIsEditingMenu(false);
    resetOptionItemForm();
  };

  // 추가 가게 등록 버튼 클릭 → 가게 등록 모드
  const handleAddStore = () => {
    setViewMode('createStore');
    setSelectedStoreId(null);
    setSelectedMenuId(null);
    setDetailMode(null);
    setIsEditingMenu(false);
    resetOptionItemForm();
  };

  // 가게 등록 제출
  const handleSubmitNewStore = async e => {
    e.preventDefault();

    if (!newStoreName || !newRoadAddress || !newPostalCode) {
      alert('가게명, 도로명 주소, 우편번호는 필수입니다.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    const result = await registerStore(
      token,
      newStoreName,
      newStoreType,
      newRoadAddress,
      newPostalCode,
      newDetailAddress,
    );

    if (!result) {
      alert('가게 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const newStore = {
      id: result.id,
      name: result.name,
      type: result.type,
      roadAddress: newRoadAddress,
      postalCode: newPostalCode,
      detailAddress: newDetailAddress,
    };

    // 좌측 가게 리스트에 추가
    setStores(prev => [...prev, newStore]);

    // 방금 등록한 가게 선택 + 기본 정보 모드
    setViewMode('store');
    setSelectedStoreId(result.id);
    setSelectedMenuId(null);
    setDetailMode('basic');

    // 폼 초기화
    setNewStoreName('');
    setNewRoadAddress('');
    setNewPostalCode('');
    setNewDetailAddress('');
    setNewStoreType(0);
  };

  // 플랫폼 등록 제출
  const handleSubmitPlatform = async e => {
    e.preventDefault();

    if (!selectedStoreId) {
      alert('먼저 가게를 선택해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    const sidNum = Number(newPlatformSid);
    if (!newPlatformSid || Number.isNaN(sidNum) || sidNum <= 0) {
      alert('플랫폼 가게 ID를 올바르게 입력해 주세요.');
      return;
    }

    const result = await registerPlatform(
      token,
      selectedStoreId,
      newPlatformName,
      sidNum,
    );

    if (!result) {
      alert('플랫폼 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const added = {
      pfName: result.pfName || newPlatformName,
      pfSid: result.pfSid || sidNum,
    };

    setPlatforms(prev => {
      const filtered = prev.filter(
        p => !(p.pfName === added.pfName && p.pfSid === added.pfSid),
      );
      return [...filtered, added];
    });

    setNewPlatformSid('');
  };

  // 플랫폼 삭제
  const handleDeletePlatform = async (pfName, pfSid) => {
    if (!window.confirm('해당 플랫폼 연결을 삭제하시겠습니까?')) return;

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    const ok = await deletePlatform(token, pfName, pfSid);
    if (!ok) {
      alert('플랫폼 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setPlatforms(prev =>
      prev.filter(p => !(p.pfName === pfName && p.pfSid === pfSid)),
    );
  };

  // 카카오 우편번호 콜백 (가게 등록용)
  const handlePostcodeSelected = data => {
    const roadAddr = data.roadAddress || data.address || '';
    setNewRoadAddress(roadAddr);
    setNewPostalCode(data.zonecode || '');
    setIsPostcodeOpen(false);
  };

  // 메뉴 추가 선택
  const handleSelectCreateMenu = () => {
    // 현재 선택된 가게의 type을 기본 메뉴 카테고리로 사용
    const store = stores.find(s => s.id === selectedStoreId);
    const baseType =
      storeDetail && typeof storeDetail.type === 'number'
        ? storeDetail.type
        : store && typeof store.type === 'number'
          ? store.type
          : 0; // 둘 다 없으면 0으로 fallback

    setDetailMode('createMenu');
    setSelectedMenuId(null);
    setCreateMenuStep(1);
    setCreateMenuName('');
    setCreateMenuType(baseType); // 가게 카테고리를 기본값으로
    setCreateMenuDescription('');
    setCreateMenuPrice('');
    setCreateMenuAllergies([]);
    setGuessError('');
    setGuessLoading(false);
    setRegisterMenuLoading(false);
    setIsEditingMenu(false);
    resetOptionItemForm();
  };

  // 알레르기 추론(다음 버튼) — 음식 종류(카테고리)는 사용 X
  const handleGuessAllergies = async e => {
    e.preventDefault();
    if (!createMenuName) {
      setGuessError('메뉴명을 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setGuessLoading(true);
    setGuessError('');

    const result = await guessAllergies(
      token,
      'main',
      createMenuName,
      createMenuDescription || '',
      undefined,
      undefined,
    );

    if (!result || !Array.isArray(result.allergies)) {
      setGuessError(
        '알레르기 분석에 실패했습니다. 직접 선택해서 등록해 주세요.',
      );
      setCreateMenuAllergies([]);
    } else {
      const validCodes = result.allergies
        .map(n => Number(n))
        .filter(
          code =>
            Number.isInteger(code) &&
            code >= 0 &&
            code < ALLERGY_TEXT_LIST.length,
        );
      setCreateMenuAllergies(validCodes);
    }

    setGuessLoading(false);
    setCreateMenuStep(2);
  };

  // 알레르기 토글 (생성용)
  const toggleCreateAllergy = code => {
    setCreateMenuAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };

  // 메뉴 등록
  const handleRegisterMenu = async e => {
    e.preventDefault();
    if (!selectedStoreId) {
      alert('먼저 가게를 선택해 주세요.');
      return;
    }

    if (!createMenuName) {
      alert('메뉴명을 입력해 주세요.');
      return;
    }

    const priceNum = Number(createMenuPrice);
    if (!createMenuPrice || Number.isNaN(priceNum) || priceNum <= 0) {
      alert('가격을 올바르게 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setRegisterMenuLoading(true);

    const result = await registerMenu(
      token,
      selectedStoreId,
      createMenuName,
      createMenuType,
      priceNum,
      createMenuAllergies,
    );

    if (!result) {
      setRegisterMenuLoading(false);
      alert('메뉴 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    // 메뉴 목록 갱신
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }

    // 방금 등록한 메뉴 선택
    if (result.id) {
      setSelectedMenuId(result.id);
      setDetailMode('menu');
    } else {
      setDetailMode('menu');
    }

    setRegisterMenuLoading(false);
    setIsEditingMenu(false);
    resetOptionItemForm();
  };

  // 알레르기 토글 (수정용)
  const toggleEditAllergy = code => {
    setEditMenuAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };

  // 메뉴 수정 시작
  const handleStartEditMenu = () => {
    if (!storeDetail || !storeDetail.menus || selectedMenuId == null) return;
    const menu = storeDetail.menus.find(m => m.id === selectedMenuId);
    if (!menu) return;

    setEditMenuName(menu.name || '');
    const mType =
      typeof menu.type === 'number' && STORE_TYPE_LABELS[menu.type]
        ? menu.type
        : 0;
    setEditMenuType(mType);

    const rawPrice =
      typeof menu.price === 'number' ? menu.price : Number(menu.price);
    setEditMenuPrice(
      rawPrice != null && !Number.isNaN(rawPrice) ? String(rawPrice) : '',
    );

    const codes = (menu.allergies || [])
      .map(a => Number(a.code))
      .filter(
        code =>
          Number.isInteger(code) &&
          code >= 0 &&
          code < ALLERGY_TEXT_LIST.length,
      );
    setEditMenuAllergies(codes);

    setIsEditingMenu(true);
  };

  // 메뉴 수정 취소
  const handleCancelEditMenu = () => {
    setIsEditingMenu(false);
  };

  // 메뉴 수정 적용
  const handleApplyEditMenu = async () => {
    if (!selectedMenuId) {
      alert('선택된 메뉴가 없습니다.');
      return;
    }

    if (!editMenuName) {
      alert('메뉴명을 입력해 주세요.');
      return;
    }

    const priceNum = Number(editMenuPrice);
    if (!editMenuPrice || Number.isNaN(priceNum) || priceNum <= 0) {
      alert('가격을 올바르게 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setEditMenuLoading(true);

    const result = await editMenu(
      token,
      selectedMenuId,
      editMenuName,
      editMenuType,
      priceNum,
      editMenuAllergies,
    );

    if (!result) {
      setEditMenuLoading(false);
      alert('메뉴 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    // 최신 메뉴 정보로 새로고침
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }

    setEditMenuLoading(false);
    setIsEditingMenu(false);
  };

  // 메뉴 삭제
  const handleDeleteMenuClick = async () => {
    if (!selectedMenuId) return;
    if (!window.confirm('해당 메뉴를 삭제하시겠습니까?')) return;

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    const ok = await deleteMenu(token, selectedMenuId);
    if (!ok) {
      alert('메뉴 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }

    setSelectedMenuId(null);
    setIsEditingMenu(false);
    resetOptionItemForm();
  };

  // 옵션 그룹 생성
  const handleCreateOptionGroup = async e => {
    e.preventDefault();

    if (!selectedMenuId) {
      alert('먼저 메뉴를 선택해 주세요.');
      return;
    }

    if (!newOptionGroupName.trim()) {
      setOptionGroupError('옵션 그룹명을 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setOptionGroupLoading(true);
    setOptionGroupError('');

    const result = await registerOptionGroup(
      token,
      selectedMenuId,
      newOptionGroupName.trim(),
    );

    if (!result) {
      setOptionGroupError(
        '옵션 그룹 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
      setOptionGroupLoading(false);
      return;
    }

    // 옵션 그룹이 추가된 최신 메뉴 정보로 새로고침
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }

    setNewOptionGroupName('');
    setOptionGroupLoading(false);
  };

  // 옵션 아이템 추가 폼 열기/닫기
  const handleOpenCreateOptionItem = groupId => {
    if (activeOptionGroupId === groupId) {
      // 이미 열려 있으면 닫기
      resetOptionItemForm();
      return;
    }

    setActiveOptionGroupId(groupId);
    setCreateOptionItemStep(1);
    setCreateOptionItemName('');
    setCreateOptionItemDescription('');
    setCreateOptionItemPrice('');
    setCreateOptionItemAllergies([]);
    setOptionGuessError('');
    setOptionGuessLoading(false);
    setRegisterOptionItemLoading(false);
  };

  // 옵션 아이템 알레르기 추론
  const handleGuessOptionItemAllergies = async optionGroup => {
    if (!createOptionItemName.trim()) {
      setOptionGuessError('옵션명을 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setOptionGuessLoading(true);
    setOptionGuessError('');

    const selectedMenu =
      storeDetail &&
      storeDetail.menus &&
      selectedMenuId != null
        ? storeDetail.menus.find(m => m.id === selectedMenuId)
        : null;

    const menuName = selectedMenu ? selectedMenu.name : '';

    const result = await guessAllergies(
      token,
      'option',
      menuName,
      createOptionItemDescription || '',
      optionGroup.name,
      createOptionItemName,
    );

    if (!result || !Array.isArray(result.allergies)) {
      setOptionGuessError(
        '알레르기 분석에 실패했습니다. 직접 선택해 주세요.',
      );
      setCreateOptionItemAllergies([]);
    } else {
      const validCodes = result.allergies
        .map(n => Number(n))
        .filter(
          code =>
            Number.isInteger(code) &&
            code >= 0 &&
            code < ALLERGY_TEXT_LIST.length,
        );
      setCreateOptionItemAllergies(validCodes);
    }

    setOptionGuessLoading(false);
    setCreateOptionItemStep(2);
  };

  // 옵션 아이템 알레르기 토글
  const toggleCreateOptionItemAllergy = code => {
    setCreateOptionItemAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };

  // 옵션 아이템 등록
  const handleRegisterOptionItemClick = async optionGroup => {
    if (!createOptionItemName.trim()) {
      alert('옵션명을 입력해 주세요.');
      return;
    }

    const priceNum = Number(createOptionItemPrice);
    if (!createOptionItemPrice || Number.isNaN(priceNum) || priceNum < 0) {
      alert('옵션 가격을 올바르게 입력해 주세요.');
      return;
    }

    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }

    setRegisterOptionItemLoading(true);

    const result = await registerOptionItem(
      token,
      optionGroup.id,
      createOptionItemName.trim(),
      priceNum,
      createOptionItemAllergies,
    );

    if (!result) {
      setRegisterOptionItemLoading(false);
      alert('옵션 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    // 최신 옵션 정보로 새로고침
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }

    setRegisterOptionItemLoading(false);
    resetOptionItemForm();
  };

  const selectedStore =
    stores.find(s => s.id === selectedStoreId) || null;

  const selectedMenu =
    storeDetail &&
    storeDetail.menus &&
    selectedMenuId != null
      ? storeDetail.menus.find(m => m.id === selectedMenuId)
      : null;

  const selectedMenuTypeLabel =
    selectedMenu &&
    typeof selectedMenu.type === 'number' &&
    STORE_TYPE_LABELS[selectedMenu.type]
      ? STORE_TYPE_LABELS[selectedMenu.type]
      : '-';

  // type 은 storeDetail.type 을 우선 사용, 없으면 목록의 type 사용
  const storeTypeIndex =
    storeDetail && typeof storeDetail.type === 'number'
      ? storeDetail.type
      : selectedStore && typeof selectedStore.type === 'number'
        ? selectedStore.type
        : null;

  const selectedStoreTypeLabel =
    storeTypeIndex !== null && STORE_TYPE_LABELS[storeTypeIndex]
      ? STORE_TYPE_LABELS[storeTypeIndex]
      : '-';

  return (
    <div className="mypage-root">
      {/* 상단 헤더 */}
      <header className="mypage-header">
        <div className="mypage-header-left">
          <img
            src={safedishLogo}
            alt="SafeDish 로고"
            className="mypage-logo-image"
          />
          <div className="mypage-logo-text">
            <div className="mypage-logo-title">SafeDish</div>
            <div className="mypage-logo-sub">Owner Dashboard</div>
          </div>
        </div>
        <div className="mypage-header-right" />
      </header>

      {/* 본문 레이아웃 */}
      <div className="mypage-columns">
        {/* 1. 가게 목록 (왼쪽) */}
        <section className="mypage-column mypage-column-stores">
          <div className="mypage-column-header">
            <h2 className="mypage-column-title">가게 목록</h2>
          </div>

          <div className="mypage-column-body">
            {loading && (
              <div className="mypage-message">
                가게 목록을 불러오는 중입니다...
              </div>
            )}

            {error && !loading && (
              <div className="mypage-message error">
                {error}
                <button
                  type="button"
                  className="mypage-message-link"
                  onClick={() => navigate('/signin')}
                >
                  로그인 페이지로 이동
                </button>
              </div>
            )}

            {/* 가게 0개일 때 */}
            {!loading && !error && stores.length === 0 && (
              <>
                <div className="mypage-message">
                  아직 등록된 가게가 없습니다.
                  <br />
                  아래 버튼을 눌러 첫 가게를 추가해 보세요.
                </div>
                <div className="mypage-store-list">
                  <button
                    type="button"
                    className={
                      'mypage-store-item mypage-store-item-add' +
                      (viewMode === 'createStore' ? ' active-add' : '')
                    }
                    onClick={handleAddStore}
                  >
                    <span className="mypage-store-add-plus">＋</span>
                    <span>추가 가게 등록</span>
                  </button>
                </div>
              </>
            )}

            {/* 가게가 있을 때 */}
            {!loading && !error && stores.length > 0 && (
              <div className="mypage-store-list">
                {stores.map(store => (
                  <button
                    key={`store-${store.id}`}
                    type="button"
                    className={
                      'mypage-store-item' +
                      (viewMode === 'store' && store.id === selectedStoreId
                        ? ' active'
                        : '')
                    }
                    onClick={() => handleStoreClick(store.id)}
                  >
                    <div className="mypage-store-name">{store.name}</div>
                    <div className="mypage-store-address">
                      {store.roadAddress}
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  className={
                    'mypage-store-item mypage-store-item-add' +
                    (viewMode === 'createStore' ? ' active-add' : '')
                  }
                  onClick={handleAddStore}
                >
                  <span className="mypage-store-add-plus">＋</span>
                  <span>추가 가게 등록</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. 가운데 영역 */}
        <section
          className={
            'mypage-column ' +
            (viewMode === 'createStore'
              ? 'mypage-column-register-full'
              : 'mypage-column-menus')
          }
        >
          <div className="mypage-column-header">
            <h2 className="mypage-column-title">
              {viewMode === 'createStore' ? '가게 등록' : '가게 정보'}
            </h2>
            {viewMode === 'store' && selectedStore && (
              <span className="mypage-column-subtitle">
                선택된 가게: {selectedStore.name}
              </span>
            )}
          </div>

          <div className="mypage-column-body">
            {/* 가게 등록 화면 */}
            {viewMode === 'createStore' && (
              <>
                <div className="mypage-register-wrapper">
                  <form
                    className="mypage-register-card"
                    onSubmit={handleSubmitNewStore}
                  >
                    <div className="mypage-register-row">
                      <label className="mypage-register-label">
                        가게명
                        <input
                          className="mypage-register-input"
                          type="text"
                          placeholder="가게명을 입력하세요"
                          value={newStoreName}
                          onChange={e => setNewStoreName(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="mypage-register-row">
                      <span className="mypage-register-label-text">
                        카테고리
                      </span>
                      <div className="mypage-register-type-group">
                        {STORE_TYPE_LABELS.map((label, idx) => (
                          <button
                            key={`store-type-${idx}`}
                            type="button"
                            className={
                              'mypage-register-type-chip' +
                              (newStoreType === idx
                                ? ' mypage-register-type-chip-active'
                                : '')
                            }
                            onClick={() => setNewStoreType(idx)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mypage-register-row register-row-inline">
                      <label className="mypage-register-label flex-1">
                        도로명 주소
                        <input
                          className="mypage-register-input"
                          type="text"
                          placeholder="도로명 주소"
                          value={newRoadAddress}
                          onChange={e => setNewRoadAddress(e.target.value)}
                        />
                      </label>
                      <div className="mypage-register-search">
                        <button
                          type="button"
                          className="mypage-postcode-button"
                          onClick={() => setIsPostcodeOpen(true)}
                        >
                          주소 검색
                        </button>
                      </div>
                    </div>

                    <div className="mypage-register-row register-row-inline">
                      <label className="mypage-register-label half">
                        우편번호
                        <input
                          className="mypage-register-input"
                          type="text"
                          placeholder="우편번호"
                          value={newPostalCode}
                          onChange={e => setNewPostalCode(e.target.value)}
                        />
                      </label>
                      <label className="mypage-register-label flex-1">
                        상세 주소
                        <input
                          className="mypage-register-input"
                          type="text"
                          placeholder="상세 주소"
                          value={newDetailAddress}
                          onChange={e => setNewDetailAddress(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="mypage-register-actions">
                      <button
                        type="button"
                        className="mypage-register-cancel"
                        onClick={() => {
                          setViewMode('store');
                          if (stores.length > 0) {
                            setSelectedStoreId(stores[0].id);
                            setDetailMode('basic');
                          } else {
                            setSelectedStoreId(null);
                            setDetailMode(null);
                          }
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="mypage-register-submit"
                      >
                        가게 등록
                      </button>
                    </div>
                  </form>
                </div>
                <p className="mypage-register-help">
                  가게 등록 후 <strong>help@safedish.com</strong> 으로
                  <br />
                  사업자등록증, 일반음식점 영업신고증, 주민등록증 사본을 보내주세요.
                </p>
              </>
            )}

            {/* 가게 선택 모드 안내 */}
            {viewMode === 'store' && !selectedStore && (
              <div className="mypage-message">
                왼쪽에서 가게를 선택하면 가게 정보와 메뉴 리스트가 여기에
                표시됩니다.
              </div>
            )}

            {/* 메뉴 / 정보 선택 리스트 */}
            {viewMode === 'store' && selectedStore && (
              <>
                {storeDetailLoading && (
                  <div className="mypage-message">
                    가게 정보를 불러오는 중입니다...
                  </div>
                )}

                {storeDetailError && !storeDetailLoading && (
                  <div className="mypage-message error">
                    {storeDetailError}
                  </div>
                )}

                {storeDetail && (
                  <div className="mypage-menu-section">
                    <h3 className="mypage-section-title">메뉴 / 정보 선택</h3>

                    <ul className="mypage-menu-list">
                      <li
                        className={
                          'mypage-menu-item' +
                          (detailMode === 'basic' ? ' active' : '')
                        }
                        onClick={() => {
                          setDetailMode('basic');
                          setSelectedMenuId(null);
                          setIsEditingMenu(false);
                          resetOptionItemForm();
                        }}
                      >
                        <div className="mypage-menu-item-main">
                          <span className="mypage-menu-name">기본 정보</span>
                          <span className="mypage-menu-tag">읽기 전용</span>
                        </div>
                      </li>

                      {(!storeDetail.menus ||
                        storeDetail.menus.length === 0) && (
                          <li className="mypage-menu-item disabled">
                            <div className="mypage-menu-item-main">
                              <span className="mypage-menu-name">
                                아직 등록된 메뉴가 없습니다.
                              </span>
                            </div>
                          </li>
                        )}

                      {storeDetail.menus &&
                        storeDetail.menus.length > 0 &&
                        storeDetail.menus.map(menu => (
                          <li
                            key={`menu-${menu.id}`}
                            className={
                              'mypage-menu-item' +
                              (detailMode === 'menu' &&
                                selectedMenuId === menu.id
                                ? ' active'
                                : '')
                            }
                            onClick={() => {
                              setDetailMode('menu');
                              setSelectedMenuId(menu.id);
                              setIsEditingMenu(false);
                              resetOptionItemForm();
                            }}
                          >
                            <div className="mypage-menu-item-main">
                              <span className="mypage-menu-name">
                                {menu.name}
                              </span>
                              <span className="mypage-menu-price">
                                {typeof menu.price === 'number'
                                  ? menu.price.toLocaleString('ko-KR') + '원'
                                  : menu.price}
                              </span>
                            </div>
                          </li>
                        ))}

                      {/* 추가 메뉴 등록 */}
                      <li
                        className={
                          'mypage-menu-item mypage-menu-item-add' +
                          (detailMode === 'createMenu' ? ' active' : '')
                        }
                        onClick={handleSelectCreateMenu}
                      >
                        <div className="mypage-menu-item-main">
                          <span className="mypage-menu-item-add-label">
                            + 추가 메뉴 등록
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 3. 오른쪽 상세 컬럼 */}
        {viewMode === 'store' && (
          <section className="mypage-column mypage-column-detail">
            <div className="mypage-column-header">
              <h2 className="mypage-column-title">
                {detailMode === 'basic' ? '기본 정보' : '메뉴 정보'}
              </h2>
              {detailMode === 'menu' && selectedMenuId && (
                <span className="mypage-column-subtitle">
                  선택된 메뉴 ID: {selectedMenuId}
                </span>
              )}
            </div>

            <div className="mypage-column-body">
              {!selectedStore && (
                <div className="mypage-message">
                  먼저 왼쪽에서 가게를 선택해 주세요.
                </div>
              )}

              {/* 기본 정보: 읽기 전용 + 플랫폼 관리 */}
              {selectedStore && detailMode === 'basic' && (
                <div className="mypage-basic-edit-wrapper">
                  <div className="mypage-register-card mypage-basic-edit-card">
                    <div className="mypage-basic-info-group">
                      <div className="mypage-basic-info-row">
                        <span className="mypage-basic-info-label">가게명</span>
                        <span className="mypage-basic-info-value">
                          {selectedStore.name || '-'}
                        </span>
                      </div>
                      <div className="mypage-basic-info-row">
                        <span className="mypage-basic-info-label">
                          카테고리
                        </span>
                        <span className="mypage-basic-info-value">
                          {selectedStoreTypeLabel}
                        </span>
                      </div>
                      <div className="mypage-basic-info-row">
                        <span className="mypage-basic-info-label">
                          도로명 주소
                        </span>
                        <span className="mypage-basic-info-value">
                          {selectedStore.roadAddress || '-'}
                        </span>
                      </div>
                      <div className="mypage-basic-info-row">
                        <span className="mypage-basic-info-label">
                          우편번호
                        </span>
                        <span className="mypage-basic-info-value">
                          {selectedStore.postalCode || '-'}
                        </span>
                      </div>
                      <div className="mypage-basic-info-row">
                        <span className="mypage-basic-info-label">
                          상세 주소
                        </span>
                        <span className="mypage-basic-info-value">
                          {selectedStore.detailAddress || '-'}
                        </span>
                      </div>
                    </div>

                    {/* 플랫폼 섹션 */}
                    <div className="mypage-platform-section">
                      <div className="mypage-platform-header">
                        <span className="mypage-platform-title">
                          연결된 플랫폼
                        </span>
                        {platformsLoading && (
                          <span className="mypage-platform-status">
                            불러오는 중...
                          </span>
                        )}
                        {platformsError && !platformsLoading && (
                          <span className="mypage-platform-status error">
                            {platformsError}
                          </span>
                        )}
                      </div>

                      <ul className="mypage-platform-list">
                        {(!platforms || platforms.length === 0) &&
                          !platformsLoading &&
                          !platformsError && (
                            <li className="mypage-platform-item empty">
                              등록된 플랫폼이 없습니다.
                            </li>
                          )}

                        {platforms &&
                          platforms.length > 0 &&
                          platforms.map((pf, idx) => (
                            <li
                              key={`platform-${pf.pfName}-${pf.pfSid}-${idx}`}
                              className="mypage-platform-item"
                            >
                              <div className="mypage-platform-left">
                                <span className="mypage-platform-label">
                                  {pf.pfName === 'baemin'
                                    ? '배달의민족'
                                    : pf.pfName === 'coupnag'
                                      ? '쿠팡이츠'
                                      : pf.pfName}
                                </span>
                                <span className="mypage-platform-sid">
                                  매장 ID: {pf.pfSid}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="mypage-platform-delete"
                                onClick={() =>
                                  handleDeletePlatform(pf.pfName, pf.pfSid)
                                }
                              >
                                삭제
                              </button>
                            </li>
                          ))}
                      </ul>

                      <form
                        className="mypage-platform-form"
                        onSubmit={handleSubmitPlatform}
                      >
                        <select
                          className="mypage-platform-select"
                          value={newPlatformName}
                          onChange={e =>
                            setNewPlatformName(e.target.value)
                          }
                        >
                          <option value="baemin">배달의민족</option>
                          <option value="coupnag">쿠팡이츠</option>
                        </select>
                        <input
                          className="mypage-platform-input"
                          type="text"
                          placeholder="플랫폼 가게 ID"
                          value={newPlatformSid}
                          onChange={e =>
                            setNewPlatformSid(e.target.value)
                          }
                        />
                        <button
                          type="submit"
                          className="mypage-platform-submit"
                        >
                          등록
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 메뉴 등록 화면 */}
              {selectedStore && detailMode === 'createMenu' && (
                <div className="mypage-basic-edit-wrapper">
                  <div className="mypage-register-card mypage-menu-create-card">
                    {createMenuStep === 1 && (
                      <>
                        <h3 className="mypage-section-title">
                          메뉴 기본 정보
                        </h3>
                        <div className="mypage-register-row">
                          <label className="mypage-register-label">
                            메뉴명
                            <input
                              className="mypage-register-input"
                              type="text"
                              placeholder="메뉴명을 입력하세요"
                              value={createMenuName}
                              onChange={e =>
                                setCreateMenuName(e.target.value)
                              }
                            />
                          </label>
                        </div>

                        {/* 1단계에서는 카테고리 표시 안 함 */}

                        <div className="mypage-register-row">
                          <label className="mypage-register-label">
                            간단한 설명
                            <textarea
                              className="mypage-register-input mypage-textarea"
                              placeholder="메뉴에 대한 간단한 설명을 입력하면 알레르기 분석에 도움이 됩니다."
                              value={createMenuDescription}
                              onChange={e =>
                                setCreateMenuDescription(e.target.value)
                              }
                            />
                          </label>
                        </div>

                        {guessError && (
                          <p className="mypage-error-text">{guessError}</p>
                        )}

                        <div className="mypage-register-actions">
                          <button
                            type="button"
                            className="mypage-register-submit"
                            onClick={handleGuessAllergies}
                            disabled={guessLoading}
                          >
                            {guessLoading ? '분석 중...' : '다음'}
                          </button>
                        </div>
                      </>
                    )}

                    {createMenuStep === 2 && (
                      <>
                        <h3 className="mypage-section-title">
                          알레르기 · 카테고리 · 가격 설정
                        </h3>

                        {/* 2단계에서 메뉴 카테고리 표시 */}
                        <div className="mypage-register-row">
                          <span className="mypage-register-label-text">
                            메뉴 카테고리
                          </span>
                          <div className="mypage-register-type-group">
                            {STORE_TYPE_LABELS.map((label, idx) => (
                              <button
                                key={`menu-type-${idx}`}
                                type="button"
                                className={
                                  'mypage-register-type-chip' +
                                  (createMenuType === idx
                                    ? ' mypage-register-type-chip-active'
                                    : '')
                                }
                                onClick={() => setCreateMenuType(idx)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <p className="mypage-hint-text">
                          예상 알레르기 결과를 확인하고 필요 시 on/off 로 수정해
                          주세요.
                        </p>

                        <div className="mypage-allergy-section">
                          <div className="mypage-allergy-grid">
                            {ALLERGY_TEXT_LIST.map((label, idx) => (
                              <button
                                key={`allergy-${idx}`}
                                type="button"
                                className={
                                  'mypage-allergy-chip' +
                                  (createMenuAllergies.includes(idx)
                                    ? ' active'
                                    : '')
                                }
                                onClick={() => toggleCreateAllergy(idx)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mypage-register-row">
                          <label className="mypage-register-label">
                            가격
                            <input
                              className="mypage-register-input"
                              type="number"
                              min="0"
                              step="100"
                              placeholder="예: 8900"
                              value={createMenuPrice}
                              onChange={e =>
                                setCreateMenuPrice(e.target.value)
                              }
                            />
                          </label>
                        </div>

                        <div className="mypage-register-actions">
                          <button
                            type="button"
                            className="mypage-register-cancel"
                            onClick={() => setCreateMenuStep(1)}
                          >
                            이전
                          </button>
                          <button
                            type="button"
                            className="mypage-register-submit"
                            onClick={handleRegisterMenu}
                            disabled={registerMenuLoading}
                          >
                            {registerMenuLoading ? '등록 중...' : '메뉴 등록'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 메뉴 정보 */}
              {selectedStore && detailMode === 'menu' && !selectedMenuId && (
                <div className="mypage-message">
                  가운데에서 메뉴를 선택하면 이 영역에 상세 정보가 표시됩니다.
                </div>
              )}

              {selectedStore && detailMode === 'menu' && selectedMenuId && (
                !selectedMenu ? (
                  <div className="mypage-message">
                    선택된 메뉴 정보를 찾을 수 없습니다. 다시 시도해 주세요.
                  </div>
                ) : (
                  <div className="mypage-menu-detail-wrapper">
                    <div className="mypage-register-card mypage-menu-detail-card">
                      {/* 상단 타이틀 + 버튼 */}
                      <div className="mypage-menu-detail-header-row">
                        <h3 className="mypage-section-title">
                          메뉴 정보
                        </h3>
                        {!isEditingMenu ? (
                          <div className="mypage-menu-detail-actions">
                            <button
                              type="button"
                              className="mypage-menu-detail-btn"
                              onClick={handleStartEditMenu}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className="mypage-menu-detail-btn mypage-menu-detail-btn-danger"
                              onClick={handleDeleteMenuClick}
                            >
                              삭제
                            </button>
                          </div>
                        ) : (
                          <div className="mypage-menu-detail-actions">
                            <button
                              type="button"
                              className="mypage-menu-detail-btn"
                              onClick={handleCancelEditMenu}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              className="mypage-menu-detail-btn mypage-menu-detail-btn-primary"
                              onClick={handleApplyEditMenu}
                              disabled={editMenuLoading}
                            >
                              {editMenuLoading ? '적용 중...' : '적용'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 메뉴 기본 + 알레르기 통합 영역 */}
                      {!isEditingMenu ? (
                        <>
                          <div className="mypage-menu-detail-section">
                            <div className="mypage-menu-detail-group">
                              <div className="mypage-basic-info-row">
                                <span className="mypage-basic-info-label">
                                  메뉴명
                                </span>
                                <span className="mypage-basic-info-value">
                                  {selectedMenu.name}
                                </span>
                              </div>
                              <div className="mypage-basic-info-row">
                                <span className="mypage-basic-info-label">
                                  카테고리
                                </span>
                                <span className="mypage-basic-info-value">
                                  {selectedMenuTypeLabel}
                                </span>
                              </div>
                              <div className="mypage-basic-info-row">
                                <span className="mypage-basic-info-label">
                                  가격
                                </span>
                                <span className="mypage-basic-info-value">
                                  {typeof selectedMenu.price === 'number'
                                    ? selectedMenu.price.toLocaleString('ko-KR') + '원'
                                    : selectedMenu.price}
                                </span>
                              </div>
                            </div>

                            <div className="mypage-menu-detail-subsection">
                              <span className="mypage-basic-info-label">
                                알레르기
                              </span>
                              {(!selectedMenu.allergies ||
                                selectedMenu.allergies.length === 0) && (
                                <p className="mypage-hint-text">
                                  등록된 알레르기 정보가 없습니다.
                                </p>
                              )}
                              {selectedMenu.allergies &&
                                selectedMenu.allergies.length > 0 && (
                                  <div className="mypage-allergy-grid">
                                    {selectedMenu.allergies.map((a, idx) => (
                                      <span
                                        key={`menu-allergy-${a.code}-${idx}`}
                                        className="mypage-allergy-chip active"
                                      >
                                        {ALLERGY_TEXT_LIST[a.code] ||
                                          a.description ||
                                          `코드 ${a.code}`}
                                      </span>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mypage-menu-detail-section">
                            <div className="mypage-register-row">
                              <label className="mypage-register-label">
                                메뉴명
                                <input
                                  className="mypage-register-input"
                                  type="text"
                                  value={editMenuName}
                                  onChange={e =>
                                    setEditMenuName(e.target.value)
                                  }
                                />
                              </label>
                            </div>

                            <div className="mypage-register-row">
                              <span className="mypage-register-label-text">
                                메뉴 카테고리
                              </span>
                              <div className="mypage-register-type-group">
                                {STORE_TYPE_LABELS.map((label, idx) => (
                                  <button
                                    key={`edit-menu-type-${idx}`}
                                    type="button"
                                    className={
                                      'mypage-register-type-chip' +
                                      (editMenuType === idx
                                        ? ' mypage-register-type-chip-active'
                                        : '')
                                    }
                                    onClick={() => setEditMenuType(idx)}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mypage-register-row">
                              <span className="mypage-register-label-text">
                                알레르기 정보
                              </span>
                              <div className="mypage-allergy-grid">
                                {ALLERGY_TEXT_LIST.map((label, idx) => (
                                  <button
                                    key={`edit-allergy-${idx}`}
                                    type="button"
                                    className={
                                      'mypage-allergy-chip' +
                                      (editMenuAllergies.includes(idx)
                                        ? ' active'
                                        : '')
                                    }
                                    onClick={() => toggleEditAllergy(idx)}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mypage-register-row">
                              <label className="mypage-register-label">
                                가격
                                <input
                                  className="mypage-register-input"
                                  type="number"
                                  min="0"
                                  step="100"
                                  value={editMenuPrice}
                                  onChange={e =>
                                    setEditMenuPrice(e.target.value)
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {/* 옵션 정보 (세로 정렬) */}
                      <div className="mypage-menu-detail-section">
                        <h4 className="mypage-menu-detail-title">
                          옵션 정보
                        </h4>

                        {(!selectedMenu.options ||
                          selectedMenu.options.length === 0) && (
                          <p className="mypage-hint-text">
                            등록된 옵션이 없습니다.
                          </p>
                        )}

                        {selectedMenu.options &&
                          selectedMenu.options.length > 0 && (
                            <div className="mypage-option-list">
                              {selectedMenu.options.map(option => (
                                <div
                                  key={`option-group-${option.id}`}
                                  className="mypage-option-group-card"
                                >
                                  <div className="mypage-option-group-header">
                                    <span className="mypage-option-group-name">
                                      {option.name}
                                    </span>
                                    <div className="mypage-option-group-right">
                                      <span className="mypage-option-group-rule">
                                        최소 {option.minSelected}개 / 최대 {option.maxSelected}개
                                      </span>
                                      <button
                                        type="button"
                                        className="mypage-option-add-btn"
                                        onClick={() =>
                                          handleOpenCreateOptionItem(option.id)
                                        }
                                        disabled={isEditingMenu}
                                      >
                                        {activeOptionGroupId === option.id
                                          ? '옵션 추가 취소'
                                          : '옵션 추가'}
                                      </button>
                                    </div>
                                  </div>

                                  <ul className="mypage-option-item-list">
                                    {option.items && option.items.length > 0 ? (
                                      option.items.map(item => (
                                        <li
                                          key={`option-item-${item.id}`}
                                          className="mypage-option-item-row"
                                        >
                                          <div className="mypage-option-item-main">
                                            <span className="mypage-option-item-name">
                                              {item.name}
                                            </span>
                                            <span className="mypage-option-item-price">
                                              {typeof item.price === 'number'
                                                ? (item.price || 0).toLocaleString('ko-KR') + '원'
                                                : item.price}
                                            </span>
                                          </div>

                                          {item.allergies &&
                                            item.allergies.length > 0 && (
                                              <div className="mypage-option-item-allergies">
                                                {item.allergies.map((a, idx2) => (
                                                  <span
                                                    key={`option-item-allergy-${item.id}-${a.code}-${idx2}`}
                                                    className="mypage-option-item-allergy-chip"
                                                  >
                                                    {ALLERGY_TEXT_LIST[a.code] ||
                                                      a.description ||
                                                      `코드 ${a.code}`}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="mypage-option-item-row empty">
                                        <span className="mypage-hint-text">
                                          등록된 옵션 아이템이 없습니다.
                                        </span>
                                      </li>
                                    )}
                                  </ul>

                                  {/* 옵션 아이템 생성 폼 */}
                                  {activeOptionGroupId === option.id && !isEditingMenu && (
                                    <div className="mypage-option-item-create">
                                      {createOptionItemStep === 1 && (
                                        <>
                                          <div className="mypage-register-row">
                                            <label className="mypage-register-label">
                                              옵션명
                                              <input
                                                className="mypage-register-input"
                                                type="text"
                                                placeholder="예: 곱빼기, 치즈 추가"
                                                value={createOptionItemName}
                                                onChange={e =>
                                                  setCreateOptionItemName(e.target.value)
                                                }
                                              />
                                            </label>
                                          </div>

                                          <div className="mypage-register-row">
                                            <label className="mypage-register-label">
                                              옵션 설명 (선택)
                                              <textarea
                                                className="mypage-register-input mypage-textarea"
                                                placeholder="옵션에 대한 간단한 설명을 입력하면 알레르기 분석에 도움이 됩니다."
                                                value={createOptionItemDescription}
                                                onChange={e =>
                                                  setCreateOptionItemDescription(e.target.value)
                                                }
                                              />
                                            </label>
                                          </div>

                                          {optionGuessError && (
                                            <p className="mypage-error-text">
                                              {optionGuessError}
                                            </p>
                                          )}

                                          <div className="mypage-register-actions">
                                            <button
                                              type="button"
                                              className="mypage-register-submit"
                                              onClick={() =>
                                                handleGuessOptionItemAllergies(option)
                                              }
                                              disabled={optionGuessLoading}
                                            >
                                              {optionGuessLoading
                                                ? '분석 중...'
                                                : '다음'}
                                            </button>
                                          </div>
                                        </>
                                      )}

                                      {createOptionItemStep === 2 && (
                                        <>
                                          <p className="mypage-hint-text">
                                            예상 알레르기 결과를 확인하고 필요시 on/off로
                                            수정한 뒤 가격을 입력해 주세요.
                                          </p>

                                          <div className="mypage-allergy-section">
                                            <div className="mypage-allergy-grid">
                                              {ALLERGY_TEXT_LIST.map((label, idx) => (
                                                <button
                                                  key={`option-create-allergy-${idx}`}
                                                  type="button"
                                                  className={
                                                    'mypage-allergy-chip' +
                                                    (createOptionItemAllergies.includes(idx)
                                                      ? ' active'
                                                      : '')
                                                  }
                                                  onClick={() =>
                                                    toggleCreateOptionItemAllergy(idx)
                                                  }
                                                >
                                                  {label}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          <div className="mypage-register-row">
                                            <label className="mypage-register-label">
                                              옵션 가격
                                              <input
                                                className="mypage-register-input"
                                                type="number"
                                                min="0"
                                                step="100"
                                                placeholder="예: 1000"
                                                value={createOptionItemPrice}
                                                onChange={e =>
                                                  setCreateOptionItemPrice(e.target.value)
                                                }
                                              />
                                            </label>
                                          </div>

                                          <div className="mypage-register-actions">
                                            <button
                                              type="button"
                                              className="mypage-register-cancel"
                                              onClick={() =>
                                                setCreateOptionItemStep(1)
                                              }
                                            >
                                              이전
                                            </button>
                                            <button
                                              type="button"
                                              className="mypage-register-submit"
                                              onClick={() =>
                                                handleRegisterOptionItemClick(option)
                                              }
                                              disabled={registerOptionItemLoading}
                                            >
                                              {registerOptionItemLoading
                                                ? '등록 중...'
                                                : '옵션 등록'}
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                        {/* 옵션 그룹 추가 폼 */}
                        <div className="mypage-option-create-group">
                          <h4 className="mypage-menu-detail-title">
                            옵션 그룹 추가
                          </h4>
                          <form
                            className="mypage-option-group-form"
                            onSubmit={handleCreateOptionGroup}
                          >
                            <div className="mypage-register-row">
                              <label className="mypage-register-label">
                                옵션 그룹명
                                <input
                                  className="mypage-register-input"
                                  type="text"
                                  placeholder="예: 토핑 선택, 사이즈 선택"
                                  value={newOptionGroupName}
                                  onChange={e =>
                                    setNewOptionGroupName(e.target.value)
                                  }
                                />
                              </label>
                            </div>
                            {optionGroupError && (
                              <p className="mypage-error-text">
                                {optionGroupError}
                              </p>
                            )}
                            <div className="mypage-register-actions">
                              <button
                                type="submit"
                                className="mypage-register-submit"
                                disabled={optionGroupLoading}
                              >
                                {optionGroupLoading
                                  ? '생성 중...'
                                  : '옵션 그룹 생성'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {selectedStore && !detailMode && (
                <div className="mypage-message">
                  가운데에서 기본 정보 또는 메뉴를 선택해 주세요.
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Kakao Postcode 모달 (가게 등록용) */}
      {isPostcodeOpen && (
        <div
          className="mypage-postcode-backdrop"
          onClick={() => setIsPostcodeOpen(false)}
        >
          <div
            className="mypage-postcode-modal"
            onClick={e => e.stopPropagation()}
          >
            <Postcode
              style={{ width: '100%', height: '100%' }}
              jsOptions={{ animation: true, hideMapBtn: true }}
              onSelected={handlePostcodeSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
