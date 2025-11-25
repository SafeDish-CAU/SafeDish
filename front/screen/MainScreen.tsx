import React, { useRef, useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { StatusBar, SafeAreaView, StyleSheet, useColorScheme, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import {TestUserDataObject} from '../scripts/Data/TestData';
import {TAGS} from '../scripts/Data/AllergyTag';
import {useUserData} from '../scripts/Data/userData';

import { Button, CheckBox } from '@rneui/themed';

/*
    ***MainScreen***
    메인메뉴의 버튼 -> 유저 데이터로 연결
    별개로 데이터를 받아와 추천메뉴 띄워주기

*/

type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'main'
>;

const AllergySetterButton = ({tag, isPressed, pressFunc}) => {
    const onPress = () => {
      console.log("onPressed", isPressed, tag)
      if(isPressed) {
        pressFunc({mode:'remove', value:tag});
      }  else{
        pressFunc({mode:'add', value:tag})
      }
    };

    /* return(
      <View>
         <Button
          title={tag}
          type="solid"
          onPress = {onPress}
          color={isPressed? '#ff3d00':'#ffffff'}
          buttonStyle={{
              flex:1,
              //backgroundColor: isPressed? '#ff3d00':'#ffffff',
              borderWidth:2,
              borderColor:isPressed?'#ff3d00':'gray',
              borderRadius:15,
          }}
          containerStyle={{
              height:60,
              width: 60,
              margin:5
              }}
          titleStyle={{
            color: isPressed ? 'white' : 'black',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >

        </Button>
      </View>
    ); */

    return(
        <View>
          <TouchableOpacity
            style = {[
                styles.allergyButton,
                {backgroundColor: isPressed? '#ff3d00':'#eee'},
                ]}
            onPress = {onPress}
          >
          <Text style={styles.allergyButtonText}>{tag}</Text>
          </TouchableOpacity>
        </View>
        )
}

        //<Text>{tag}</Text>

function MainScreen (){
  const navigation = useNavigation<MainScreenNavigationProp>();
  const {UserData, UserNameSetter, AllergySetter} = useUserData();

  useEffect(() => {
    console.log("::MainScreen reRendered::");
    console.log(UserData);
  }, [UserData]);
  const [checked, setChecked] = React.useState(true);
  //for react element test

  return(
  <SafeAreaView style={styles.mainContainer}>
    {/*헤더
    <View style={styles.mainHeader}>
      <Text>Header</Text>
    </View>
    */}
    {/* 버튼메뉴 */}
    <View style={styles.allergyButtonGridWrapper}>
      <View style = {styles.allergyButtonWrapperHeader}>
       <TouchableOpacity
            style= {styles.allergyButton}
            onPress = {() => console.log(UserData)}
            >
              <Text> 알러지 출력 </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style= {styles.allergyButton}
            onPress = {() => navigation.navigate('store'
                ,{user: userData,}
                )}
            >
              <Text> 페이지 변경 </Text>
            </TouchableOpacity>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[0]} isPressed={UserData.user_allergy.includes(0)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[1]} isPressed={UserData.user_allergy.includes(1)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[2]} isPressed={UserData.user_allergy.includes(2)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[3]} isPressed={UserData.user_allergy.includes(3)} pressFunc = {AllergySetter}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[4]} isPressed={UserData.user_allergy.includes(4)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[5]} isPressed={UserData.user_allergy.includes(5)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[6]} isPressed={UserData.user_allergy.includes(6)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[7]} isPressed={UserData.user_allergy.includes(7)} pressFunc = {AllergySetter}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[8]} isPressed={UserData.user_allergy.includes(8)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[9]} isPressed={UserData.user_allergy.includes(9)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[10]} isPressed={UserData.user_allergy.includes(10)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[11]} isPressed={UserData.user_allergy.includes(11)} pressFunc = {AllergySetter}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[12]} isPressed={UserData.user_allergy.includes(12)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[13]} isPressed={UserData.user_allergy.includes(13)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[14]} isPressed={UserData.user_allergy.includes(14)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[15]} isPressed={UserData.user_allergy.includes(15)} pressFunc = {AllergySetter}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[16]} isPressed={UserData.user_allergy.includes(16)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[17]} isPressed={UserData.user_allergy.includes(17)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[18]} isPressed={UserData.user_allergy.includes(18)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[19]} isPressed={UserData.user_allergy.includes(19)} pressFunc = {AllergySetter}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[20]} isPressed={UserData.user_allergy.includes(20)} pressFunc = {AllergySetter}/>
        <AllergySetterButton tag={TAGS[21]} isPressed={UserData.user_allergy.includes(21)} pressFunc = {AllergySetter}/>
      </View>
    </View>

    {/* 추천 메뉴 */}
    <View>
      <Text>recommendedMenu</Text>
               <CheckBox
                 checked={checked}
                 onPress={() => console.log('pressed')}
                 // Use ThemeProvider to make change for all checkbox
                 iconType="material-community"
                 checkedIcon="checkbox-marked"
                 uncheckedIcon="checkbox-blank-outline"
                 checkedColor="#ff3d00"
               />
    </View>

  </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor: '#aaa',

    },
  mainHeader:{
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop:20,
    },
  allergyButtonGridWrapper:{
    height : 600,
    backgroundColor: '#ccc',
    },
  allergyButtonWrapperHeader:{
    height : 175,
    backgroundColor: '#aaa',
    marginBottom: 5,
    flexDirection:'row',
    alignItems:'center',
    },
  allergyButtonRow:{
    paddingLeft:60,
    height : 70,
    flexDirection:'row',
    alignItems:'center',
    },


  allergyButton:{
    height : 60,
    width : 60,
    marginLeft:10,
    borderRadius:5,
    borderColor:'#aaa',
    borderWidth:2,
    justifyContent: 'center',
    alignItems:'center',
  },

  allergyButtonText:{
      fontSize:13,
      color:'#000',
      fontWeight:'bold',
      }
});

export default MainScreen;