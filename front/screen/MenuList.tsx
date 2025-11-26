//  import { useNavigation } from '@react-navigation/native';
//  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//  import {RootStackNavigationProp} from './RootStack';

//  type props = NativeStackScreenProps<RootStackNavigationProp, 'Menu'>;

/*

TODO :
전체적 구조 수정
Component들이 메인의 State에 영향을 줄 수 있는 구조로 인해 불안정해질 수 있음.


*/

import React, { useRef, useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { TouchableOpacity, StatusBar, SafeAreaView, StyleSheet, useColorScheme, View, Text, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from '@react-native-community/checkbox';
import AllergyTagList, {AllergyTag}  from '../scripts/Data/AllergyTag';
import {TestData, TestUserData, TestUserDataObject} from '../scripts/Data/TestData';
import { RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../App';
let Data = TestData;// 테스트 데이터 대입
const Origin = [...Data] // 원래값 돌아가는 용도
let User = TestUserDataObject().getComponent(); //테스트 유저 데이터


const maxMaterialNum = 5; // 임시로 5개로 배치, material을 넣는 최대 갯수

const uid = ' ';

//const sid = ' ';
//가게정보를 받아올 시 사용됨.
//페이지 진입시 받아오는 가게의 sid가 같은경우 DATAfilteringforUser를 사용하지 않음.

type StoreRouteProp = RouteProp<RootStackParamList, 'store'>;

/* flat list */
//TODO : 사용자 정보에 맞게 DATA Filtering
// == 사용자 정보에 맞아야 DATA를 보여줌.
const Item = ({ DATA }) => {

  const materialArray = Object.entries(DATA.allergy_materials);
  const sortedMaterials = materialArray.sort((a, b) => b[1] - a[1]);
  const Materials = sortedMaterials.slice(0, maxMaterialNum);

  return (
  <>
    <TouchableOpacity onPress = {() => console.log("listPressed", DATA.title)}>//{() => navigation.navigate('menu')}>
    <View style={styles.menuItem}>
      <Text style={styles.menuTitle}>{DATA.title}</Text>
      <Text style={styles.menuTitle}>{DATA.price}</Text>
    </View>
    <AllergyTagList MaterialList = {Materials} />
    </TouchableOpacity>
  </>
  );
  };

{/* userData에 따른 Tag용 데이터 필터링*/}
const userFilter = ({Data, userData}) =>{
    console.log(userData);
    console.log("#userFilter =>", Data.map(item => item.allergy_materials));
    try{
    return Data.map(item=> ({
      ... item,
      allergy_materials: Object.fromEntries(
        Object.entries(item.allergy_materials).filter(
        ([key]) => userData.allergy_materials.includes(key)
        )
      ),
    }));
    } catch(error){
        console.log('runtime error occured :: userFilter');
        }
};


//TODO :: 3단계 이상의 TAG 존재시 List에서 Filter.
// 현재
const FilterOption = ({DATA, setDATA}) =>{
  const [isSelected, setSelection] = useState(false);
  const origin = useRef(DATA);

  useEffect (() => {
      origin.current = DATA;
      console.log("Filter Option =>", origin.current)
  }, [Data])

  const filterLev3 = () => {
    const baseData = [...DATA];
    const filterLev = 3

      const filteredData = isSelected == true?
      baseData.filter( item => {
        const levels = Object.values(item.allergy_materials);
        const maxLev = Math.max(...levels);
        return maxLev != 3;
      })
      : [...origin.current];
    return filteredData
  };

  useEffect (() => {
      setDATA(filterLev3());
    }, [isSelected]);

  return(
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
        <Checkbox
          value = {isSelected}
          onValueChange={() => setSelection(prev=>!prev)}
        />
        <Text style={{ marginLeft: 8 }}>위험 재료 필터링</Text>
      </View>

    </View>

  );
  }


/*dropdown */
// 정렬 기준을 결정하도록 하고, 그에 맞게 정렬
const SortOption = ({DATA, setDATA}) =>{
    const route = useRoute<StoreRouteProp>();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('title');
    const [items, setItems] = useState([
        { label : '이름 순', value: 'title'},
        { label : '가격 순', value: 'price'},
        {label : '안전도 순', value: 'allergy'},
        ])

    const sortMenu = useMemo(() => {
        try{
        const sorted = [...DATA];
        console.log("sorted");//, sorted);
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
        } catch(error){
                console.log('runtime error occured :: SortOption');
                }
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


//function MenuList({}){
function MenuList(){
  //const [user,setUser] = useState(userData);
  navigation = useNavigation<StoreRouteProp>();
  const [DATA, setDATA] = useState([...Data]);
  const [allergy, setAllergy] = useState([...User.allergy_materials]);

  const route = useRoute<StoreRouteProp>();
  const userData = route.params.user;

  User = userData;
  console.log("user allergyList");//, User);

  useEffect(()=>{
    const userFiltered = userFilter({Data:DATA, userData:User});
    if(JSON.stringify(userFiltered) !== JSON.stringify(DATA))
      setDATA(userFiltered);
  }, [DATA, User]);

  console.log("MenuList");//, User);
  //console.log("#3", DATA.map(item => item.allergy_materials));

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
  try{
  return(
    <SafeAreaView style={styles.container}>
    <>
        {/* 가게 헤더
        <View style={styles.header}>
          <Text style={styles.headerText}>가게 이름</Text>
        </View>
        */}

        {/* 임의 이미지 */}

        {/* 드롭 다운 및 체크박스*/}
        <View style={styles.OptionContainer}>
          <SortOption DATA = {DATA} setDATA = {setDATA}/>
          <FilterOption DATA = {DATA} setDATA = {setDATA} />
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
  } catch(error){
        console.warn('런타임 에러3');
        }
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
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-end',
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


{/* 유저 데이터로 필터링 */}

{/*
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
  */}

  /*
    const flag = useRef(true);

     const isChanged =()=>{
       const oldSet = new Set(allergy.map(item => item.id));
       const newSet = new Set(User.allergy_materials.map(item => item.id));

       return !(oldSet.size == newSet.size && [...oldSet].every(id=>newSet.has(id)));
     }

     useEffect (()=>{
       if (flag.current || isChanged()){
         if (flag.current) flag.current = false;
         const userFiltered = userFilter({Data:DATA, userData:User});
         setAllergy([...User.allergy_materials]);
         setDATA(userFiltered);
       }
     }, [Data, User]);
   */ // 실제 데이터 적용용도

   /*
   useEffect(()=>{
         const userFiltered = userFilter({Data:DATA, userData:User});
         setDATA(userFiltered);
       }, [Data, User]);
   */