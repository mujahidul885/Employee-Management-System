import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    sessionTimeout: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    UPDATE_SESSION: 'UPDATE_SESSION'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
                loading: false
            };
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case AUTH_ACTIONS.UPDATE_SESSION:
            return {
                ...state,
                sessionTimeout: action.payload
            };
        default:
            return state;
    }
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Session timeout duration (30 minutes)
    const SESSION_DURATION = 30 * 60 * 1000;

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = storage.get('currentUser');
        const sessionExpiry = storage.get('sessionExpiry');

        if (storedUser && sessionExpiry) {
            const now = new Date().getTime();
            if (now < sessionExpiry) {
                dispatch({ type: AUTH_ACTIONS.LOGIN, payload: storedUser });
                setupSessionTimeout();
            } else {
                // Session expired
                logout();
            }
        } else {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
    }, []);

    // Setup session timeout
    const setupSessionTimeout = () => {
        const expiryTime = new Date().getTime() + SESSION_DURATION;
        storage.set('sessionExpiry', expiryTime);

        const timeout = setTimeout(() => {
            logout();
            alert('Your session has expired. Please login again.');
        }, SESSION_DURATION);

        dispatch({ type: AUTH_ACTIONS.UPDATE_SESSION, payload: timeout });
    };

    // Login function
    const login = (email, password) => {
        // Mock authentication - In production, this would call an API
        const users = storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            storage.set('currentUser', userWithoutPassword);
            dispatch({ type: AUTH_ACTIONS.LOGIN, payload: userWithoutPassword });
            setupSessionTimeout();
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    // Logout function
    const logout = () => {
        storage.remove('currentUser');
        storage.remove('sessionExpiry');

        if (state.sessionTimeout) {
            clearTimeout(state.sessionTimeout);
        }

        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Check if user has specific role
    const hasRole = (role) => {
        if (!state.user) return false;
        if (Array.isArray(role)) {
            return role.includes(state.user.role);
        }
        return state.user.role === role;
    };

    // Check if user has permission
    const hasPermission = (permission) => {
        if (!state.user) return false;

        // Admin has all permissions
        if (state.user.role === 'admin') return true;

        // Check user's specific permissions
        return state.user.permissions?.includes(permission) || false;
    };

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        logout,
        hasRole,
        hasPermission
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
