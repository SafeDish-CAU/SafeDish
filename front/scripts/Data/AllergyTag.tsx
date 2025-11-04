import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

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
*/

const AllergyTag = ({tag, level}) => (
    <View style= {levCont[level-1]}>
        <Text style={styles.tagText}> {TAGS[tag]} </Text>
    </View>
    )

const AllergyTagList = ({MaterialList}) => (
    <View style={styles.tagListContainer}>
    {MaterialList.map(([material, level], index) =>{
                const tagIndex = TAGS.findIndex(tag=>tag === material)
                return tagIndex !== -1?(
                    <AllergyTag key= {index} tag = {tagIndex} level={level} />
                    ):null;
                  })}

    </View>
    )

export default AllergyTagList;
export { AllergyTag };