import { createContext, useReducer, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';
import { authApi } from '../api/authApi.js';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
};

const AUTH_ACTIONS = {
  INIT: 'INIT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.INIT:
      return { ...state, ...action.payload, loading: false };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: AUTH_ACTIONS.INIT,
          payload: {
            user,
            accessToken: token,
            refreshToken: refresh,
            isAuthenticated: true,
          },
        });
      } catch {
        dispatch({ type: AUTH_ACTIONS.INIT, payload: {} });
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.INIT, payload: {} });
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    persistAuth(res.data);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: {
        user: { id: res.data.userId, fullName: res.data.fullName, email: res.data.email },
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
    });
    return res;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload);
    persistAuth(res.data);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: {
        user: { id: res.data.userId, fullName: res.data.fullName, email: res.data.email },
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
    });
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function persistAuth(data) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify({ id: data.userId, fullName: data.fullName, email: data.email })
  );
}