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


 const Item = ({ DATA , check, setter}) => {
   const listItem = {...DATA};
   console.log(listItem)
   //{() => navigation.navigate('menu')}>
   return (
   <ListItem>
     <ListItem.Content style={{ paddingBottom: 0,flexDirection:'row',
                                                       alignItems:'center',
                                                       justifyContent:'space-between',}}>
       <CheckBox
            checked = {check}
            onPress = {()=>setter(DATA.option_id)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="#ff3d00"
            title = {DATA.option_name}
            />
       <ListItem.Subtitle>{`+ ${DATA.option_price}원`}</ListItem.Subtitle>
      </ListItem.Content>
   </ListItem>

   );
   // Chevron : 리스트 우측의 화살표(Touchable은 아님)
 };


let flag = false;

export function MenuDetail(){

    const [Data, setData] = useState(TestData2.menus[3]);
    const navigation = useNavigation<MenuNavigationProp>();
    const route = useRoute<MenuRouteProp>();
    const menuID = route.params.MID;
    const [Checked, setChecked] = useState({});

    useEffect(() => {
        const init = {};
        Data.menu_options.forEach(item => (init[item.option_id] = false));
        setChecked(init);
        }, [Data]);

    const toggle = (id) => {
        setChecked(prev => ({
            ...prev,
            [id]:!prev[id],
            }));
    };

    if(flag == false){
        flag = true;
        console.log(Data.menu_options)
        }

    const renderItem=({item}) => (
       <Item DATA={item}
            check = {Checked[item.option_id]}
            setter = {()=>toggle(item.option_id)}
        />
   );


    return(
        <SafeAreaView style={styles.container}>
          <View style={{height:250}}>
              <Text> {Data.menu_name}</Text>
              <Text> {Data.menu_price}</Text>
          </View>
          <View style={{height:600, backgroundColor:"#eee"}}>
              <FlatList
                    data ={Data.menu_options}
                    renderItem = {renderItem}
                    keyExtractor={item => item.option_id}
                    showsVerticalScrollIndicator={false}
                    style={{flex:1}}
                  />
          </View>

          <Button title="주문내역 저장하기" onPress={() => {console.log(Data.menu_id)}}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: '#fff',
  },
  });