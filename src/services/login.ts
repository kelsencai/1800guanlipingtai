// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function login(username?: string, password?: string) {
    return request('/auth/login', {
        method: 'POST',
        data: {
            username,
            password
        },
    });
}

export async function getUser() {
    return request('/user/getUser', {
        method: 'GET',
    });
}