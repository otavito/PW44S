import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    authenticated: boolean;
    authenticatedUser?: AuthenticatedUser;
    handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<any>;
    handleLogout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] =
        useState<AuthenticatedUser>();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            const token = JSON.parse(storedToken);
            if (isTokenExpired(token)) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            setAuthenticatedUser(JSON.parse(storedUser));
            setAuthenticated(true);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = async (
        authenticationResponse: AuthenticationResponse
    ) => {
        try {
            localStorage.setItem(
                "token",
                JSON.stringify(authenticationResponse.token)
            );
            localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
            api.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${authenticationResponse.token}`;

            setAuthenticatedUser(authenticationResponse.user);
            setAuthenticated(true);
        } catch {
            setAuthenticatedUser(undefined);
            setAuthenticated(false);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        api.defaults.headers.common["Authorization"] = "";

        setAuthenticated(false);
        setAuthenticatedUser(undefined);
    };

    return (
        <AuthContext.Provider
            value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };