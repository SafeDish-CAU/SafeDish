import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons'
import AllergyTags from './AllergyTags';

function OptionCard({
  groupIndex,
  id,
  name,
  minSelected,
  maxSelected,
  items,
  onToggle,
}: {
  groupIndex: number;
  id: number;
  name: string;
  minSelected: number;
  maxSelected: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    allergies: Array<{
      code: number;
      level: number;
    }>;
    selected: boolean;
  }>;
  onToggle: (groupIndex: number, itemIndex: number) => void;
}) {
  const formatPrice = (value: number) => `${value.toLocaleString()}원`;

  const isRequired = !!minSelected;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>{name}</Text>
          {!isRequired && (
            <Text style={styles.headerLimit}>
              {`최대 ${maxSelected}개 선택`}
            </Text>
          )}
        </View>
        {isRequired ? (
          <View style={styles.headerReq}>
            <Text style={styles.headerReqText}>필수</Text>
          </View>
        ) : (
          <View style={styles.headerOpt}>
            <Text style={styles.headerOptText}>선택</Text>
          </View>
        )}
      </View>
      <View style={styles.listWrapper}>
        {items.map((item, index) => {
          const isLast = index + 1 == items.length;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                styles.itemRow,
                !isLast && styles.itemRowDivider,
              ]}
              onPress={() => onToggle(groupIndex, index)}
            >
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.checkbox,
                    item.selected && styles.checkboxSelected,
                  ]}
                >
                  {item.selected && (
                    <Icon name='check' size={16} color='#fff' />
                  )}
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <AllergyTags allergies={item.allergies} paddingTop={0} />
              <Text style={styles.itemPrice}>
                {`+${formatPrice(item.price)}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  headerLimit: {
    marginTop: 2,
    fontSize: 12,
    color: '#999',
  },
  headerOpt: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  headerOptText: {
    fontSize: 11,
    color: '#666',
  },
  headerReq: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#111',
  },
  headerReqText: {
    fontSize: 11,
    color: '#fff',
  },
  listWrapper: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    borderColor: '#00d084',
    backgroundColor: '#00d084',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
});

export default OptionCard;