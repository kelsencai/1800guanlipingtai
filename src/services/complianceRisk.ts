import { request } from "umi";

export async function getComplianceRisk(params: any) {
    return request('/risk/findMany', {
        method: 'POST',
        data: params
    });
}

export async function createComplianceRisk(params: any) {
    return request('/risk/create', {
        method: 'POST',
        data: params
    });
}

export async function updateComplianceRisk(params: any) {
    return request('/risk/update', {
        method: 'POST',
        data: params
    });
}

export async function deleteComplianceRisk(id: number) {
    return request('/risk/remove', {
        method: 'POST',
        data: { id: id }
    });
}