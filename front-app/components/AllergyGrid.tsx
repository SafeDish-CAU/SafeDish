import { View, StyleSheet } from 'react-native';
import AllergyButton from './AllergyButton';

const ROW_SIZE = 5;

function AllergyGrid() {
  const rows: Array<number[]> = [];
  for (let i = 0; i < 22; i++) {
    if (i % 5 == 0) rows.push([]);
    const rowIndex = rows.length - 1;
    rows[rowIndex].push(i);
  }

  return (
    <View style={styles.gridContainer}>
      {rows.map((row, rowIndex) => {
        const start = rowIndex * ROW_SIZE;
        return (
          <View style={styles.rowContainer} key={rowIndex}>
            {row.map((code, index) => {
              const elemIndex = start + index;

              return (
                <AllergyButton
                  key={elemIndex}
                  code={code}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    height: 600,
    backgroundColor: '#ccc',
  },
  rowContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AllergyGrid;