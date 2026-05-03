import { useAuthStore } from "@/app/store/authStore";
import { authApi } from "./auth";
import { api } from "./axios";

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    queue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    queue = [];
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await authApi.refresh();
                const { accessToken, user } = response.data;

                useAuthStore.getState().setAuth(user, accessToken);

                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (e) {
                processQueue(e, null);
                useAuthStore.getState().clearAuth();
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    },
);
