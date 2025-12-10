import { useState, createContext, ReactNode, useEffect, useContext } from 'react';
import { getUniqueId } from 'react-native-device-info';
import { loadUser, saveUser, clearUser, User } from '../storage/userStorage';

type UserContextValue = {
  user?: User;
  loading: boolean;
  setAllergy: (code: number, value: number) => Promise<void>;
  setLocation: (address: string, latitude: number, longitude: number, fixed: boolean) => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const setDefault = async () => {
    const uid = await getUniqueId();
    const allergies = Array(25).fill(0);
    const newUser: User = {
      id: uid,
      allergies: allergies,
    };

    setUser(newUser);
    await saveUser(newUser);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const saved = await loadUser();
        if (saved) {
          setUser(saved);
        } else {
          await setDefault();
        }
      } catch (err) {
        await setDefault();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setAllergy = async (code: number, value: number) => {
    if (user) {
      const baseUser = user;
      const oldAllergies = baseUser.allergies;
      const newAllergies = [...oldAllergies];
      newAllergies[code] = value;

      const newUser: User = {
        ...baseUser,
        allergies: newAllergies,
      };

      setUser(newUser);
      await saveUser(newUser);
    }
  };

  const setLocation = async (address: string, latitude: number, longitude: number, fixed: boolean) => {
    if (!user) return;
    if (!fixed && user?.location?.fixed) return;

    const location = {
      address: address,
      latitude: latitude,
      longitude: longitude,
      fixed: fixed,
    };

    const newUser: User = {
      ...user,
      location,
    };

    setUser(newUser);
    await saveUser(newUser);
  };

  const value: UserContextValue = {
    user,
    loading,
    setAllergy,
    setLocation,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}