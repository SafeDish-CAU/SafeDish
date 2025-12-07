import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Text, FlatList, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons'
import { CheckBox } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Stack';
import { useUser } from '../providers/UserProvider';
import { useCart } from '../providers/CartProvider';
import { getStore, GetStoreResponse } from '../api';
import MenuCard from '../components/MenuCard';

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

  const cartCount = cartCtx?.cart && cartCtx.cart.storeId === storeId
    ? cartCtx.cart.items.length
    : 0;

  const isCartEmpty = cartCtx?.cart && cartCtx.cart.storeId === storeId
    ? cartCtx.cart.items.length == 0
    : true;

  const parseData = (resData: GetStoreResponse) => {
    const userAllergies = Array(22).fill(0);
    for (let i = 0; i < 22; i++) {
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

      const allergyLevels: number[] = Array(22).fill(0);
      for (const elem of menu.allergies) {
        const code = elem.code;
        allergyLevels[code] = 2;
      }

      for (const group of menu.optionGroups) {
        for (const item of group.items) {
          for (const elem of item.allergies) {
            const code = elem.code;
            if (allergyLevels[code] == 0) allergyLevels[code] = 1;
          }
        }
      }

      const warns: AllergyData[] = [];
      const fatals: AllergyData[] = [];
      for (let i = 0; i < 22; i++) {
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
          <TouchableOpacity
            style={styles.cartIconContainer}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="shopping-cart" size={24} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>가게 정보를 불러오는 중입니다…</Text>
      </View>
    );
  }

  if (error || !store) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error ?? '데이터가 없습니다.'}</Text>
        <Button title='다시 시도' onPress={() => navigation.replace('Store', { storeId })} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View>
          <CheckBox
            checked={isFiltered}
            onPress={() => setIsFiltered(!isFiltered)}
            title='위험음식 제거'
            iconType='material-community'
            checkedIcon='checkbox-marked'
            uncheckedIcon='checkbox-blank-outline'
            checkedColor='#747999'
            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}
            size={32}
          />
        </View>
        <FlatList
          data={store.menus}
          renderItem={({ item }) => <MenuCard menu={item} />}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.bottomBar}>
        <Button
          title='주문하러 가기'
          onPress={() => {
            navigation.navigate('Memo');
          }}
          disabled={isCartEmpty}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  cartIconContainer: {
    marginRight: 12,
    marginTop: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default StoreScreen;
