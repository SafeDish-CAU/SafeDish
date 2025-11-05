//  import { useNavigation } from '@react-navigation/native';
//  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//  import {RootStackNavigationProp} from './RootStack';

//  type props = NativeStackScreenProps<RootStackNavigationProp, 'Menu'>;

/*

TODO :



*/

import React, { useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { StatusBar, SafeAreaView, StyleSheet, useColorScheme, View, Text, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from '@react-native-community/checkbox';
import AllergyTagList, {AllergyTag}  from '../scripts/Data/AllergyTag';
import {TestData, TestUserData} from '../scripts/Data/TestData';

const Data = TestData;// 테스트 데이터 대입
const User = TestUserData; //테스트 유저 데이터

const maxMaterialNum = 5; // 임시로 5개로 배치, material을 넣는 최대 갯수

const uid = ' ';

//const sid = ' ';
//가게정보를 받아올 시 사용됨.
//페이지 진입시 받아오는 가게의 sid가 같은경우 DATAfilteringforUser를 사용하지 않음.


/* flat list */
//TODO : 사용자 정보에 맞게 DATA Filtering
// == 사용자 정보에 맞아야 DATA를 보여줌.
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


//TODO :: 3단계 이상의 TAG 존재시 List에서 Filter.
// 현재 
const filterOption = ({DATA, setDATA}) =>{
  const [isSelected, setSelection] = useState(false);
  const Origin = [...DATA]

  const filterLev3 = useMemo(() => {
    const baseData = [...DATA];
    const filterLev = 3

      const filteredData = baseData.filter(dict =>
        Object.values(dict)
          .some(innerDict => Object.keys(innerDict).some(value=>!userAllergy.includes(filterLev))
        )
      );
    )
  }, [DATA, setDATA]);

  useEffect (() => {
    const isEqual = filterLev3.every((item, index) => item.id ===DATA[index].id);
    if(!isEqual){
      setDATA(filterLev3);
    }
    }, [sortMenu, setDATA]);

  return(


  );
  }

/*dropdown */
// 정렬 기준을 결정하도록 하고, 그에 맞게 정렬
const SortOption = ({DATA, setDATA}) =>{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('title');
    const [items, setItems] = useState([
        { label : '이름 순', value: 'title'},
        { label : '가격 순', value: 'price'},
        {label : '안전도 순', value: 'allergy'},
        ])

    const sortMenu = useMemo(() => {
        const sorted = [...DATA];
        switch(value){
        case 'title':
            sorted.sort((a,b)=>a.title.localeCompare(b.title));
            break;
        case 'price':
            sorted.sort((a,b)=> a.price-b.price);
            break;
        case 'allergy':
            sorted.sort((a, b)=>{

                const aLevel = Object.values(a.allergy_materials)
                const bLevel = Object.values(b.allergy_materials)

                const aMax = aLevel.length ? Math.max(...aLevel) : -Infinity;
                const bMax = bLevel.length ? Math.max(...bLevel) : -Infinity;
                if(aMax != bMax) {
                    return aMax - bMax;
                }
                else{
                    const aCount = Object.keys(a.allergy_materials).length;
                    const bCount = Object.keys(b.allergy_materials).length;
                    return aCount-bCount;
                    }
            });
            break;
        default:
            break;
        }
        return sorted;
    }, [DATA, value]);

    useEffect (() => {
        const isEqual = sortMenu.every((item, index) => item.id ===DATA[index].id);
        if(!isEqual){
            setDATA(sortMenu);
        }
        }, [sortMenu, setDATA]);

    return(
      <View>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(value);
            setValue(newValue);
          }}
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
        )

    }


function MenuList(){
  const [DATA, setDATA] = useState([...Data]);

  {/* 유저 데이터로 필터링 */}
  useEffect(() => {
    const baseData = [...Data];
    const userData = [...User][0];
    const userAllergy = userData.allergy_materials;

    const filteredData = baseData.filter(dict =>
      Object.values(dict)
        .some(innerDict => Object.keys(innerDict).some(key=>userAllergy.includes(key))
      )
    );

    setDATA(filteredData);

  }, []);


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

        {/* 드롭 다운*/}
        <View style={styles.OptionContainer}>
          <SortOption DATA = {DATA} setDATA = {setDATA}/>
        </View>

    </>
    <FlatList
      data ={DATA}
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
      flex:1,
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



  OptionContainer:{
      backgroundColor: '#aaa',
      borderBottomWidth:2.5,
      borderColor : '#aaa',
      height:80,
      alignItems:'flex-end',
      justifyContent:'center',
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
    },
    dropdownContainer: {
      width: 120,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius:0,
      paddingVertical:0,
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


export default MenuList;