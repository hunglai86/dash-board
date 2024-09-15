import {UserToken} from "../types/user.type";

export default function authHeader() {
    const userStr = localStorage.getItem("user");
    let user: UserToken | null = null;
    if (userStr)
        user = JSON.parse(userStr) as UserToken;

    if (user && user.access_token) {
        return { Authorization: 'Bearer ' + user.access_token };
    } else {
        return { Authorization: '' };
    }
}