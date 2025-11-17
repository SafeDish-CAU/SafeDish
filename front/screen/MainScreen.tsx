import React, { useRef, useEffect, useCallback, useMemo, useState} from 'react';
import NewAppScreen from '@react-native/new-app-screen';
import { StatusBar, SafeAreaView, StyleSheet, useColorScheme, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import {TestUserDataObject} from '../scripts/Data/TestData';
import {TAGS} from '../scripts/Data/AllergyTag';

/*
    ***MainScreen***
    메인메뉴의 버튼 -> 유저 데이터로 연결
    별개로 데이터를 받아와 추천메뉴 띄워주기

*/
const userDataObject = TestUserDataObject();
const userData = userDataObject.getComponent();

type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'main'
>;

const AllergySetterButton = ({tag}) => {
    const [Pressed, setPressed] = useState(userData.allergy_materials.includes(tag));

    const onPress = () => {
      if(Pressed) {
        setPressed(false);
        userDataObject.allergySetter('remove', tag);
      }  else{
        setPressed(true);
        userDataObject.allergySetter('add', tag);
      }
    };

    return(
      <View>
        <TouchableOpacity
            style= {[
                styles.allergyButton,
                {backgroundColor: Pressed?'#E0B0FF':'#eee'},
                ]}
            onPress = {onPress}
        >
        <Text style={styles.allergyButtonText}>{tag}</Text>
        </TouchableOpacity>
      </View>
    );
}

        //<Text>{tag}</Text>

function MainScreen (){
  const navigation = useNavigation<MainScreenNavigationProp>();
  console.log(userDataObject, userData
      );

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
            onPress = {() => console.log(userData)}
            >
              <Text> 알러지 출력 </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style= {styles.allergyButton}
            onPress = {() => navigation.navigate('store'
                //,{user: TestUserDataObject().getComponent(),}
                )}
            >
              <Text> 페이지 변경 </Text>
            </TouchableOpacity>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[0]}/>
        <AllergySetterButton tag={TAGS[1]}/>
        <AllergySetterButton tag={TAGS[2]}/>
        <AllergySetterButton tag={TAGS[3]}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[4]}/>
        <AllergySetterButton tag={TAGS[5]}/>
        <AllergySetterButton tag={TAGS[6]}/>
        <AllergySetterButton tag={TAGS[7]}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[8]}/>
        <AllergySetterButton tag={TAGS[9]}/>
        <AllergySetterButton tag={TAGS[10]}/>
        <AllergySetterButton tag={TAGS[11]}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[12]}/>
        <AllergySetterButton tag={TAGS[13]}/>
        <AllergySetterButton tag={TAGS[14]}/>
        <AllergySetterButton tag={TAGS[15]}/>
      </View>
      <View style = {styles.allergyButtonRow}>
        <AllergySetterButton tag={TAGS[16]}/>
        <AllergySetterButton tag={TAGS[17]}/>
        <AllergySetterButton tag={TAGS[18]}/>
        <AllergySetterButton tag={TAGS[19]}/>
      </View>
    </View>

    {/* 추천 메뉴 */}
    <View>
      <Text>recommendedMenu</Text>
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