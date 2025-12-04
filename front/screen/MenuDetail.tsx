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

import {CheckBox, ListItem, Button} from '@rneui/themed';

type MenuRouteProp = RouteProp<RootStackParamList, 'menu'>;
type MenuNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'menu'
>;


 const Item = ({ DATA, Data2, check, setter}) => {
   const listItem = {...DATA};
   console.log(listItem)
   //{() => navigation.navigate('menu')}>
   return (
   <ListItem>
     <ListItem.Content style={{
         paddingBottom: 0,
         margin:0,
         }}>
       <View style = {{flexDirection:'row',
           alignItems:'center',
           justifyContent:'space-between',
           width:"100%", }}>
           <CheckBox
                checked = {check}
                onPress = {()=>setter(DATA.option_id)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#ff3d00"
                title = {DATA.option_name}
                />
           <ListItem.Subtitle>{`+ ${DATA.option_price}원`}</ListItem.Subtitle>
       </View>
       <AllergyTagList2 maxLen = {2} menuList = {Data2}/>
     </ListItem.Content>
   </ListItem>

   );
   // Chevron : 리스트 우측의 화살표(Touchable은 아님)
 };


const DataProcess = (option, UserData) => {
    const optionLocal = [...option]
    console.log("DPoption", option);
    const userAllergy = UserData.user_allergy;
    const result = optionLocal.map(item => {
        const optionAllergy = item.option_allergies.map(item => item.allergy_code);
        const HlevAllergy= optionAllergy.filter(item2=>userAllergy.includes(item2));
        const LlevAllergy= optionAllergy.filter(item2=>!userAllergy.includes(item2));
        return ({...item, H_levAllergy: HlevAllergy, L_levAllergy: LlevAllergy});
        })

    console.log("result", result);
    return result
}

let flag = false;

export function MenuDetail(){

    const route = useRoute<MenuRouteProp>();
    const [menuID, setMenuId] = useState(route.params.menuId);

    const {UserData, UserNameSetter, AllergySetter, CartAdder} = useUserData();
    const [Data, setData] = useState(TestData2.menus[menuID-4]);
    const navigation = useNavigation<MenuNavigationProp>();
    const [Checked, setChecked] = useState({});

    console.log("DataProcess is:", DataProcess);
    useEffect(() => {
        setMenuId(route.params.menuId);
        console.log("MenuDetail got ID ::", menuID);
    },[route.params.menuId]);

    useEffect(() => {
        ("MenuDetail will load menuID ::", menuID);
        const load = async() =>{
            const loaded = await getStoreMenu(menuID);
            console.log("MenuDetails menu loaded, :: ", loaded);
            setData(loaded);
            }
        load();
    }, [menuID]);

    const processed = useMemo(() => {
        if(Data){
        console.log("Processed UseMemo", Data.menu_id)
        return DataProcess(Data.menu_options, UserData)
        }
        else return undefined;
    }, [Data]);

    //  기존 체크박스 체크여부 초기화 +
    useEffect(() => {
        if(Data){
        const init = {};
        Data.menu_options.forEach(item => (init[item.option_id] = false));
        setChecked(init);
        }
        }, [Data]);

    // 체크박스 설정함수
    const toggle = (id) => {
        setChecked(prev => ({
            ...prev,
            [id]:!prev[id],
            }));
    };
    // 디버깅용
    if(flag == false){
        flag = true;
        console.log(Data.menu_options)
        }

    //Item에 전달하기위한 함수
    const renderItem=({item}) => (
       <Item DATA={item.menu}
            Data2 = {item.allergy}
            check = {Checked[item.menu.option_id]}
            setter = {()=>toggle(item.menu.option_id)}
        />
   );

    const usedData = useMemo(() => {
        if(Data){
        return (
            Data.menu_options.map((item, index) => ({
                menu : item,
                allergy : processed[index] ?? null,
            })
        ))}
        else return undefined;
    }, [Data, processed]);


    // userData.CartAdder 사용전용 함수.
    const SendToUserCart = () => {
        const base = {
          "menu_id": Data.menu_id,
          "menu_name": Data.menu_name,
          "menu_price": Data.menu_price,

          "optionList": Data.menu_options.filter(
            item => Checked[item.option_id]
            ).map(item2 =>({
                "option_id": item2.option_id,
                "option_name": item2.option_name,
                "option_price": item2.option_price,
                }))
        }

        CartAdder({menu:base});
        //console.log(UserData.user_cart);
    }

    if(!Data) return;
    return(
        <SafeAreaView style={styles.container}>
          <View style={{height:200, marginBottom:50, backgroundColor:"#ffeecc"}}>
              <Text> {Data.menu_name}</Text>
              <Text> {Data.menu_price}</Text>
          </View>
          <View style={{height:400, backgroundColor:"#eee"}}>
              <FlatList
                    data ={usedData}
                    renderItem = {renderItem}
                    keyExtractor={item => item.menu.option_id}
                    showsVerticalScrollIndicator={false}
                    style={{flex:1}}
                  />
          </View>

          <Button title="주문내역 저장하기" onPress={SendToUserCart}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: '#fff',
  },
  });