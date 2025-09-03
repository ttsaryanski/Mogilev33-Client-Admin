export const host = `${import.meta.env.VITE_APP_SERVER_URL}/api`;

import { refreshAccessToken } from "./refresher";

let accessToken = null;
export function setAccessToken(token) {
    accessToken = token;
}

async function requester(method, url, data, signal) {
    await loadCsrfToken();

    if (accessToken) {
        option.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const option = {
        method,
        credentials: "include",
        headers: {},
        signal,
    };

    if (method !== "GET" && csrfToken) {
        option.headers["X-CSRF-Token"] = csrfToken;
    }

    if (data != undefined) {
        if (data instanceof FormData) {
            option.body = data;
        } else {
            option.headers["Content-Type"] = "application/json";
            option.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(host + url, option);

        if (!response.ok) {
            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return requester(method, url, data, signal);
                }
            }

            const error = await response.json();

            if (response.status === 429) {
                throw new Error(
                    error.message || "Too many requests. Try again later."
                );
            }

            throw new Error(error.message || "Something went wrong!");
        }

        if (response.status === 204) {
            return;
        }

        return response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request was aborted");
        }
        throw error;
    }
}

async function get(url, signal) {
    return requester("GET", url, undefined, signal);
}

async function post(url, data, signal) {
    return requester("POST", url, data, signal);
}

async function put(url, data, signal) {
    return requester("PUT", url, data, signal);
}

async function del(url, signal) {
    return requester("DELETE", url, undefined, signal);
}

export const api = {
    get,
    post,
    put,
    del,
};

let csrfToken = undefined;
async function loadCsrfToken() {
    if (!csrfToken) {
        const res = await fetch(host + "/csrf-token", {
            credentials: "include",
        });

        const data = await res.json();
        csrfToken = data.csrfToken;
    }
}
