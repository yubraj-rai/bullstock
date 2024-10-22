
interface User {
    _id: string;
    username: string;
    balance: number;
}

interface AuthData {
    user: User;
    token: string;
}

interface AuthReducer {
    authData: AuthData;
}

interface AuthState {
    authReducer: AuthReducer;
}

export type { AuthState };
