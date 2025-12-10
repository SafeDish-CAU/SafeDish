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
    <View style={[styles.container, { paddingTop: paddingTop ?? 10 }]}>
      {allergies.map(({ code, level }, index) => (
        <AllergyTag key={index} code={code} level={level} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
});

export default AllergyTags;