import { useEffect } from "react";
import { authApi } from "./api";
import "./App.scss";
import { AppRouter } from "./app/providers/AppRouter";
import { useAuthStore } from "./app/store/authStore";

function App() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    useEffect(() => {
        authApi
            .refresh()
            .then((res) => {
                setAuth(res.user, res.accessToken);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    clearAuth();
                }
            });
    }, []);

    return <AppRouter />;
}

export default App;
