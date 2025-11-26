import React from 'react';
import { View, Button, Text, StyleSheet, FlatList } from 'react-native';
import {TestUserData} from './TestData';
import {AllergyList} from './AllergyList';
// testdata용
const userData = TestUserData[0];

// user data를 이용한 렌더링 필터링 여부 확인
const userRender = false;

const TAGS = AllergyList;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  tagListContainer: {
    paddingTop: 15,
    borderBottomWidth:0,
    borderColor: '#aaa',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },

  tagContainer_LV1: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },

  tagContainer_LV2: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 20,
      alignSelf: 'flex-start',
      backgroundColor: '#ffd700',
      borderColor: '#ccc',
      borderWidth: 3,
    },

  tagContainer_LV3: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#ff3d00',
    borderColor: '#ff3d00',
    borderWidth: 1,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagText_LV3:{
     color: 'white',
     fontSize: 14,
     fontWeight: 'bold',
  }
});

const levCont = [
    styles.tagContainer_LV1,
    styles.tagContainer_LV2,
    styles.tagContainer_LV3,
    ]

const levCont2 = [
    styles.tagText,
    styles.tagText,
    styles.tagText_LV3
    ]

/*
    tag : index of TAG
    level : select/warningLevel (1, 2, 3)

    AllergyTagList에 userRender 값에 따라 필터 여부가 달라지는 리스트가 있음.
*/

const AllergyTag = ({tag, level}) => {
    const Allergy = typeof tag == 'string'? tag : TAGS[tag];
    return (
    <View style= {levCont[level-1]}>
        <Text style={levCont2[level-1]}> {Allergy} </Text>
    </View>
    )
}


const AllergyTagList = ({MaterialList}) => (
    <View style={styles.tagListContainer}>
    {(MaterialList || []).map(([material, level], index) =>{
                const tagIndex1 = TAGS.findIndex(tag=>tag === material);
                const tagIndex2 = userData.allergy_materials.findIndex(tag=>tag === material);

                let caseResult = false;
                if(userRender == true) caseResult = (tagIndex1 != -1 && tagIndex2 != -1);
                else caseResult = tagIndex1 != -1;
                console.log(MaterialList);
                return caseResult?(
                    <AllergyTag key= {index} tag = {tagIndex1} level={level} />
                    ):null;
                  })}

    </View>
    )

const AllergyTagList2 = ({maxLen, menuList}) => {
    console.log("AllergyTagList2", menuList)
    const h_allergy = [...menuList.H_levAllergy];
    const l_allergy = [...menuList.L_levAllergy];


    const remain = maxLen - h_allergy.length >= 0 ? maxLen-h_allergy.length : 0;
    return(
    <View style={styles.tagListContainer}>
    {(h_allergy.slice(0, 5) || []).map((tag) =>{
        if(tag == undefined) {
            console.log("error from AllergyTagList2 :: Hightag is undefined")}

        return <AllergyTag key={`${menuList.menu_id}_${tag}`} tag = {tag} level={3} />;
          })}
    {(l_allergy.slice(0, remain) || []).map((tag) =>{
        if(tag == undefined) {
            console.log("error from AllergyTagList2 :: Lowtag is undefined")}

        return <AllergyTag key={`${menuList.menu_id}_${tag}`} tag = {tag} level={1} />;
          })}
    </View>
    );
}

export default AllergyTagList;
export { AllergyTagList2, AllergyTag, TAGS };