import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';

export type User = {
  id: string;
  allergies: number[];
};

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function loadUser(): Promise<User | undefined> {
  const rawJson = await AsyncStorage.getItem(USER_KEY);
  if (!rawJson) return undefined;

  try {
    return JSON.parse(rawJson);
  } catch (err) {
    return undefined;
  }
}