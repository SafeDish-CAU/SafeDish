import { StyleSheet } from 'react-native';
import { ListItem } from '@rneui/themed';
import AllergyTags from './AllergyTags';

function MenuCard({ menu, onPress }: {
  menu: {
    id: number;
    name: string;
    price: number;
    allergies: Array<{
      code: number;
      level: number;
    }>;
  };
  onPress: (menuId: number) => void;
}) {
  // return (
  //   <ListItem bottomDivider onPress={() => onPress(menu.id)}>
  //     <ListItem.Content style={{ paddingBottom: 0 }}>
  //       <ListItem.Title>{menu.name}</ListItem.Title>
  //       <ListItem.Subtitle>{`${menu.price}₩`}</ListItem.Subtitle>
  //       <AllergyTags allergies={menu.allergies} />
  //     </ListItem.Content>
  //     <ListItem.Chevron iconProps={{
  //       size: 32,
  //       color: '#aaaaaa',
  //     }} />
  //   </ListItem>
  // );
  return (
    <ListItem
      bottomDivider
      onPress={() => onPress(menu.id)}
      containerStyle={styles.container}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.title}>{menu.name}</ListItem.Title>
        <ListItem.Subtitle style={styles.subtitle}>
          {`${menu.price.toLocaleString()}원`}
        </ListItem.Subtitle>
        <AllergyTags allergies={menu.allergies} paddingTop={4} />
      </ListItem.Content>
      <ListItem.Chevron iconProps={{
        size: 32,
        color: '#aaaaaa',
      }} />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
});

export default MenuCard;