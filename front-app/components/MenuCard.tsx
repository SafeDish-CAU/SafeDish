import { ListItem } from '@rneui/themed';
import AllergyTags from './AllergyTags';

function MenuCard({ menu }: {
  menu: {
    id: number;
    name: string;
    price: number;
    allergies: Array<{
      code: number;
      level: number;
    }>;
  };
}) {
  return (
    <ListItem bottomDivider onPress={() => console.log('list pressed', menu.name)}>
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