import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ListItem } from '@rneui/themed';
import Icon from '@react-native-vector-icons/material-icons'

function CartCard({
  cartIndex,
  quantity,
  menu,
  onChangeOption,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  cartIndex: number;
  quantity: number;
  menu: {
    id: number;
    name: string;
    price: number;
    options: Array<{
      id: number;
      name: string;
      minSelected: number;
      maxSelected: number;
      items: Array<{
        id: number;
        name: string;
        price: number;
        selected: boolean;
      }>;
    }>;
  };
  onChangeOption: (index: number) => void;
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const formatPrice = (value: number) => `${value.toLocaleString()}원`;

  const optionPrice = menu.options.reduce((acc, group) => {
    const selected = group.items.filter((item) => item.selected);
    return acc + selected.reduce((sum, item) => sum + item.price, 0);
  }, 0);

  const totalPrice = (menu.price + optionPrice) * quantity;

  const optionLines = menu.options
    .map((group) => {
      const selected = group.items.filter((item) => item.selected);
      if (selected.length == 0) return undefined;
      const names = selected.map((item) => !!item.price ? `${item.name} (${formatPrice(item.price)})` : item.name).join(', ');
      return `${group.name}: ${names}`;
    })
    .filter((line): line is string => !!line);

  const isSingle = quantity <= 1;

  return (
    <View style={styles.wrapper}>
      <ListItem containerStyle={styles.card}>
        <ListItem.Content>
          <View style={styles.contentRow}>
            <View style={styles.textArea}>
              <Text style={styles.menuName}>{menu.name}</Text>
              <Text style={styles.menuPrice}>
                가격 : {formatPrice(menu.price)}
              </Text>
              {optionLines.map(line => (
                <Text key={line} style={styles.menuOption}>
                  {line}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => onChangeOption(cartIndex)}
              >
                <Text style={styles.optionBtnText}>옵션 변경</Text>
              </TouchableOpacity>
              <View style={styles.quantityBox}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => (isSingle ? onRemove : onDecrease)(cartIndex)}
                >
                  <Icon
                    name={isSingle ? 'delete-outline' : 'remove'}
                    size={18}
                    color='#333'
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => onIncrease(cartIndex)}
                >
                  <Icon name='add' size={18} color='#333' />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  contentRow: {
    flexDirection: 'row',
  },
  textArea: {
    flex: 1,
    paddingRight: 8,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  menuOption: {
    fontSize: 12,
    color: '#777',
    marginTop: 1,
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginLeft: 8,
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  iconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartCard;