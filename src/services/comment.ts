import { request } from 'umi';

export async function getMessage() {
  return request('/common/findMany', {
    method: 'POST',
  });
}

export async function createComment(params: any) {
  return request('/common/createComment', {
    method: 'POST',
    data: params,
  });
}

export async function removeComment(id: number) {
  return request('/common/removeComment', {
    method: 'POST',
    data: { id: id },
  });
}
export async function removeReply(id: number) {
  return request('/common/removeReply', {
    method: 'POST',
    data: { id: id },
  });
}

export async function replyComment(params: any) {
  return request('/common/replyComment', {
    method: 'POST',
    data: params,
  });
}
