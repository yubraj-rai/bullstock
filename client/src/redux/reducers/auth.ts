import { AUTH, LOGOUT, UPDATE_USERNAME } from '../actions';

const authReducer = (state = { authData: null }, action: any) => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');

    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return { ...state, authData: action?.payload };
        case LOGOUT:
            localStorage.removeItem('profile');
            return { ...state, authData: null };
        case UPDATE_USERNAME:
            profile.user.username = action?.payload.newUsername;
            localStorage.setItem('profile', JSON.stringify(profile));
            return { ...state, authData: profile };
        default:
            return state;
    }
};

export default authReducer;
