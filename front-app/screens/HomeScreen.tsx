import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Stack';
import AllergyGrid from '../components/AllergyGrid';
import { useUser } from '../providers/UserProvider';
import RecommendBox from '../components/RecommendBox';
import { getRecommends } from '../api';

function HomeScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const userCtx = useUser();
  const [recommends, setRecommends] = useState<Array<{
    storeId: number;
    storeName: string;
    menuId: number;
    menuName: string;
  }>>([]);

  useEffect(() => {
    (async () => {
      if (!userCtx?.user) return;

      let mask = 0;
      for (let i = 0; i < 25; i++) {
        if (userCtx.user.allergies[i]) {
          mask |= (1 << i);
        }
      }

      const res = await getRecommends(userCtx.user.id, mask);
      if (res) {
        setRecommends(res.items);
      }
    })();
  }, [
    userCtx?.user?.location?.latitude,
    userCtx?.user?.location?.longitude,
    JSON.stringify(userCtx?.user?.allergies),
  ])

  return (
    <View style={styles.container}>
      <AllergyGrid />
      <View style={styles.sectionSpacing} />
      <RecommendBox
        location={userCtx?.user?.location}
        recommends={recommends}
        onChange={() => {
          navigation.navigate('Location');
        }}
        onClick={(storeId: number, storeName: string, menuId: number) => {
          navigation.navigate('Menu', {
            storeId: storeId,
            storeName: storeName,
            menuId: menuId,
            cartIdx: undefined,
          })
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionSpacing: {
    height: 24,
  },
});

export default HomeScreen;
