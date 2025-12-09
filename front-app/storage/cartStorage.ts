import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart';

export type Cart = {
  storeId: number;
  storeName: string;
  items: Array<{
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
  }>;
};

export async function saveCart(cart: Cart) {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function clearCart() {
  await AsyncStorage.removeItem(CART_KEY);
}

export async function loadCart(): Promise<Cart | undefined> {
  const rawJson = await AsyncStorage.getItem(CART_KEY);
  if (!rawJson) return undefined;

  try {
    return JSON.parse(rawJson);
  } catch (err) {
    return undefined;
  }
}

// clearCart();
// saveCart({
//   storeId: 4,
//   storeName: '롯데리아 노량진점',
//   items: [{
//     quantity: 1,
//     menu: {
//       id: 1,
//       name: '핫크리스피버거 세트',
//       price: 9600,
//       options: [
//         {
//           id: 10,
//           name: '사이드',
//           minSelected: 1,
//           maxSelected: 1,
//           items: [
//             { id: 101, name: '세트 포테이토', price: 0, selected: true },
//             { id: 102, name: '치즈스틱', price: 1000, selected: false },
//           ],
//         },
//         {
//           id: 20,
//           name: '음료',
//           minSelected: 1,
//           maxSelected: 1,
//           items: [
//             { id: 201, name: '콜라(R)', price: 0, selected: true },
//             { id: 202, name: '제로 콜라(R)', price: 0, selected: false },
//           ],
//         },
//       ],
//     },
//   }, {

//     quantity: 2,
//     menu: {
//       id: 2,
//       name: '모짜렐라 인 더 버거 세트',
//       price: 9800,
//       options: [
//         {
//           id: 30,
//           name: '사이드',
//           minSelected: 1,
//           maxSelected: 1,
//           items: [
//             { id: 301, name: '세트 포테이토', price: 0, selected: true },
//             { id: 302, name: '양념감자', price: 500, selected: false },
//           ],
//         },
//         {
//           id: 40,
//           name: '음료',
//           minSelected: 1,
//           maxSelected: 1,
//           items: [
//             { id: 401, name: '제로 콜라(R)', price: 0, selected: true },
//             { id: 402, name: '사이다(R)', price: 0, selected: false },
//           ],
//         },
//       ],
//     },
//   }]
// })
