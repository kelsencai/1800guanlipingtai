import type { RequestOptions } from '@@/plugin-request/request';
import { history, type RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { API_URL_DEV, API_URL_RELEASE } from './runtime';

const isDev = process.env.NODE_ENV === 'development';
/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any) => {
      if (error.name === 'AxiosError') {
        const { response } = error;
        if (response.status === 401) {
          history.push('/user/login');
          return;
        }
        message.error(response?.data?.msg ?? '网络错误,请稍后重试!');
        return;
      }
      message.error('网络错误,请稍后重试!');
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const Host = isDev ? API_URL_DEV : API_URL_RELEASE;
      const URL = Host.concat(config?.url ?? '');
      const Authorization = `Bearer ${localStorage.getItem('access_token')}`;
      config.url = URL;
      config.headers = {
        ...config.headers,
        Authorization: Authorization,
      };
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    async (response: any) => {
      // 拦截响应数据，进行个性化处理
      if (response?.data?.code === 200) {
        return response;
      }
    },
  ],
};
