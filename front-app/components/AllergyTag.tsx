import { View, Text, StyleSheet } from 'react-native';
import { ALLERGY_TEXT_LIST } from '../utils/allergy';

function AllergyTag({ code, level }: {
  code: number;
  level: number;
}) {
  const text = ALLERGY_TEXT_LIST[code];

  const containerStyle =
    level === 0
      ? styles.tagContainerInfo
      : level === 1
        ? styles.tagContainerWarn
        : styles.tagContainerFatal;

  const textStyle =
    level === 0
      ? styles.tagTextInfo
      : level === 1
        ? styles.tagTextWarn
        : styles.tagTextFatal;

  return (
    <View style={[styles.tagContainerBase, containerStyle]}>
      <Text style={[styles.tagTextBase, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainerBase: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  tagContainerInfo: {
    backgroundColor: '#f4f4f5',
    borderColor: '#d4d4d8',
  },
  tagContainerWarn: {
    backgroundColor: '#fff1ea',
    borderColor: '#ffb38a',
  },
  tagContainerFatal: {
    backgroundColor: '#ff4b26',
    borderColor: '#e03614',
  },
  tagTextBase: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagTextInfo: {
    color: '#222222',
  },
  tagTextWarn: {
    color: '#222222',
  },
  tagTextFatal: {
    color: '#ffffff',
  },
});

export default AllergyTag;