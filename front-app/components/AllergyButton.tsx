import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ALLERGY_TEXT_LIST } from '../utils/allergy';
import { useUser } from '../providers/UserProvider';

function AllergyButton({ code }: {
  code: number;
}) {
  const userCtx = useUser();

  const text = ALLERGY_TEXT_LIST[code];
  const isPressed = !!userCtx?.user?.allergies?.[code];

  const onPress = async () => {
    userCtx?.setAllergy(code, isPressed ? 0 : 1);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.buttonBase, { backgroundColor: isPressed ? '#ff3d00' : '#eee' }]}
        onPress={onPress}
      >
        <Text style={styles.textBase}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 60,
    width: 60,
    marginLeft: 10,
    borderRadius: 5,
    borderColor: '#aaa',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default AllergyButton;