//  import { useNavigation } from '@react-navigation/native';
//  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//  import {RootStackNavigationProp} from './RootStack';

//  type props = NativeStackScreenProps<RootStackNavigationProp, 'Menu'>;

import React, { useEffect, useCallback, useMemo} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { StatusBar, SafeAreaView, StyleSheet, useColorScheme, View, Text, FlatList } from 'react-native';
import AllergyTagList, {AllergyTag}  from '../scripts/Data/AllergyTag'
import {TestData} from '../scripts/Data/TestData'

const Data = TestData;// 테스트 데이터 대입


const maxMaterialNum = 5; // 임시로 5개로 배치, material을 넣는 최대 갯수



const Item = ({ DATA }) => {
  const materialArray = Object.entries(DATA.allergy_materials);
  const sortedMaterials = materialArray.sort((a, b) => b[1] - a[1]);
  const Materials = sortedMaterials.slice(0, maxMaterialNum);

  return (
  <>
    <View style={styles.menuItem}>
      <Text style={styles.menuTitle}>{DATA.title}</Text>
      <Text style={styles.menuTitle}>{DATA.price}</Text>
    </View>
    <AllergyTagList MaterialList = {Materials} />
  </>
  );
  };


function MenuList(){

  const ListHeader = () => (
        <View>
          <View style={styles.cyanBanner} />
        </View>
      );

  const renderItem=({item}) => (
    <View>
      <Item DATA={item} />
    </View>
  );


  // const navigation = useNavigation<RootStackNavigationProp>();
  return(

    <SafeAreaView style={styles.container}>
    <>
        {/* 메뉴바 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>가게 이름</Text>
        </View>

        {/* 임의 이미지 */}

      </>
    <FlatList
      data = {Data}
      renderItem = {renderItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeader}
      style={{flex:1}}
    />


  </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
  },

  menuItem: {
    padding: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexWrap: 'wrap',
  },
  menuTitle:{
    fontSize: 20,
    fontWeight: "700",
  },
  tagsContainer:{
    padding: 15,
    borderBottomWidth:1.5,
    borderColor: '#aaa',
    flexWrap: 'wrap',
  },
  optionsContainer: {
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#fafafa',
  },
  dropdown: {
      height: 45,
      width: '90%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
  },
    placeholderStyle: {
      fontSize: 16,
      color: '#999',
  },
    selectedTextStyle: {
      fontSize: 16,
      color: '#000',
  },
  text: {
    fontSize: 16,
  },
  cyanBanner: {
      height: 200,
      backgroundColor: 'cyan',
      width: '100%',
    },



});


export default MenuList;