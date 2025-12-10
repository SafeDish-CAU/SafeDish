import { Text, View, StyleSheet } from 'react-native';
import AllergyButton from './AllergyButton';

const ROW_SIZE = 5;

function AllergyGrid() {
  const rows: Array<number[]> = [];
  for (let i = 0; i < 25; i++) {
    if (i % 5 == 0) rows.push([]);
    const rowIndex = rows.length - 1;
    rows[rowIndex].push(i);
  }

  return (
    <View>
      <Text style={styles.title}>필터링 식재료</Text>
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => {
          const start = rowIndex * ROW_SIZE;
          return (
            <View style={styles.rowContainer} key={rowIndex}>
              {row.map((code, index) => {
                const elemIndex = start + index;
                return <AllergyButton key={elemIndex} code={code} />;
              })}
            </View>
          );
        })}
      </View>
      <View style={styles.ruleContainer}>
        <Text style={styles.ruleTitle}>필터링 기준</Text>

        <Text style={styles.ruleText}>
          <Text style={styles.ruleLabel}>알레르기 22종</Text>
          <Text>  식품표시광고법, 식품등의 표시기준</Text>
        </Text>

        <Text style={styles.ruleText}>
          <Text style={styles.ruleLabel}>고열량·저영양</Text>
          <Text>  어린이 식생활안전관리 특별법, 고열량·저영양 식품 기준</Text>
        </Text>

        <Text style={styles.ruleText}>
          <Text style={styles.ruleLabel}>GMO 식품</Text>
          <Text>  유전자변형식품등의 표시기준</Text>
        </Text>

        <Text style={styles.ruleText}>
          <Text style={styles.ruleLabel}>고카페인 식품</Text>
          <Text>  어린이 기호식품 영양·고카페인 표시기준</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222222',
    alignSelf: 'center',
    textAlign: 'center',
  },
  gridContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ruleContainer: {
    marginTop: 4,
    marginHorizontal: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff1ea',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ruleTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222222',
  },
  ruleText: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    color: '#555',
  },
  ruleLabel: {
    fontWeight: '700',
    color: '#222222',
  },
});

export default AllergyGrid;