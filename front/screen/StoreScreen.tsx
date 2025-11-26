import React, { useRef, useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { TouchableOpacity, StatusBar, SafeAreaView, StyleSheet, useColorScheme, View, Text, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AllergyTagList, {AllergyTagList2, AllergyTag}  from '../scripts/Data/AllergyTag';
import {TestData, TestData2, TestUserData, TestUserDataObject} from '../scripts/Data/TestData';
import {useUserData} from '../scripts/Data/userData';
import {getStoreMenu} from '../scripts/Data/api';
import { RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../App';

import {CheckBox, ListItem} from '@rneui/themed';

const maxMaterialNum = 5; // 임시로 5개로 배치, material을 넣는 최대 갯수



type StoreRouteProp = RouteProp<RootStackParamList, 'store'>;

const dataProcess = (baseData, userData) => {
    const baseMenu = [...baseData.menus]
    const middle = baseMenu.map(menu=>[menu.menu_id, menu.menu_options.map(op=>op.option_allergies)]);
    const processed = baseMenu.map(menu => ({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        menu_price: menu.menu_price,
        menu_allergies: menu.menu_allergies.map(al => al.allergy_code),
        option_allergies : menu.menu_options.flatMap(op=>op.option_allergies.map( a=> a.allergy_code)),
        }));
    //console.log(processed);
    const addOption = processed.map(menu => ({
        ...menu,
        option_allergies : menu.option_allergies.filter(
            item => !menu.menu_allergies.includes(item)
            ),
        }));
    //console.log(addOption);
    //hlevAllergy : 음식에 쓰이는 재료 + 유저 알러지인 재료
    //llevAllergy : option에 들어가는 재료 or 음식에 들어가지만 알러지가 아닌 재료
    const result = addOption.map(menu => ({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        menu_price: menu.menu_price,
        H_levAllergy : menu.menu_allergies.filter(item => userData.user_allergy.includes(item)),
        L_levAllergy : menu.menu_allergies.filter(item => !userData.user_allergy.includes(item)).concat(menu.option_allergies),
        })
        )
    //console.log(result);
    return result;
}

//여러 기준으로 정렬
const dataSort = (baseList, orderType) => {
    const baseMenus = [...baseList]
    switch(orderType){
        case 'title':
            baseMenus.sort((a,b)=>a.menu_name.localeCompare(b.menu_name));
            break;
        case 'price':
            baseMenus.sort((a,b)=> a.menu_price-b.menu_price);
            break;
        case 'allergy':
            baseMenus.sort((a, b)=>{
                if(a.H_levAllergy.length == b.H_levAllergy.length)
                    return a.L_levAllergy.length - b.L_levAllergy.length;
                else
                    return a.H_levAllergy.length - b.H_levAllergy.length;
            });
            break;
        default:
            break;
        }
    return baseMenus;
    }

//위험음식을 거르기위한 체크박스의 onpress
const dataFilter=(baseList) =>{
    const baseMenus = [...baseList];
    const result = baseMenus.filter(item => item.H_levAllergy.length == 0);
    console.log('dataFilter', result)
    return result;
}


const Item = ({ DATA }) => {
  const listItem = {...DATA};
  //{() => navigation.navigate('menu')}>
  return (
  <ListItem bottomDivider onPress = {() => console.log("listPressed", DATA.menu_name)}>
    <ListItem.Content style={{ paddingBottom: 0 }}>
      <ListItem.Title>{DATA.menu_name}</ListItem.Title>
      <ListItem.Subtitle>{`${DATA.menu_price}원`}</ListItem.Subtitle>
      <AllergyTagList2 maxLen = {5} menuList = {listItem}/>
    </ListItem.Content>
    <ListItem.Chevron size = {35} color="#aaaaaa" />
  </ListItem>

  );
  // Chevron : 리스트 우측의 화살표(Touchable은 아님)
};

const renderItem=({item}) => (
  <Item DATA={item} />
  );

export function StoreScreen (){
    const [open, setOpen] = useState(false);
    const [sortOption, setSortOption] = useState('title');
    const [items, setItems] = useState([
        { label : '이름 순', value: 'title'},
        { label : '가격 순', value: 'price'},
        {label : '안전도 순', value: 'allergy'},
        ])
    // states for dropdown

    const [isFiltered, setFiltered] = useState(false);

    const [BaseData, setBaseData] = useState(TestData2);
    const {UserData, UserNameSetter, AllergySetter} = useUserData();
    //console.log(BaseData);
    // 데이터 재가공
    const processedData = useMemo(() =>
        dataProcess(BaseData, UserData),
        [BaseData, UserData]);
    // 데이터 정렬
    const sortedData = useMemo(() =>
        dataSort(processedData, sortOption),
        [processedData, sortOption]);
    // 데이터 필터링
    const filteredData = useMemo(() =>
        {
        console.log('filtered');
        return (isFiltered?
        dataFilter(sortedData):
        sortedData);

        }, [sortedData, isFiltered]);

    //console.log(processedData)
    //console.log(sortedData)
    //console.log(filteredData)
    //console.log(Array.isArray(filteredData))

    return(
      <SafeAreaView style={styles.container}>
        <>
        <View style={styles.OptionContainer}>
          <View>
          <DropDownPicker
            open={open}
            value={sortOption}
            items={items}
            setOpen={setOpen}
            setValue={setSortOption}
            setItems={setItems}

            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            labelStyle={styles.label}
            placeholderStyle={styles.placeholder}
            arrowIconStyle={styles.arrow}
            tickIconStyle={styles.tick}
            selectedItemLabelStyle={styles.selectedLabel}
          />
          </View>


          <CheckBox
            checked={isFiltered}
            onPress={() => setFiltered(!isFiltered)}
            title="위험음식 제거"
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="#747999"
            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding:0}}
          />
        </View>

        <FlatList
          data ={filteredData}
          renderItem = {renderItem}
          keyExtractor={item => item.menu_id}
          showsVerticalScrollIndicator={false}
          style={{flex:1}}
        />
        </>
      </SafeAreaView>
        );
    }



const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: '#fff',
  },
  header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop:20,
  },


  OptionContainer:{
      backgroundColor: '#ff6e60',
      borderBottomWidth:0,
      height:80,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingRight : 30,

    },
    dropdown: {
      height: 45,
      width:120,
      backgroundColor: '#f0f0f0',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 0,
      paddingHorizontal: 10,
      paddingVertical:0,
      marginLeft:20,
    },
    dropdownContainer: {
      width: 120,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius:0,
      paddingVertical:0,
      marginLeft:20,
    },
    label: {
      fontSize: 16,
      color: '#333',
    },
    placeholder: {
      color: '#999',
    },
    arrow: {
      tintColor: '#333',
    },
    tick: {
      tintColor: '#007AFF',
    },
    selectedLabel: {
      fontWeight: 'bold',
      color: '#007AFF',
    },

});



/*
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
      height: 0,
      backgroundColor: 'cyan',
      width: '100%',
    },
*/