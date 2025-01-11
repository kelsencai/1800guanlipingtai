import { request } from "@umijs/max";

export async function uploadFile(file: any) {
    return request('/file/uploadFile', {
        method: 'POST',
        data: file
    });
}