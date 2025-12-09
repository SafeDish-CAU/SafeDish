import { View, ScrollView, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCart } from '../providers/CartProvider';
import { RootStackParamList } from './Stack';
import CartCard from '../components/CartCard';

function CartScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Cart'>) {
  const cartCtx = useCart();

  const totalPrice =
    cartCtx?.cart?.items.reduce((sum, cartItem) => {
      const basePrice = cartItem.menu.price ?? 0;

      const optionsPrice = (cartItem.menu.options ?? []).reduce((groupSum, group) => {
        const selectedItems = group.items.filter(i => i.selected);
        const groupPrice = selectedItems.reduce((itemSum, item) => itemSum + (item.price ?? 0), 0);
        return groupSum + groupPrice;
      }, 0);

      const itemTotal = (basePrice + optionsPrice) * (cartItem.quantity ?? 1);

      return sum + itemTotal;
    }, 0) ?? 0;

  const handleChangeOption = (cartIndex: number) => {
    if (cartCtx?.cart && cartIndex < cartCtx.cart.items.length) {
      navigation.navigate('Menu', {
        storeId: cartCtx.cart.storeId,
        storeName: cartCtx.cart.storeName,
        menuId: cartCtx.cart.items[cartIndex].menu.id,
        cartIdx: cartIndex,
      });
    }
  };

  const handleIncrease = (cartIndex: number) => {
    if (cartCtx?.cart) {
      const item = cartCtx.cart.items[cartIndex];
      item.quantity += 1;
      cartCtx.editAt(cartIndex, item);
    }
  };

  const handleDecrease = (cartIndex: number) => {
    if (cartCtx?.cart) {
      const item = cartCtx.cart.items[cartIndex];
      item.quantity -= 1;
      cartCtx.editAt(cartIndex, item);
    }
  };

  const handleRemove = (cartIndex: number) => {
    if (cartCtx?.cart) {
      cartCtx.removeAt(cartIndex);
    }
  };

  if (!cartCtx?.cart) {
    return (
      <View>
        <Text>
          {'장바구니 비어있음'}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>
            {cartCtx.cart.storeName}
          </Text>
        </View>
        {cartCtx.cart.items.map((item, index) => (
          <CartCard
            key={index}
            cartIndex={index}
            quantity={item.quantity}
            menu={item.menu}
            onChangeOption={handleChangeOption}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        ))}
        <TouchableOpacity
          style={styles.addMenuButton}
          onPress={() => navigation.navigate('Store', { storeId: cartCtx.cart!.storeId })}
        >
          <Text style={styles.addMenuText}>+ 메뉴 추가</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Text style={styles.totalPriceText}>
          합계 {totalPrice.toLocaleString()}원
        </Text>
      </View>
      <View style={styles.addBar}>
        <Button
          title='주문하러 가기'
          onPress={() => {
            navigation.navigate('Memo');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  addMenuButton: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMenuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    textAlign: 'right',
  },
  addBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
});

export default CartScreen;