import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Store: {
    storeId: number;
  };
  Menu: {
    storeId: number;
    storeName: string;
    menuId: number;
    cartIdx?: number;
  };
  Memo: undefined;
  Cart: {
    canEnd: boolean;
  };
  Location: undefined;
  Test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default Stack;