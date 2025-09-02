import { setAccessToken } from "./requester";
import { host } from "./requester";

export async function refreshAccessToken() {
    try {
        const response = await fetch(host + "/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) return false;

        const data = await response.json();
        setAccessToken(data.accessToken);
        return true;
    } catch {
        return false;
    }
}
