import { Store } from "@tanstack/react-store";

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const authStore = new Store<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const authActions = {
  setUser: (user: AuthUser | null) => {
    authStore.setState((state) => ({
      ...state,
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }));
  },

  setLoading: (isLoading: boolean) => {
    authStore.setState((state) => ({
      ...state,
      isLoading,
    }));
  },

  logout: () => {
    authStore.setState(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }));
  },
};
