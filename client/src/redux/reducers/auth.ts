import { AUTH, LOGOUT, UPDATE_USERNAME, UPDATE_BALANCE } from '../actions';

const authReducer = (state = { authData: null }, action: any) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return { ...state, authData: action?.payload };
        case LOGOUT:
            localStorage.removeItem('profile');
            return { ...state, authData: null };
        case UPDATE_BALANCE:
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            profile.user.balance = action?.payload.newBalance;
            localStorage.setItem('profile', JSON.stringify(profile));
            return { ...state, authData: profile };
        case UPDATE_USERNAME:
            // const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            profile.user.username = action?.payload.newUsername;
            localStorage.setItem('profile', JSON.stringify(profile));
            return { ...state, authData: profile };
        default:
            const storedProfile = localStorage.getItem('profile');
            if (storedProfile && !state.authData) {
                return { ...state, authData: JSON.parse(storedProfile) };
            }
            return state;
    }
};

export default authReducer;