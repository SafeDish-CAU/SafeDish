import { View, Text, StyleSheet } from 'react-native';

function Memo({ name, option, qty }: {
  name: string;
  option?: string;
  qty: number;
}) {
  return (
    <View style={styles.container}>
      <Text
        style={styles.textMain}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {name}
        <Text style={styles.qtyInline}> x {qty}</Text>
      </Text>

      {option ? (
        <Text
          style={styles.textSub}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {option}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#fff7f3',
    borderWidth: 1,
    borderColor: '#ffe0d2',
  },
  textMain: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222222',
  },
  qtyInline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff4b26',
  },
  textSub: {
    marginTop: 2,
    fontSize: 10,
    color: '#666666',
  },
});

export default Memo;