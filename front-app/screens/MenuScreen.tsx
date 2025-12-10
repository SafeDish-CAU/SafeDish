import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, ActivityIndicator, View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUser } from '../providers/UserProvider';
import { useCart } from '../providers/CartProvider';
import { RootStackParamList } from './Stack';
import { getMenu, GetMenuResponse } from '../api';
import OptionCard from '../components/OptionCard';

type AllergyData = {
  code: number;
  level: number;
};

type OptionItemData = {
  id: number;
  name: string;
  price: number;
  allergies: AllergyData[];
  selected: boolean;
};

type OptionGroupData = {
  id: number;
  name: string;
  minSelected: number;
  maxSelected: number;
  items: OptionItemData[];
};

type MenuData = {
  id: number;
  name: string;
  price: number;
  allergies: AllergyData[];
  options: OptionGroupData[];
};

function MenuScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Menu'>) {
  const { storeId, storeName, menuId, cartIdx } = route.params;

  const [menu, setMenu] = useState<MenuData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState(0);
  const [applying, setApplying] = useState(false);
  const userCtx = useUser();
  const cartCtx = useCart();
  const isEditMode = cartIdx && cartCtx?.cart && cartIdx < cartCtx.cart.items.length;

  let initQuantity = 1;
  if (cartIdx != null && cartCtx?.cart && storeId == cartCtx.cart.storeId && cartIdx < cartCtx.cart.items.length) {
    initQuantity = cartCtx.cart.items[cartIdx].quantity;
  }
  const [quantity, setQuantity] = useState(initQuantity);

  const finalPrice = totalPrice * quantity;

  const parseData = (resData: GetMenuResponse) => {
    const userAllergies = Array(25).fill(0);
    for (let i = 0; i < 25; i++) {
      if (userCtx?.user?.allergies?.[i]) {
        userAllergies[i] = 1;
      }
    }

    const menuData: MenuData = {
      id: resData.id,
      name: resData.name,
      price: resData.price,
      allergies: [],
      options: [],
    };

    for (const elem of resData.allergies) {
      const code = elem.code;
      if (userAllergies[code]) {
        menuData.allergies.push({
          code: code,
          level: 2,
        });
      }
    }

    for (const group of resData.options) {
      const groupData: OptionGroupData = {
        id: group.id,
        name: group.name,
        minSelected: group.minSelected,
        maxSelected: group.maxSelected,
        items: [],
      };

      group.items.forEach((item, index) => {
        let selected = false;
        if (isEditMode) {
          const cartItem = cartCtx.cart!.items[cartIdx];
          const cartGroup = cartItem.menu.options.find(opt => opt.id === group.id);
          const cartOptionItem = cartGroup?.items.find(optItem => optItem.id === item.id);
          selected = !!cartOptionItem?.selected;
        } else {
          if (group.minSelected === 1 && index === 0) {
            selected = true;
          }
        }

        const itemData: OptionItemData = {
          id: item.id,
          name: item.name,
          price: item.price,
          allergies: [],
          selected: selected,
        };

        for (const elem of item.allergies) {
          const code = elem.code;
          if (userAllergies[code]) {
            itemData.allergies.push({
              code,
              level: 2,
            });
          }
        }

        groupData.items.push(itemData);
      });

      menuData.options.push(groupData);
    }

    return menuData;
  };

  const handleToggle = (groupIndex: number, itemIndex: number) => {
    setMenu(value => {
      if (!value) return value;

      const newGroups = value.options.map((group, gi) => {
        if (gi != groupIndex) return group;
        if (group.items.length <= itemIndex) return group;

        const items = [...group.items];
        if (group.maxSelected == 1) {
          return {
            ...group,
            items: items.map((item, ii) => ({
              ...item,
              selected: itemIndex == ii,
            })),
          };
        }

        const target = items[itemIndex];
        const selectedCnt = items.filter(item => item.selected).length;
        const willSelect = !target.selected;

        if (willSelect && group.maxSelected && selectedCnt >= group.maxSelected) {
          Alert.alert('알림', `최대 ${group.maxSelected}개까지 선택 가능합니다.`);
          return group;
        }

        items[itemIndex] = { ...target, selected: willSelect };
        return { ...group, items };
      });

      return { ...value, options: newGroups };
    });
  };

  const handleApply = () => {
    if (!menu) return;
    if (applying) return;

    setApplying(true);
    try {
      const newGroups = [];
      for (const group of menu.options) {
        const newItems = [];
        for (const item of group.items) {
          const newItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            selected: item.selected,
          };

          newItems.push(newItem);
        }

        const newGroup = {
          id: group.id,
          name: group.name,
          minSelected: group.minSelected,
          maxSelected: group.maxSelected,
          items: [...newItems],
        };

        newGroups.push(newGroup);
      }

      const newMenu = {
        quantity: quantity,
        menu: {
          id: menu.id,
          name: menu.name,
          price: menu.price,
          options: [...newGroups],
        }
      };

      if (cartIdx != null) {
        cartCtx?.editAt(cartIdx, newMenu);
      } else {
        cartCtx?.push(storeId, storeName, newMenu);
      }
      navigation.navigate('Store', { storeId });
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(undefined);

      const resData = await getMenu(menuId);
      if (!cancelled) {
        if (resData) {
          const menuData = parseData(resData);
          setMenu(menuData);
        } else {
          setError('SafeDish 서버가 현재 이용 불가능하거나 너무 혼잡합니다.');
        }
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [menuId]);

  useEffect(() => {
    setTotalPrice((menu?.price ?? 0) +
      (menu?.options ?? []).reduce((sum, group) => {
        return (
          sum +
          group.items
            .filter(i => i.selected)
            .reduce((s, item) => s + item.price, 0)
        );
      }, 0));
  }, [menu]);

  useLayoutEffect(() => {
    if (menu) {
      navigation.setOptions({
        title: `${storeName}`,
        headerShown: true,
      });
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, menu]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.centerText}>메뉴 정보를 불러오는 중입니다…</Text>
      </View>
    );
  }

  if (error || !menu) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>{error ?? '메뉴 정보를 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuName}>{menu.name}</Text>
          <Text style={styles.menuPrice}>{menu.price.toLocaleString()}원</Text>
        </View>
        <View style={styles.divider} />
        {menu.options.map((group, index) => (
          <View key={group.id} style={styles.groupSpacing}>
            <OptionCard
              groupIndex={index}
              id={group.id}
              name={group.name}
              minSelected={group.minSelected}
              maxSelected={group.maxSelected}
              items={group.items}
              onToggle={handleToggle}
            />
          </View>
        ))}
        <View style={{ height: 96 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>수량</Text>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}개</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setQuantity(q => q + 1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.totalPriceText}>
          합계 {finalPrice.toLocaleString()}원
        </Text>
      </View>

      <View style={styles.addBar}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.9}
          onPress={handleApply}
        >
          <Text style={styles.addButtonText}>
            {cartIdx != null ? '옵션 변경하기' : '장바구니 담기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  menuName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f7',
  },
  groupSpacing: {
    marginTop: 8,
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 8,
    height: 32,
    backgroundColor: '#ffffff',
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyButtonText: {
    fontSize: 18,
    color: '#222222',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#222222',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4b26',
    textAlign: 'right',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  centerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  addBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  addButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ff4b26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});


export default MenuScreen;