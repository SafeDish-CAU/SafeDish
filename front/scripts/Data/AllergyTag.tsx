import React from 'react';
import { View, Button, Text, StyleSheet, FlatList } from 'react-native';
import {TestUserData} from './TestData';
// testdata용
const userData = TestUserData[0];

// user data를 이용한 렌더링 필터링 여부 확인
const userRender = false;

const TAGS = [
  '난류', '우유', '메밀', '땅콩',
  '대두', '밀', '잣', '호두',
  '게', '새우', '오징어', '고등어',
  '조개류', '소고기', '돼지고기', '닭고기',
  '복숭아', '토마토', '아황산', '알류(가금류)'
];

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  tagListContainer: {
    padding: 15,
    borderBottomWidth:1.5,
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
    borderWidth: 3,
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
    backgroundColor: '#EE0000',
    borderColor: '#ccc',
    borderWidth: 3,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const levCont = [
    styles.tagContainer_LV1,
    styles.tagContainer_LV2,
    styles.tagContainer_LV3,
    ]


/*
    tag : index of TAG
    level : select/warningLevel (1, 2, 3)

    AllergyTagList에 userRender 값에 따라 필터 여부가 달라지는 리스트가 있음.
*/

const AllergyTag = ({tag, level}) => (
    <View style= {levCont[level-1]}>
        <Text style={styles.tagText}> {TAGS[tag]} </Text>
    </View>
    )


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

export default AllergyTagList;
export { AllergyTag, TAGS };