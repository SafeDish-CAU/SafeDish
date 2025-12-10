import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import PipHandler, { usePipModeListener } from '@videosdk.live/react-native-pip-android';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Stack';
import { useCart } from '../providers/CartProvider';
import Memo from '../components/Memo';

function MemoScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Memo'>) {
  const hasBeenInPip = useRef(false);
  const isPipMode = usePipModeListener();
  const cartCtx = useCart();

  useEffect(() => {
    if (Platform.OS == 'android') {
      PipHandler.setMeetingScreenState(true);
      PipHandler.setDefaultPipDimensions(4, 3);
      PipHandler.enterPipMode();

      return () => {
        PipHandler.setMeetingScreenState(false)
      };
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    if (isPipMode) {
      hasBeenInPip.current = true;
    } else if (hasBeenInPip.current) {
      navigation.replace('Cart', {
        canEnd: true,
      });
    }
  }, [isPipMode, navigation]);

  const memos =
    cartCtx?.cart?.items.map((item) => {
      const name = item.menu.name;
      const qty = item.quantity;

      const selectedOptionNames: string[] = [];
      for (const group of item.menu.options) {
        const selectedItems = group.items.filter((opt) => opt.selected);
        if (selectedItems.length > 0) {
          selectedOptionNames.push(...selectedItems.map((opt) => opt.name));
        }
      }

      const option =
        selectedOptionNames.length > 0
          ? selectedOptionNames.join(', ')
          : undefined;

      return { name, qty, option };
    }) ?? [];

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text style={styles.infoTitle}>PIP 모드는 안드로이드에서만 지원됩니다.</Text>
        <Text style={styles.infoDescription}>
          주문 메모는 장바구니에서 바로 확인하실 수 있어요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.pipContainer}>
      {memos.length === 0 ? (
        <Text style={styles.emptyText}>장바구니에 담긴 메뉴가 없습니다.</Text>
      ) : (
        <>
          <Text style={styles.pipTitle}>주문 메모</Text>
          <View style={styles.listWrapper}>
            {memos.map((m, index) => (
              <Memo
                key={index}
                name={m.name}
                qty={m.qty}
                option={m.option}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
  },
  pipContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
  },
  pipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff4b26',
    marginBottom: 4,
  },
  listWrapper: {
    flexShrink: 1,
  },
  emptyText: {
    fontSize: 12,
    color: '#555555',
  },
});

export default MemoScreen;
