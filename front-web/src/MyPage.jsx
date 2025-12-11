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
  deleteOptionGroup,
  deleteOptionItem,
  editOptionGroup,
  editOptionItem,
} from './api';
import safedishLogo from './assets/safedish_logo.png';
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
const ALLERGY_TEXT_LIST = [
  '알류(가금류)',
  '우유',
  '메밀',
  '땅콩',
  '대두',
  '밀',
  '고등어',
  '게',
  '새우',
  '돼지고기',
  '복숭아',
  '토마토',
  '아황산류',
  '호두',
  '닭고기',
  '쇠고기',
  '오징어',
  '굴',
  '전복',
  '홍합',
  '조개류',
  '잣',
  '고열량·저영양',
  'GMO 식품',
  '고카페인',
];
function MyPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('store');
  const [detailMode, setDetailMode] = useState(null);
  const [storeDetail, setStoreDetail] = useState(null);
  const [storeDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetailError, setStoreDetailError] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [platformsError, setPlatformsError] = useState('');
  const [newPlatformName, setNewPlatformName] = useState('baemin');
  const [newPlatformSid, setNewPlatformSid] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreType, setNewStoreType] = useState(0);
  const [newRoadAddress, setNewRoadAddress] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newDetailAddress, setNewDetailAddress] = useState('');
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [createMenuStep, setCreateMenuStep] = useState(1);
  const [createMenuName, setCreateMenuName] = useState('');
  const [createMenuType, setCreateMenuType] = useState(0);
  const [createMenuDescription, setCreateMenuDescription] = useState('');
  const [createMenuPrice, setCreateMenuPrice] = useState('');
  const [createMenuAllergies, setCreateMenuAllergies] = useState([]);
  const [guessLoading, setGuessLoading] = useState(false);
  const [guessError, setGuessError] = useState('');
  const [registerMenuLoading, setRegisterMenuLoading] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuType, setEditMenuType] = useState(0);
  const [editMenuPrice, setEditMenuPrice] = useState('');
  const [editMenuAllergies, setEditMenuAllergies] = useState([]);
  const [editMenuLoading, setEditMenuLoading] = useState(false);
  const [newOptionGroupName, setNewOptionGroupName] = useState('');
  const [optionGroupLoading, setOptionGroupLoading] = useState(false);
  const [optionGroupError, setOptionGroupError] = useState('');
  const [editingOptionGroupId, setEditingOptionGroupId] = useState(null);
  const [editOptionGroupName, setEditOptionGroupName] = useState('');
  const [editOptionMinSelected, setEditOptionMinSelected] = useState(0);
  const [editOptionMaxSelected, setEditOptionMaxSelected] = useState(0);
  const [editOptionGroupLoading, setEditOptionGroupLoading] = useState(false);
  const [editOptionIsRequired, setEditOptionIsRequired] = useState(false);
  const [activeOptionGroupId, setActiveOptionGroupId] = useState(null);
  const [createOptionItemStep, setCreateOptionItemStep] = useState(1);
  const [createOptionItemName, setCreateOptionItemName] = useState('');
  const [createOptionItemDescription, setCreateOptionItemDescription] =
    useState('');
  const [createOptionItemPrice, setCreateOptionItemPrice] = useState('');
  const [createOptionItemAllergies, setCreateOptionItemAllergies] = useState(
    [],
  );
  const [optionGuessLoading, setOptionGuessLoading] = useState(false);
  const [optionGuessError, setOptionGuessError] = useState('');
  const [registerOptionItemLoading, setRegisterOptionItemLoading] =
    useState(false);
  const [editingOptionItemGroupId, setEditingOptionItemGroupId] =
    useState(null);
  const [editingOptionItemId, setEditingOptionItemId] = useState(null);
  const [editOptionItemName, setEditOptionItemName] = useState('');
  const [editOptionItemPrice, setEditOptionItemPrice] = useState('');
  const [editOptionItemAllergies, setEditOptionItemAllergies] = useState([]);
  const [editOptionItemLoading, setEditOptionItemLoading] = useState(false);
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
  const resetOptionEditStates = () => {
    setEditingOptionGroupId(null);
    setEditOptionGroupName('');
    setEditOptionMinSelected(0);
    setEditOptionMaxSelected(0);
    setEditOptionGroupLoading(false);
    setEditOptionIsRequired(false);
    setEditingOptionItemGroupId(null);
    setEditingOptionItemId(null);
    setEditOptionItemName('');
    setEditOptionItemPrice('');
    setEditOptionItemAllergies([]);
    setEditOptionItemLoading(false);
  };
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
    resetOptionEditStates();
  };
  const handleAddStore = () => {
    setViewMode('createStore');
    setSelectedStoreId(null);
    setSelectedMenuId(null);
    setDetailMode(null);
    setIsEditingMenu(false);
    resetOptionItemForm();
    resetOptionEditStates();
  };
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
    setStores(prev => [...prev, newStore]);
    setViewMode('store');
    setSelectedStoreId(result.id);
    setSelectedMenuId(null);
    setDetailMode('basic');
    setNewStoreName('');
    setNewRoadAddress('');
    setNewPostalCode('');
    setNewDetailAddress('');
    setNewStoreType(0);
  };
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
  const handlePostcodeSelected = data => {
    const roadAddr = data.roadAddress || data.address || '';
    setNewRoadAddress(roadAddr);
    setNewPostalCode(data.zonecode || '');
    setIsPostcodeOpen(false);
  };
  const handlePostcodeError = error => {
    alert('주소 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    setIsPostcodeOpen(false);
  };
  const handleSelectCreateMenu = () => {
    const store = stores.find(s => s.id === selectedStoreId);
    const baseType =
      storeDetail && typeof storeDetail.type === 'number'
        ? storeDetail.type
        : store && typeof store.type === 'number'
          ? store.type
          : 0;
    setDetailMode('createMenu');
    setSelectedMenuId(null);
    setCreateMenuStep(1);
    setCreateMenuName('');
    setCreateMenuType(baseType);
    setCreateMenuDescription('');
    setCreateMenuPrice('');
    setCreateMenuAllergies([]);
    setGuessError('');
    setGuessLoading(false);
    setRegisterMenuLoading(false);
    setIsEditingMenu(false);
    resetOptionItemForm();
    resetOptionEditStates();
  };
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
  const toggleCreateAllergy = code => {
    setCreateMenuAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };
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
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    if (result.id) {
      setSelectedMenuId(result.id);
      setDetailMode('menu');
    } else {
      setDetailMode('menu');
    }
    setRegisterMenuLoading(false);
    setIsEditingMenu(false);
    resetOptionItemForm();
    resetOptionEditStates();
  };
  const toggleEditAllergy = code => {
    setEditMenuAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };
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
    resetOptionItemForm();
    resetOptionEditStates();
  };
  const handleCancelEditMenu = () => {
    setIsEditingMenu(false);
  };
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
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    setEditMenuLoading(false);
    setIsEditingMenu(false);
  };
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
    resetOptionEditStates();
  };
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
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    setNewOptionGroupName('');
    setOptionGroupLoading(false);
  };
  const handleStartEditOptionGroup = option => {
    setEditingOptionGroupId(option.id);
    setEditOptionGroupName(option.name || '');
    const min =
      typeof option.minSelected === 'number' ? option.minSelected : 0;
    const max =
      typeof option.maxSelected === 'number' ? option.maxSelected : 1;
    const isRequired = min >= 1;
    setEditOptionIsRequired(isRequired);
    setEditOptionMinSelected(isRequired ? 1 : 0);
    setEditOptionMaxSelected(isRequired ? 1 : max || 1);
  };
  const handleCancelEditOptionGroup = () => {
    setEditingOptionGroupId(null);
    setEditOptionGroupName('');
    setEditOptionMinSelected(0);
    setEditOptionMaxSelected(0);
    setEditOptionGroupLoading(false);
    setEditOptionIsRequired(false);
  };
  const handleApplyEditOptionGroup = async groupId => {
    if (!editOptionGroupName.trim()) {
      alert('옵션 그룹명을 입력해 주세요.');
      return;
    }
    let minSelected = editOptionIsRequired ? 1 : 0;
    let maxSelected = editOptionIsRequired ? 1 : Number(editOptionMaxSelected);
    if (!editOptionIsRequired) {
      if (Number.isNaN(maxSelected) || maxSelected < 1) {
        alert('최대 선택 개수는 1 이상이어야 합니다.');
        return;
      }
    }
    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }
    setEditOptionGroupLoading(true);
    const result = await editOptionGroup(
      token,
      groupId,
      editOptionGroupName.trim(),
      minSelected,
      maxSelected,
    );
    if (!result) {
      setEditOptionGroupLoading(false);
      alert('옵션 그룹 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    setEditOptionGroupLoading(false);
    handleCancelEditOptionGroup();
  };
  const handleDeleteOptionGroupClick = async groupId => {
    if (
      !window.confirm(
        '해당 옵션 그룹을 삭제하시겠습니까? (포함된 옵션도 함께 삭제됩니다)',
      )
    ) {
      return;
    }
    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }
    const ok = await deleteOptionGroup(token, groupId);
    if (!ok) {
      alert('옵션 그룹 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    if (activeOptionGroupId === groupId) {
      resetOptionItemForm();
    }
    if (editingOptionGroupId === groupId) {
      handleCancelEditOptionGroup();
    }
  };
  const handleOpenCreateOptionItem = groupId => {
    if (activeOptionGroupId === groupId) {
      resetOptionItemForm();
      return;
    }
    resetOptionItemForm();
    resetOptionEditStates();
    setActiveOptionGroupId(groupId);
    setCreateOptionItemStep(1);
  };
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
    const selectedMenuObj =
      storeDetail &&
        storeDetail.menus &&
        selectedMenuId != null
        ? storeDetail.menus.find(m => m.id === selectedMenuId)
        : null;
    const menuName = selectedMenuObj ? selectedMenuObj.name : '';
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
  const toggleCreateOptionItemAllergy = code => {
    setCreateOptionItemAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };
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
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    setRegisterOptionItemLoading(false);
    resetOptionItemForm();
  };
  const handleStartEditOptionItem = (group, item) => {
    resetOptionItemForm();
    setEditingOptionItemGroupId(group.id);
    setEditingOptionItemId(item.id);
    setEditOptionItemName(item.name || '');
    const rawPrice =
      typeof item.price === 'number' ? item.price : Number(item.price);
    setEditOptionItemPrice(
      rawPrice != null && !Number.isNaN(rawPrice) ? String(rawPrice) : '',
    );
    const codes = (item.allergies || [])
      .map(a => Number(a.code))
      .filter(
        code =>
          Number.isInteger(code) &&
          code >= 0 &&
          code < ALLERGY_TEXT_LIST.length,
      );
    setEditOptionItemAllergies(codes);
  };
  const handleCancelEditOptionItem = () => {
    setEditingOptionItemGroupId(null);
    setEditingOptionItemId(null);
    setEditOptionItemName('');
    setEditOptionItemPrice('');
    setEditOptionItemAllergies([]);
    setEditOptionItemLoading(false);
  };
  const toggleEditOptionItemAllergy = code => {
    setEditOptionItemAllergies(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].sort((a, b) => a - b),
    );
  };
  const handleApplyEditOptionItem = async () => {
    if (!editingOptionItemGroupId || !editingOptionItemId) {
      return;
    }
    if (!editOptionItemName.trim()) {
      alert('옵션명을 입력해 주세요.');
      return;
    }
    const priceNum = Number(editOptionItemPrice);
    if (editOptionItemPrice === '' || Number.isNaN(priceNum) || priceNum < 0) {
      alert('옵션 가격을 올바르게 입력해 주세요.');
      return;
    }
    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }
    setEditOptionItemLoading(true);
    const result = await editOptionItem(
      token,
      editingOptionItemGroupId,
      editingOptionItemId,
      editOptionItemName.trim(),
      priceNum,
      editOptionItemAllergies,
    );
    if (!result) {
      setEditOptionItemLoading(false);
      alert('옵션 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    setEditOptionItemLoading(false);
    handleCancelEditOptionItem();
  };
  const handleDeleteOptionItemClick = async (groupId, itemId) => {
    if (!window.confirm('해당 옵션을 삭제하시겠습니까?')) {
      return;
    }
    const token = getCookie('sd_token');
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/signin');
      return;
    }
    const ok = await deleteOptionItem(token, groupId, itemId);
    if (!ok) {
      alert('옵션 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    const refreshed = await getStore(selectedStoreId);
    if (refreshed) {
      setStoreDetail(refreshed);
    }
    if (
      editingOptionItemGroupId === groupId &&
      editingOptionItemId === itemId
    ) {
      handleCancelEditOptionItem();
    }
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
      { }
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
      { }
      <div className="mypage-columns">
        { }
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
            { }
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
            { }
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
        { }
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
            { }
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
            { }
            {viewMode === 'store' && !selectedStore && (
              <div className="mypage-message">
                왼쪽에서 가게를 선택하면 가게 정보와 메뉴 리스트가 여기에
                표시됩니다.
              </div>
            )}
            { }
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
                          resetOptionEditStates();
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
                              resetOptionEditStates();
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
                      { }
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
        { }
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
              { }
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
                    { }
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
              { }
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
                        { }
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
              { }
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
                      { }
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
                      { }
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
                                    ? selectedMenu.price.toLocaleString(
                                      'ko-KR',
                                    ) + '원'
                                    : selectedMenu.price}
                                </span>
                              </div>
                            </div>
                            <div className="mypage-menu-detail-subsection">
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
                      { }
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
                              {selectedMenu.options.map(option => {
                                const isRequiredGroup =
                                  typeof option.minSelected === 'number' &&
                                  option.minSelected >= 1;
                                const maxCount =
                                  typeof option.maxSelected === 'number' &&
                                    option.maxSelected > 0
                                    ? option.maxSelected
                                    : 1;
                                return (
                                  <div
                                    key={`option-group-${option.id}`}
                                    className="mypage-option-group-card"
                                  >
                                    <div className="mypage-option-group-header">
                                      { }
                                      {editingOptionGroupId === option.id ? (
                                        <>
                                          <div className="mypage-option-group-header-main">
                                            { }
                                            <label className="mypage-option-group-edit-label">
                                              그룹명
                                              <input
                                                className="mypage-register-input mypage-option-group-edit-input"
                                                type="text"
                                                value={editOptionGroupName}
                                                onChange={e =>
                                                  setEditOptionGroupName(
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            </label>
                                            { }
                                            <div className="mypage-option-group-edit-mode">
                                              <span className="mypage-option-group-edit-mode-label">
                                                선택 방식
                                              </span>
                                              <div className="mypage-option-group-mode-toggle">
                                                <button
                                                  type="button"
                                                  className={
                                                    'mypage-option-group-mode-btn' +
                                                    (!editOptionIsRequired
                                                      ? ' active'
                                                      : '')
                                                  }
                                                  onClick={() => {
                                                    setEditOptionIsRequired(
                                                      false,
                                                    );
                                                    setEditOptionMinSelected(0);
                                                    if (
                                                      !editOptionMaxSelected ||
                                                      editOptionMaxSelected < 1
                                                    ) {
                                                      setEditOptionMaxSelected(
                                                        1,
                                                      );
                                                    }
                                                  }}
                                                >
                                                  선택
                                                </button>
                                                <button
                                                  type="button"
                                                  className={
                                                    'mypage-option-group-mode-btn' +
                                                    (editOptionIsRequired
                                                      ? ' active'
                                                      : '')
                                                  }
                                                  onClick={() => {
                                                    setEditOptionIsRequired(
                                                      true,
                                                    );
                                                    setEditOptionMinSelected(1);
                                                    setEditOptionMaxSelected(1);
                                                  }}
                                                >
                                                  필수
                                                </button>
                                              </div>
                                            </div>
                                            { }
                                            <div className="mypage-option-group-edit-row">
                                              <label className="mypage-option-group-edit-label-inline">
                                                <span>최대 선택 개수</span>
                                                <input
                                                  className="mypage-option-group-number-input"
                                                  type="number"
                                                  min="1"
                                                  value={editOptionMaxSelected}
                                                  disabled={
                                                    editOptionIsRequired
                                                  }
                                                  onChange={e =>
                                                    setEditOptionMaxSelected(
                                                      Math.max(
                                                        1,
                                                        Number(
                                                          e.target.value,
                                                        ) || 1,
                                                      ),
                                                    )
                                                  }
                                                />
                                              </label>
                                              {editOptionIsRequired && (
                                                <span className="mypage-option-group-edit-caption">
                                                  필수인 경우 항상{' '}
                                                  <strong>1개</strong>만
                                                  선택됩니다.
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          { }
                                          <div className="mypage-option-group-actions">
                                            <button
                                              type="button"
                                              className="mypage-option-group-btn"
                                              onClick={
                                                handleCancelEditOptionGroup
                                              }
                                              disabled={
                                                editOptionGroupLoading
                                              }
                                            >
                                              취소
                                            </button>
                                            <button
                                              type="button"
                                              className="mypage-option-group-btn mypage-option-group-btn-primary"
                                              onClick={() =>
                                                handleApplyEditOptionGroup(
                                                  option.id,
                                                )
                                              }
                                              disabled={
                                                editOptionGroupLoading
                                              }
                                            >
                                              {editOptionGroupLoading
                                                ? '적용 중...'
                                                : '적용'}
                                            </button>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="mypage-option-group-header-main">
                                            <span className="mypage-option-group-name">
                                              {option.name}
                                            </span>
                                            <span className="mypage-option-group-rule">
                                              {isRequiredGroup
                                                ? '필수 (1개 선택)'
                                                : `선택 (최대 ${maxCount}개)`}
                                            </span>
                                          </div>
                                          <div className="mypage-option-group-actions">
                                            <button
                                              type="button"
                                              className="mypage-option-group-btn"
                                              onClick={() =>
                                                handleStartEditOptionGroup(
                                                  option,
                                                )
                                              }
                                              disabled={isEditingMenu}
                                            >
                                              그룹 수정
                                            </button>
                                            <button
                                              type="button"
                                              className="mypage-option-group-btn mypage-option-group-btn-danger"
                                              onClick={() =>
                                                handleDeleteOptionGroupClick(
                                                  option.id,
                                                )
                                              }
                                              disabled={isEditingMenu}
                                            >
                                              그룹 삭제
                                            </button>
                                            <button
                                              type="button"
                                              className="mypage-option-add-btn"
                                              onClick={() =>
                                                handleOpenCreateOptionItem(
                                                  option.id,
                                                )
                                              }
                                              disabled={isEditingMenu}
                                            >
                                              {activeOptionGroupId ===
                                                option.id
                                                ? '옵션 추가 취소'
                                                : '옵션 추가'}
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    { }
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
                                                {typeof item.price ===
                                                  'number'
                                                  ? (item.price || 0).toLocaleString(
                                                    'ko-KR',
                                                  ) + '원'
                                                  : item.price}
                                              </span>
                                            </div>
                                            {item.allergies &&
                                              item.allergies.length > 0 && (
                                                <div className="mypage-option-item-allergies">
                                                  {item.allergies.map(
                                                    (a, idx2) => (
                                                      <span
                                                        key={`option-item-allergy-${item.id}-${a.code}-${idx2}`}
                                                        className="mypage-option-item-allergy-chip"
                                                      >
                                                        {ALLERGY_TEXT_LIST[
                                                          a.code
                                                        ] ||
                                                          a.description ||
                                                          `코드 ${a.code}`}
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            { }
                                            <div className="mypage-option-item-actions">
                                              <button
                                                type="button"
                                                className="mypage-option-item-btn"
                                                onClick={() =>
                                                  handleStartEditOptionItem(
                                                    option,
                                                    item,
                                                  )
                                                }
                                                disabled={isEditingMenu}
                                              >
                                                수정
                                              </button>
                                              <button
                                                type="button"
                                                className="mypage-option-item-btn mypage-option-item-btn-danger"
                                                onClick={() =>
                                                  handleDeleteOptionItemClick(
                                                    option.id,
                                                    item.id,
                                                  )
                                                }
                                                disabled={isEditingMenu}
                                              >
                                                삭제
                                              </button>
                                            </div>
                                            { }
                                            {editingOptionItemGroupId ===
                                              option.id &&
                                              editingOptionItemId ===
                                              item.id && (
                                                <div className="mypage-option-item-edit-block">
                                                  <div className="mypage-register-row">
                                                    <label className="mypage-register-label">
                                                      옵션명
                                                      <input
                                                        className="mypage-register-input"
                                                        type="text"
                                                        value={editOptionItemName}
                                                        onChange={e =>
                                                          setEditOptionItemName(
                                                            e.target.value,
                                                          )
                                                        }
                                                      />
                                                    </label>
                                                  </div>
                                                  <div className="mypage-register-row">
                                                    <span className="mypage-register-label-text">
                                                      알레르기 정보
                                                    </span>
                                                    <div className="mypage-allergy-grid">
                                                      {ALLERGY_TEXT_LIST.map(
                                                        (
                                                          label,
                                                          idx3,
                                                        ) => (
                                                          <button
                                                            key={`edit-option-item-allergy-${idx3}`}
                                                            type="button"
                                                            className={
                                                              'mypage-allergy-chip' +
                                                              (editOptionItemAllergies.includes(
                                                                idx3,
                                                              )
                                                                ? ' active'
                                                                : '')
                                                            }
                                                            onClick={() =>
                                                              toggleEditOptionItemAllergy(
                                                                idx3,
                                                              )
                                                            }
                                                          >
                                                            {label}
                                                          </button>
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="mypage-register-row">
                                                    <label className="mypage-register-label">
                                                      추가 금액
                                                      <input
                                                        className="mypage-register-input"
                                                        type="number"
                                                        min="0"
                                                        step="100"
                                                        value={
                                                          editOptionItemPrice
                                                        }
                                                        onChange={e =>
                                                          setEditOptionItemPrice(
                                                            e.target.value,
                                                          )
                                                        }
                                                      />
                                                    </label>
                                                  </div>
                                                  <div className="mypage-option-item-edit-actions">
                                                    <button
                                                      type="button"
                                                      className="mypage-register-cancel"
                                                      onClick={
                                                        handleCancelEditOptionItem
                                                      }
                                                      disabled={
                                                        editOptionItemLoading
                                                      }
                                                    >
                                                      취소
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="mypage-register-submit"
                                                      onClick={
                                                        handleApplyEditOptionItem
                                                      }
                                                      disabled={
                                                        editOptionItemLoading
                                                      }
                                                    >
                                                      {editOptionItemLoading
                                                        ? '적용 중...'
                                                        : '적용'}
                                                    </button>
                                                  </div>
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
                                    { }
                                    {activeOptionGroupId === option.id &&
                                      !isEditingMenu && (
                                        <div className="mypage-option-item-create">
                                          {createOptionItemStep === 1 && (
                                            <>
                                              <div className="mypage-register-row">
                                                <label className="mypage-register-label">
                                                  옵션명
                                                  <input
                                                    className="mypage-register-input"
                                                    type="text"
                                                    placeholder="옵션명을 입력하세요 (예: 치즈 추가)"
                                                    value={
                                                      createOptionItemName
                                                    }
                                                    onChange={e =>
                                                      setCreateOptionItemName(
                                                        e.target.value,
                                                      )
                                                    }
                                                  />
                                                </label>
                                              </div>
                                              <div className="mypage-register-row">
                                                <label className="mypage-register-label">
                                                  간단한 설명
                                                  <textarea
                                                    className="mypage-register-input mypage-textarea"
                                                    placeholder="옵션에 대한 간단한 설명을 입력하면 알레르기 분석에 도움이 됩니다."
                                                    value={
                                                      createOptionItemDescription
                                                    }
                                                    onChange={e =>
                                                      setCreateOptionItemDescription(
                                                        e.target.value,
                                                      )
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
                                                    handleGuessOptionItemAllergies(
                                                      option,
                                                    )
                                                  }
                                                  disabled={
                                                    optionGuessLoading
                                                  }
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
                                                이 옵션을 선택했을 때 추가로 포함될
                                                수 있는 알레르기를 on/off 로
                                                조정해 주세요.
                                              </p>
                                              <div className="mypage-allergy-section">
                                                <div className="mypage-allergy-grid">
                                                  {ALLERGY_TEXT_LIST.map(
                                                    (label, idx4) => (
                                                      <button
                                                        key={`create-option-item-allergy-${idx4}`}
                                                        type="button"
                                                        className={
                                                          'mypage-allergy-chip' +
                                                          (createOptionItemAllergies.includes(
                                                            idx4,
                                                          )
                                                            ? ' active'
                                                            : '')
                                                        }
                                                        onClick={() =>
                                                          toggleCreateOptionItemAllergy(
                                                            idx4,
                                                          )
                                                        }
                                                      >
                                                        {label}
                                                      </button>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                              <div className="mypage-register-row">
                                                <label className="mypage-register-label">
                                                  추가 금액
                                                  <input
                                                    className="mypage-register-input"
                                                    type="number"
                                                    min="0"
                                                    step="100"
                                                    placeholder="예: 1000"
                                                    value={
                                                      createOptionItemPrice
                                                    }
                                                    onChange={e =>
                                                      setCreateOptionItemPrice(
                                                        e.target.value,
                                                      )
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
                                                  disabled={
                                                    registerOptionItemLoading
                                                  }
                                                >
                                                  이전
                                                </button>
                                                <button
                                                  type="button"
                                                  className="mypage-register-submit"
                                                  onClick={() =>
                                                    handleRegisterOptionItemClick(
                                                      option,
                                                    )
                                                  }
                                                  disabled={
                                                    registerOptionItemLoading
                                                  }
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
                                );
                              })}
                            </div>
                          )}
                        { }
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
      { }
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
              onError={handlePostcodeError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default MyPage;