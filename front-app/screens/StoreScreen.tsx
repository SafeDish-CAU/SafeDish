import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Text, FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Stack';
import { useUser } from '../providers/UserProvider';
import { useCart } from '../providers/CartProvider';
import { getStore, GetStoreResponse } from '../api';
import MenuCard from '../components/MenuCard';
import AllergyTags from '../components/AllergyTags';
import CartButton from '../components/CartButton';

type AllergyData = {
  code: number;
  level: number;
};

type MenuData = {
  id: number;
  name: string;
  price: number;
  allergies: AllergyData[];
};

type StoreData = {
  id: number;
  name: string;
  menus: MenuData[];
};

function StoreScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Store'>) {
  const { storeId } = route.params;

  const [store, setStore] = useState<StoreData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isFiltered, setIsFiltered] = useState(false);
  const userCtx = useUser();
  const cartCtx = useCart();

  const userData = userCtx?.user?.allergies
    ?.map((value, index) => (value ? { code: index, level: 0 } : undefined))
    .filter((value) => !!value) ?? [];

  const cartCount = cartCtx?.cart && cartCtx.cart.storeId === storeId
    ? cartCtx.cart.items.length
    : 0;

  const isCartEmpty = cartCtx?.cart && cartCtx.cart.storeId === storeId
    ? cartCtx.cart.items.length == 0
    : true;

  const parseData = (resData: GetStoreResponse) => {
    const userAllergies = Array(25).fill(0);
    for (let i = 0; i < 25; i++) {
      if (userCtx?.user?.allergies?.[i]) {
        userAllergies[i] = 1;
      }
    }

    const storeData: StoreData = {
      id: resData.id,
      name: resData.name,
      menus: [],
    };

    for (const menu of resData.menus) {
      const menuData: MenuData = {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        allergies: [],
      };

      const allergyLevels: number[] = Array(25).fill(0);
      for (const elem of menu.allergies) {
        const code = elem.code;
        allergyLevels[code] = 2;
      }

      for (const group of menu.options) {
        for (const item of group.items) {
          for (const elem of item.allergies) {
            const code = elem.code;
            if (allergyLevels[code] == 0) allergyLevels[code] = 1;
          }
        }
      }

      const warns: AllergyData[] = [];
      const fatals: AllergyData[] = [];
      for (let i = 0; i < 25; i++) {
        const level = allergyLevels[i];
        const included = userAllergies[i];
        if (level == 0 || included == 0) continue;

        const allergyData: AllergyData = {
          code: i,
          level,
        };

        if (level == 1) {
          warns.push(allergyData);
        } else {
          fatals.push(allergyData);
        }
      }

      for (const elem of fatals) {
        menuData.allergies.push(elem);
      }
      for (const elem of warns) {
        menuData.allergies.push(elem);
      }

      storeData.menus.push(menuData);
    }

    return storeData;
  };

  const handleMenuPress = (menuId: number) => {
    if (store) {
      navigation.navigate('Menu', {
        storeId: store.id,
        storeName: store.name,
        menuId: menuId,
        cartIdx: undefined,
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(undefined);

      const resData = await getStore(storeId);
      if (!cancelled) {
        if (resData) {
          const storeData = parseData(resData);
          setStore(storeData);
        } else {
          setError('SafeDish 서버가 현재 이용 불가능하거나 너무 혼잡합니다.');
        }
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [storeId]);

  useLayoutEffect(() => {
    if (store) {
      navigation.setOptions({
        title: store.name,
        headerShown: true,
        headerRight: () => (
          <View style={{ paddingRight: 8, paddingTop: 2 }}>
            <CartButton
              count={cartCount}
              onPress={() => navigation.navigate('Cart', {
                canEnd: false,
              })}
            />
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, store, cartCount]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.centerText}>가게 정보를 불러오는 중입니다…</Text>
      </View>
    );
  }

  if (error || !store) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>{error ?? '데이터가 없습니다.'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('Store', { storeId })}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menusForDisplay = isFiltered
    ? store.menus.filter(menu => !menu.allergies.some(a => a.level === 2))
    : store.menus;

  return (
    <View style={styles.wrapper}>
      <View style={styles.inner}>
        <View style={styles.filterRow}>
          <View style={styles.allergyInfoContainer}>
            <View style={styles.allergyHeaderRow}>
              <Text style={styles.allergyInfoLabel}>내 알레르기 정보</Text>

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColorBox, styles.legendColorMain]}
                  />
                  <Text style={styles.legendText}>메인에 포함</Text>
                </View>

                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColorBox,
                      styles.legendColorOption,
                    ]}
                  />
                  <Text style={styles.legendText}>옵션에 포함</Text>
                </View>
              </View>
            </View>

            <View style={styles.filterListWrapper}>
              <AllergyTags allergies={userData} paddingTop={0} />
            </View>
          </View>

          <CheckBox
            checked={isFiltered}
            onPress={() => setIsFiltered(!isFiltered)}
            title='위험음식 제거'
            iconType='material-design'
            checkedIcon='checkbox-marked'
            uncheckedIcon='checkbox-blank-outline'
            checkedColor={'#ff4b26'}
            containerStyle={styles.filterCheckboxContainer}
            size={22}
            textStyle={styles.checkboxText}
          />
        </View>

        <FlatList
          data={menusForDisplay}
          renderItem={({ item }) => (
            <MenuCard menu={item} onPress={handleMenuPress} />
          )}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.orderButton,
            isCartEmpty && styles.orderButtonDisabled,
          ]}
          onPress={() => navigation.navigate('Memo')}
          activeOpacity={isCartEmpty ? 1 : 0.9}
          disabled={isCartEmpty}
        >
          <Text style={styles.orderButtonText}>주문하러 가기</Text>
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
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  allergyInfoContainer: {
    flex: 1,
  },
  allergyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  allergyInfoLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '700',
    marginRight: 8,
  },
  filterListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
    borderWidth: 1,
  },
  legendColorMain: {
    backgroundColor: '#ff4b26',
    borderColor: '#e03614',
  },
  legendColorOption: {
    backgroundColor: '#fff1ea',
    borderColor: '#ffb38a',
  },
  legendText: {
    fontSize: 11,
    color: '#555',
  },
  filterCheckboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginTop: 18,
    marginLeft: 4,
  },
  checkboxText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  orderButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ff4b26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  orderButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
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
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ff4b26',
  },
  retryButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});


export default StoreScreen;
