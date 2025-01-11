import { request } from "umi";

export async function getComplianceUnit(params: any) {
    return request('/unit/findMany', {
        method: 'POST',
        data: params
    });
}

export async function createComplianceUnit(params: any) {
    return request('/unit/create', {
        method: 'POST',
        data: params
    });
}

export async function deleteComplianceUnit(id: number) {
    return request('/unit/remove', {
        method: 'POST',
        data: { id: id }
    });
}