import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ALLERGY_TEXT_LIST, ALLERGY_IMAGE_LIST } from '../utils/allergy';
import { useUser } from '../providers/UserProvider';

function AllergyButton({ code }: {
  code: number;
}) {
  const userCtx = useUser();

  const text = ALLERGY_TEXT_LIST[code];
  const image = ALLERGY_IMAGE_LIST[code];
  const isPressed = !!userCtx?.user?.allergies?.[code];

  const onPress = async () => {
    userCtx?.setAllergy(code, isPressed ? 0 : 1);
  };

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        isPressed ? styles.buttonPressed : styles.buttonUnpressed,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.contentWrapper}>
        {image && (
          <Image
            source={image}
            style={styles.icon}
            resizeMode='contain'
          />
        )}

        <Text style={styles.textBase} numberOfLines={2}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 70,
    width: 70,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonUnpressed: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  buttonPressed: {
    backgroundColor: '#ff4b26',
    borderColor: '#e03614',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  textBase: {
    fontSize: 10,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default AllergyButton;