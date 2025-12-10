import { View, ScrollView, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCart } from '../providers/CartProvider';
import { RootStackParamList } from './Stack';
import CartCard from '../components/CartCard';
import { createOrder } from '../api';
import { useUser } from '../providers/UserProvider';

function CartScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Cart'>) {
  const { canEnd } = route.params;

  const userCtx = useUser();
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
      <View style={styles.emptyWrapper}>
        <Text style={styles.emptyTitle}>장바구니가 비어있습니다.</Text>
        <Text style={styles.emptyDescription}>
          메뉴를 선택해서 안전한 음식을 채워보세요.
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.emptyButtonText}>메뉴 보러 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>{cartCtx.cart.storeName}</Text>
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
        <Text style={styles.totalPriceLabel}>주문 금액</Text>
        <Text style={styles.totalPriceText}>
          {totalPrice.toLocaleString()}원
        </Text>
      </View>

      <View style={styles.addBar}>
        {!canEnd && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              navigation.navigate('Memo');
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>주문하러 가기</Text>
          </TouchableOpacity>
        )}

        {canEnd && (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                navigation.navigate('Memo');
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryButtonText}>주문하러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (cartCtx.cart && userCtx?.user) {
                  const userId = userCtx.user.id;
                  for (const item of cartCtx.cart.items) {
                    createOrder(userId, item.menu.id, item.quantity);
                  }
                }
                cartCtx.clear();
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>주문 완료</Text>
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: 24,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  addMenuButton: {
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMenuText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPriceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4b26',
  },
  addBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ff4b26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4b26',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ff4b26',
  },
  emptyWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyButton: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ff4b26',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default CartScreen;