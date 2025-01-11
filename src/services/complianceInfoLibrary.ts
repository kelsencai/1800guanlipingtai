import { request } from "umi";

export async function getComplianceInfoLibrary(params: any) {
    return request('/info/findMany', {
        method: 'POST',
        data: params
    });
}

export async function createComplianceInfoLibrary(params: any) {
    return request('/info/create', {
        method: 'POST',
        data: params
    });
}

export async function deleteComplianceInfoLibrary(id: number) {
    return request('/info/remove', {
        method: 'POST',
        data: { id: id }
    });
}

export async function updateComplianceInfoLibrary(params: any) {
    return request('/info/update', {
        method: 'POST',
        data: params
    });
}