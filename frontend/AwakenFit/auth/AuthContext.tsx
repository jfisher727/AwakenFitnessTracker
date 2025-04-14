import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../store/useStorageState';

const AuthContext = createContext<{
  signIn: (token: string, username: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: (token: string, username: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("sessionToken");

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string, loggedInUser: string) => {
          setSession(JSON.stringify({ token: token, username: loggedInUser }));
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
