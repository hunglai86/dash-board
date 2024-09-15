export interface UserToken {
    access_token: string,
    token_type: string,
    role: string,
    username: string,
}

export interface UserLogin {
    username: string,
    password: string,
}

export interface UserBase {
    username: string,
    full_name: string,
    role: string,
    email: string,
    phone?: string,
    disabled: boolean,
    scope: string[]
}

export interface UserCreate extends UserBase{
    password: string,
}

export interface UserUpdate {
    username: string,
    password?: string,
    full_name?: string,
    role?: string,
    email?: string,
    phone?: string,
    disabled?: boolean,
    scope?: string[]
}

