import http from '../http-common'
import {UserToken} from "../types/user.type";
import {UserLogin} from "../types/user.type";

export const login = (username: string, password: string) => {
    const userLogin: UserLogin = {
        username: username,
        password: password
    };
    return http.post<UserToken>('auth/login', userLogin)
        .then((response) => {
            console.log(response);
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data as UserToken;
        });
}

// export const login = (username: string, password: string) => {
//     const userLogin: UserLogin = {
//         username: username,
//         password: password
//     };
//     return axios
//         .post<UserToken>(API_URL + "login", userLogin)
//         .then((response) => {
//             console.log(response);
//             if (response.data) {
//                 localStorage.setItem("user", JSON.stringify(response.data));
//             }
//
//             return response.data as UserToken;
//         });
// };

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = (): UserToken | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr) as UserToken;

    return null;
};


const authService = {
    login,
    logout,
};

export default authService;