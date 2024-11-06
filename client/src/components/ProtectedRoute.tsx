import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthState } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const user = useSelector((state: AuthState) => state.authReducer?.authData?.user);
    const profile = localStorage.getItem('profile');

    if (!user) {
        return <Navigate to='/auth'  state={{ from: location }} replace />;
    }

    return <>children</>;
};

export default ProtectedRoute;
