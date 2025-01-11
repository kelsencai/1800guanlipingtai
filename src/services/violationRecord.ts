import { request } from "umi";

export async function getUnit(params: any) {
    return request('/unit/findMany', {
        method: 'POST',
        data: params
    });
}
export async function getViolationRecord(params: any) {
    return request('/violation/findMany', {
        method: 'POST',
        data: params
    });
}

export async function createViolationRecord(params: any) {
    return request('/violation/create', {
        method: 'POST',
        data: params
    });
}

export async function updateViolationRecord(params: any) {
    return request('/violation/update', {
        method: 'POST',
        data: params
    });
}

export async function deleteViolationRecord(id: number) {
    return request('/violation/remove', {
        method: 'POST',
        data: { id: id }
    });
}