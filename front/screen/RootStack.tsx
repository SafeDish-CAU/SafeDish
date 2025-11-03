/*
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import {MenuList} from './MenuList';


type RootStackParamList = {
  Home: undefined:
  Detail:{
    id: number;
  };
};


export type RootStackNavigationProp= nativeStackNavigationProp<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();


const RootStack = () =>{
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuList} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default RootStack;
*/