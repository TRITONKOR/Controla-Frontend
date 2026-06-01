import { useEffect } from "react";
import { authApi } from "./api";
import "./App.scss";
import { AppRouter } from "./app/providers/AppRouter";
import { useAuthStore } from "./app/store/authStore";

function App() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const setInitialized = useAuthStore((s) => s.setInitialized);

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
            })
            .finally(() => {
                setInitialized();
            });
    }, []);

    return <AppRouter />;
}

export default App;
