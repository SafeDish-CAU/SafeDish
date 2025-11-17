/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useCallback } from 'react';
import  NewAppScreen  from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ShareMenu, { ShareData } from 'react-native-share-menu';
import { parseStoreFromDeepLink } from './scripts/parsing';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import RootStack from './screen/RootStack';
import MainScreen from './screen/MainScreen';
import MenuList from './screen/MenuList';
import MenuDetail from './screen/MenuDetail';

export type RootStackParamList = {
    main : undefined;
    //store : undefined;
    store : {user: {}};
    //menu:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  console.log("APP RENDER STARTED");
  const isDarkMode = useColorScheme() === 'dark';

  const handleShare = useCallback(async (item?: ShareData) => {
    if (!item) return;

    const { data } = item;
    if (typeof data !== 'string') return;

    const store = await parseStoreFromDeepLink(data);
    if (!store) return;

    if (1) { // DEBUG
      console.log(`platform: ${store.platform} store_id: ${store.store_id}`)
    }

    // platform + store_id -> safedish 내 가게 id API 호출
    // 해당 가게 메뉴 페이지 이동
    // 어떤 라이브러리 쓰실지 몰라서 구현은 안했습니다. 저는 테스트할 때 @react-navigation/native-stack 썻어요
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => listener.remove();
  }, []);

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="main">
        <Stack.Screen name="main" component={MainScreen} />
        <Stack.Screen name="store" component={MenuList} />
        {/*}<Stack.Screen name="menu" component={MenuDetail} />*/}
      </Stack.Navigator>
    </NavigationContainer>

    /*
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
    */

  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const templateMap: Record<string, React.ComponentType<any>> = {
      'MenuList': MenuList,
      'MainScreen':MainScreen,
      //'MenuDetail':MenuDetail,
    };

  const Template = templateMap['MenuList'] || NewAppScreen;
  return (


    <View style={styles.container}>
      {/*
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
      */}
        <Template safeAreaInsets={safeAreaInsets} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
