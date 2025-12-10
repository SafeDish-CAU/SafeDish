/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ShareMenu, { ShareData } from 'react-native-share-menu';
import { UserProvider } from './providers/UserProvider';
import { CartProvider } from './providers/CartProvider';
import { parseStoreFromDeepLink } from './utils/parsing';
import { getStoreIdByPlatform } from './api';
import Stack, { RootStackParamList } from './screens/Stack';
import CartScreen from './screens/CartScreen';
import TestScreen from './screens/TestScreen';
import MenuScreen from './screens/MenuScreen';
import HomeScreen from './screens/HomeScreen';
import MemoScreen from './screens/MemoScreen';
import StoreScreen from './screens/StoreScreen';
import LocationScreen from './screens/LocationScreen';

function App() {
  const navRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const [navReady, setNavReady] = useState(false);
  const pendingStoreRef = useRef<number | null>(null);

  const navigateToStore = useCallback((storeId: number) => {
    if (navRef.current?.isReady()) {
      navRef.current.navigate('Store', { storeId });
    } else {
      pendingStoreRef.current = storeId;
    }
  }, []);

  const handleShare = useCallback(async (item?: ShareData) => {
    if (!item) return;

    const { data } = item;
    if (typeof data !== 'string') return;

    const store = await parseStoreFromDeepLink(data);
    if (!store) return;

    const storeId = await getStoreIdByPlatform(store.platform, store.storeId);
    if (!storeId) return;

    navigateToStore(storeId);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (navReady && pendingStoreRef.current) {
      navRef.current?.navigate('Store', { storeId: pendingStoreRef.current });
      pendingStoreRef.current = null;
    }
  }, [navReady]);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <NavigationContainer ref={navRef} onReady={() => setNavReady(true)}>
            <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen
                name='Home'
                component={HomeScreen}
                options={({ route }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen name='Store' component={StoreScreen} />
              <Stack.Screen name='Menu' component={MenuScreen} />
              <Stack.Screen
                name='Memo'
                component={MemoScreen}
                options={({ route }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name='Cart'
                component={CartScreen}
                options={({ route }) => ({
                  title: '장바구니',
                })}
              />
              <Stack.Screen
                name='Location'
                component={LocationScreen}
                options={({ route }) => ({
                  title: '주소 설정',
                })}
              />
              <Stack.Screen name='Test' component={TestScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;
