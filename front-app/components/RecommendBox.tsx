import { Text, Button, View, TouchableOpacity, StyleSheet } from 'react-native';

function RecommendBox({
  location,
  recommends,
  onChange,
  onClick,
}: {
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  recommends: Array<{
    storeId: number;
    storeName: string;
    menuId: number;
    menuName: string;
  }>;
  onChange: () => void;
  onClick: (storeId: number, storeName: string, menuId: number) => void;
}) {
  const hasLocation = !!location;

  if (!hasLocation) {
    return (
      <View>
        <Text style={styles.title}>메뉴 추천</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>주소가 설정되어 있지 않습니다.</Text>
          <Text style={styles.emptyDescription}>
            주소를 설정하면 내 위치 기준으로 추천 메뉴를 보여드릴게요.
          </Text>
          <View style={styles.emptyButtonWrapper}>
            <Button title='주소 설정하러 가기' color={'#ff4b26'} onPress={onChange} />
          </View>
        </View>
      </View>
    );
  }

  const topRow = recommends.slice(0, 2);
  const bottomRow = recommends.slice(2, 5);

  return (
    <View>
      <Text style={styles.title}>메뉴 추천</Text>
      <View style={styles.container}>
        <View style={styles.addressRow}>
          <View style={styles.addressTextWrapper}>
            <Text style={styles.addressLabel}>현재 주소</Text>
            <Text
              style={styles.addressText}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {location.address}
            </Text>
          </View>
          <Button title='주소 변경' color={'#ff4b26'} onPress={onChange} />
        </View>

        <View style={styles.recommendSection}>
          <Text style={styles.recommendTitle}>추천 메뉴</Text>

          {recommends.length === 0 ? (
            <Text style={styles.noRecommendText}>
              아직 추천 결과가 없어요. 주문이 쌓이면 추천 메뉴를 보여드릴게요.
            </Text>
          ) : (
            <>
              <View style={styles.recommendRowTop}>
                {topRow.map(item => (
                  <TouchableOpacity
                    key={`${item.storeId}-${item.menuId}`}
                    style={[styles.recommendCard, styles.recommendCardTop]}
                    activeOpacity={0.9}
                    onPress={() => {
                      onClick(item.storeId, item.storeName, item.menuId);
                    }}
                  >
                    <Text
                      style={styles.recommendMenuName}
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {item.menuName}
                    </Text>
                    <Text
                      style={styles.recommendStoreName}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {item.storeName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {bottomRow.length > 0 && (
                <View style={styles.recommendRowBottom}>
                  {bottomRow.map(item => (
                    <TouchableOpacity
                      key={`${item.storeId}-${item.menuId}`}
                      style={[styles.recommendCard, styles.recommendCardBottom]}
                      activeOpacity={0.9}
                      onPress={() => {
                        onClick(item.storeId, item.storeName, item.menuId);
                      }}
                    >
                      <Text
                        style={styles.recommendMenuName}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                      >
                        {item.menuName}
                      </Text>
                      <Text
                        style={styles.recommendStoreName}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                      >
                        {item.storeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222222',
    alignSelf: 'center',
    textAlign: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  addressLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },
  recommendSection: {
    marginTop: 8,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222222',
  },
  recommendRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendCard: {
    borderRadius: 12,
    backgroundColor: '#fff1ea',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  recommendCardTop: {
    width: '48%',
  },
  recommendCardBottom: {
    width: '30%',
  },
  recommendMenuName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222222',
    marginBottom: 4,
  },
  recommendStoreName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b7280',
  },
  noRecommendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyButtonWrapper: {
    marginTop: 4,
  },
});

export default RecommendBox;