import { request } from "umi";

export async function getComplianceCase(params: any) {
    return request('/case/findMany', {
        method: 'POST',
        data: params
    });
}

export async function creactComplianceCase(params: any) {
    return request('/case/create', {
        method: 'POST',
        data: params
    });
}

export async function deleteComplianceCase(id: number) {
    return request('/case/remove', {
        method: 'POST',
        data: { id: id }
    });
}

export async function updateComplianceCase(params: any) {
    return request('/case/update', {
        method: 'POST',
        data: params
    });
}