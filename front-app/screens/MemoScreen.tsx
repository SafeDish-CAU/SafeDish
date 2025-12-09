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
      navigation.replace('Cart');
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
        <Text style={styles.infoText}>PIP 모드는 안드로이드에서만 지원됩니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pipContainer}>
      {memos.length === 0 ? (
        <Text style={styles.emptyText}>장바구니에 담긴 메뉴가 없습니다.</Text>
      ) : (
        memos.map((m, index) => (
          <Memo
            key={index}
            name={m.name}
            qty={m.qty}
            option={m.option}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#222',
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
  },
  pipContainer: {
    flex: 1,
    // backgroundColor: '#222',
    padding: 8,
    justifyContent: 'flex-start',
  },
  emptyText: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default MemoScreen;
