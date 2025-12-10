import { Button, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Postcode from '@actbase/react-daum-postcode';
import { RootStackParamList } from './Stack';
import { useUser } from '../providers/UserProvider';
import { createUser, getLocation } from '../api';

function LocationScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Location'>) {
  const userCtx = useUser();

  return (
    <View style={styles.container}>
      <Postcode
        style={styles.postcode}
        jsOptions={{ animation: true }}
        onSelected={async (data) => {
          if (!userCtx?.user) return;

          const address = data.roadAddress || data.address;
          const location = await getLocation(address);
          if (location) {
            userCtx.setLocation(address, location.latitude, location.longitude, true);
            createUser(userCtx.user.id, location.latitude, location.longitude);
          }
          navigation.goBack();
        }}
        onError={(err) => {
          
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postcode: {
    flex: 1,
  },
});

export default LocationScreen;
