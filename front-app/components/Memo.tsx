import { View, Text, StyleSheet } from 'react-native';

function Memo({ name, option, qty }: {
  name: string;
  option?: string;
  qty: number;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.textMain}>
        {name} x {qty}
      </Text>
      {option ? <Text style={styles.textSub}>
        {option}
      </Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  textMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  textSub: {
    fontSize: 12,
    color: '#aaaaaa',
    marginTop: 2,
  },
});

export default Memo;