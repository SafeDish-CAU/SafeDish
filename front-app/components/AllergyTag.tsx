import { View, Text, StyleSheet } from 'react-native';
import { ALLERGY_TEXT_LIST } from '../utils/allergy';

function AllergyTag({ code, level }: {
  code: number;
  level: number;
}) {
  const text = ALLERGY_TEXT_LIST[code];
  const containerStyle = (level == 1 ? styles.tagContainerWarn : styles.tagContainerFatal);
  const textStyle = (level == 1 ? styles.tagTextWarn : styles.tagTextFatal);

  return (
    <View style={[styles.tagContainerBase, containerStyle]}>
      <Text style={[styles.tagTextBase, textStyle]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainerBase: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  tagContainerWarn: {
    backgroundColor: '#ffd700',
    borderColor: '#ffd700',
  },
  tagContainerFatal: {
    backgroundColor: '#ff3d00',
    borderColor: '#ff3d00',
  },
  tagTextBase: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagTextWarn: {
    color: 'black',
  },
  tagTextFatal: {
    color: 'black',
  },
});

export default AllergyTag;