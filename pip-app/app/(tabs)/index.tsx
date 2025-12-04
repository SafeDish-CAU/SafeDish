// app/(tabs)/index.tsx

// SafeDish 캡스톤: PIP 장바구니
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Button, Icon, Overlay } from "react-native-elements";

type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type CartItem = Food & {
  quantity: number;
};

// 샘플 음식 데이터 (교체 필요)
const MOCK_FOODS: Food[] = [
  { id: "1", name: "마라샹궈", description: "매운 정도 선택 가능", price: 15000 },
  { id: "2", name: "크림파스타", description: "우유/유제품 포함", price: 12000 },
  { id: "3", name: "치킨 샐러드", description: "닭고기, 드레싱 알 포함", price: 11000 },
  { id: "4", name: "새우 튀김", description: "갑각류 알레르기 주의", price: 9000 },
];

export default function IndexScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMemoVisible, setIsMemoVisible] = useState(false);
  const [memoText, setMemoText] = useState(""); // 메모
  const [isPipVisible, setIsPipVisible] = useState(false); //pip 아이콘

  // 음식 담기
  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  // 수량
  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 전체 비우기
  const handleClear = () => {
    setCartItems([]);
    setMemoText("");
    setIsMemoVisible(false);
    setIsPipVisible(false);
  };

  const handleConfirm = async () => {
    await submitCartToServer();     // 서버로 보내기
    setIsMemoVisible(false);        // 장바구니 닫기
  };


  const totalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

    // 장바구니 + 메모를 서버로 
  const submitCartToServer = async () => {
    try {
      const payload = {
        items: cartItems,  
        memo: memoText,    // 메모 내용
        // userId: "123",  // 음식점 ID
      };

      // https://example.com/api/cart 서버 주소로 교체****
      const response = await fetch("https://example.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("서버 저장 실패");
      }

      const data = await response.json();
      console.log("서버 저장 성공:", data);
      
    } catch (error) {
      console.error(error);
      // 네트워크 오류 안내(필요시 사용)
      // Alert.alert("저장 실패", "네트워크 상태를 확인해주세요.");
    }
  };

  // PIP 팝업 텍스트
  const getPipSummaryText = () => {
    if (cartItems.length === 0) return "";
    if (cartItems.length === 1) {
      return `${cartItems[0].name} ${cartItems[0].quantity}개`;
    }
    return `${cartItems[0].name} 외 ${cartItems.length - 1}개`;
  };

  const renderFoodItem = ({ item }: { item: Food }) => (
    <View style={styles.foodCard}>
      <Text style={styles.foodTitle}>{item.name}</Text>
      <Text style={styles.foodDesc}>{item.description}</Text>
      <Text style={styles.foodPrice}>
        {item.price.toLocaleString()}원
      </Text>
      <Button
        title="장바구니"
        icon={
          <Icon 
            name="shopping-cart"
            type="material"
            color="#fff" 
            size={18}
            style={{ marginRight: 6 }} 
          />}
        buttonStyle={styles.addButton}
        onPress={() => handleAddToCart(item)}
      />
    </View>
  );

  const renderMemoItem = ({ item }: { item: CartItem }) => (
    <View style={styles.memoItemRow}>
      <View style={styles.memoItemText}>
        <Text style={styles.memoItemTitle}>{item.name}</Text>
        <Text style={styles.memoItemSubtitle}>
          수량: {item.quantity}개
        </Text>
      </View>
      <View style={styles.memoItemButtons}>
        <Button
          type="outline"
          icon={<Icon name="remove" size={16} />}
          buttonStyle={styles.smallButton}
          onPress={() => handleDecrease(item.id)}
        />
        <Button
          type="outline"
          icon={<Icon name="add" size={16} />}
          buttonStyle={styles.smallButton}
          onPress={() => handleAddToCart(item)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>메뉴</Text>

      <FlatList
        data={MOCK_FOODS}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />


      {/* 장바구니에 뭔가 담겨 있고, PIP가 닫혀 있을 때만 보이는 동그란 버튼 */}
      {totalCount > 0 && !isPipVisible && (
        <TouchableOpacity
          style={styles.cartFab}
          onPress={() => setIsPipVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="shopping-cart" type="material" color="#fff" />
          {/* 선택: 장바구니 안에 몇 개 담겼는지 뱃지로 보여주기 */}
          {totalCount > 0 && (
            <View style={styles.cartFabBadge}>
              <Text style={styles.cartFabBadgeText}>{totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {/* PIP 팝업 */}
      {totalCount > 0 && isPipVisible && (
        <View style={styles.pipContainer}>
          <View style={styles.pipHeader}>
            <Icon name="shopping-cart" 
                  type="material"
            />
            <Text style={styles.pipTitle}>장바구니</Text>
            {<Icon name="close" size={18} onPress={() => setIsPipVisible(false)}
            />}
          </View>
          <Text style={styles.pipSummary}>{getPipSummaryText()}</Text>
          <Text style={styles.pipCount}>총 {totalCount}개 담김</Text>
          <View style={styles.pipButtons}>
            <Button
              title="장바구니 보기"
              onPress={() => setIsMemoVisible(true)}
              buttonStyle={{
                backgroundColor: "#FF6B6B",
                borderRadius: 24,
                paddingVertical: 10,
                paddingHorizontal: 18,
                }}
              titleStyle={{color: "#fff", fontWeight: "600"}}
            />
            <Button
              title="비우기"
              type="clear"
              titleStyle={{ color: "#888", fontSize: 12 }}
              onPress={handleClear}
            />
          </View>
        </View>
      )}

      {/* 장바구니 Overlay */}
      <Overlay
        isVisible={isMemoVisible}
        onBackdropPress={() => setIsMemoVisible(false)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.overlayHeader}>
          <Text style={styles.overlayTitle}>선택한 메뉴 담기</Text>
          <Icon name="close" onPress={() => setIsMemoVisible(false)} />
        </View>

        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>아직 담긴 메뉴가 없습니다.</Text>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderMemoItem}
            keyExtractor={(item) => item.id}
          />
        )}
        
        {/* 메모 기능 (알레르기 혹은 영양소 정보 용) */}
        <Text style={styles.memoLabel}>추가 메모</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="이 주문에 대한 메모를 적어주세요"
          multiline
          value={memoText}
          onChangeText={setMemoText}
        />
        
        <View style={styles.overlayFooter}>
          <Button
            title="전체 비우기"
            type="outline"
            onPress={handleClear}
            buttonStyle={styles.footerButton}
            titleStyle={styles.footerClearTitle}
          />
          <Button
            title="확인"
            onPress={handleConfirm}
            buttonStyle={[styles.footerButton,
                        {backgroundColor: "#FF6B6B"}]}
            titleStyle={styles.footerConfirmTitle}
          />
        </View>
      </Overlay>
    </SafeAreaView>
  );
}

// 디자인
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    fontSize: 22,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 120,
  },
  foodCard: {
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#E0E0E0"
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  foodDesc: {
    marginBottom: 4,
    color: "#555",
  },
  foodPrice: {
    marginBottom: 8,
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    paddingVertical: 8,
  },

  cartFab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",

    elevation: 8, // 안드 그림자
    shadowColor: "#000",  // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cartFabBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  cartFabBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  pipOpenButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    paddingVertical: 8,
  },

  pipContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 6,
  },
  pipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pipTitle: {
    marginLeft: 6,
    fontWeight: "700",
  },
  pipSummary: {
    marginTop: 4,
    fontWeight: "600",
  },
  pipCount: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  pipButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  pipButtonMain: {
    paddingHorizontal: 16,
  },

  overlay: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 32,
    color: "#777",
  },
  overlayFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  footerButton: {
    marginLeft: 8,
  },
  footerClearTitle: {
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "600",
  },
  footerConfirmTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  memoLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  memoInput: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    textAlignVertical: "top",  
  },

  memoItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  memoItemText: {
    flex: 1,
  },
  memoItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  memoItemSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  memoItemButtons: {
    flexDirection: "row",
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
  },
});
