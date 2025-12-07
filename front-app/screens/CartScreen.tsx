import { Alert, View, ScrollView, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCart } from '../providers/CartProvider';
import { RootStackParamList } from './Stack';
import CartCard from '../components/CartCard';

function CartScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Cart'>) {
  const cartCtx = useCart();

  const handleChangeOption = (cartIndex: number) => {
    Alert.alert('옵션 변경', '옵션 변경 화면으로 이동하면 됩니다(테스트).');
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
      </ScrollView>
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
});

export default CartScreen;