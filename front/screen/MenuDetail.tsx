import React, { useRef, useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { StatusBar, SafeAreaView, StyleSheet, useColorScheme, View, Text, FlatList } from 'react-native';
import {TestData, TestUserData, TestUserDataObject} from '../scripts/Data/TestData';
import { RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../App';

/*
type MenuRouteProp = RouteProp<RootStackParamList, 'menu'>;


function MenuDetail(){
    const route = useRoute<MenuRouteProp>();
    const menuID = route.params.MID;

    return(
        <SafeAreaView style={styles.container}>
          <Text> "MenuID : ", {menuID}</Text>
        </SafeAreaView>
        )
    }*/