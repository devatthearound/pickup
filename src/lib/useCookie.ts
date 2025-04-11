import Cookies from 'js-cookie';

export interface CookieSetOptions {
    path?: string;
    expires?: number | Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export const setCookie = (name: string, value: string, options?: CookieSetOptions) => {
    if (getCookie(name)) deleteCookie(name, options);
    return Cookies.set(name, value, options);
}

export const getCookie = (name: string) => {
    return Cookies.get(name);
}

export const deleteCookie = (name: string, options?: CookieSetOptions) => {
    return Cookies.remove(name, options);
}