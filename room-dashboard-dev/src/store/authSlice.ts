import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
// import { setMessage } from "./message";

import AuthService, {getCurrentUser} from "../services/auth.service";
import {UserBase, UserCreate, UserLogin, UserToken} from "../types/user.type";


let user: UserToken | null = null;
user = getCurrentUser();


export const login = createAsyncThunk(
    "auth/login",
    async (userLogin: UserLogin, thunkAPI) => {
        const {username, password} = userLogin;
        try {
            const data = await AuthService.login(username, password);
            return {user: data};
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            // thunkAPI.dispatch(setMessage(message));
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await AuthService.logout();
    }
);

interface AuthState {
    isLoggedIn: boolean,
    user: UserToken | null
}

const initialState: AuthState = user
    ? {isLoggedIn: true, user}
    : {isLoggedIn: false, user: null} as AuthState;

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        })
    },
})


export default authSlice.reducer;