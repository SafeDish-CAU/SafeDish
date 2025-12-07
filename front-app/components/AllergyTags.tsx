import { View, StyleSheet } from 'react-native';
import AllergyTag from './AllergyTag';

function AllergyTags({ allergies, paddingTop }: {
  allergies: Array<{
    code: number;
    level: number;
  }>;
  paddingTop?: number;
}) {
  return (
    <View style={[styles.container, { paddingTop: paddingTop ?? 15 }]}>
      {allergies.map(({ code, level }, index) => <AllergyTag key={index} code={code} level={level} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    borderColor: '#aaa',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default AllergyTags;