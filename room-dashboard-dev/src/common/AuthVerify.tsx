import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {UserToken} from "../types/user.type";

export const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props: any) => {
    let location = useLocation();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr) as UserToken;

            if (user) {
                const decodedJwt = parseJwt(user.access_token);

                if (decodedJwt.exp * 1000 < Date.now()) {
                    props.logOut();
                }
            }
        }
    }, [location, props]);

    return;
};

export default AuthVerify;