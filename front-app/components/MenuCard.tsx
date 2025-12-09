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
  return (
    <ListItem bottomDivider onPress={() => onPress(menu.id)}>
      <ListItem.Content style={{ paddingBottom: 0 }}>
        <ListItem.Title>{menu.name}</ListItem.Title>
        <ListItem.Subtitle>{`${menu.price}₩`}</ListItem.Subtitle>
        <AllergyTags allergies={menu.allergies} />
      </ListItem.Content>
      <ListItem.Chevron iconProps={{
        size: 32,
        color: '#aaaaaa',
      }} />
    </ListItem>
  );
}

export default MenuCard;