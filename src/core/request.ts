import { TushareResponse, RequestParams } from '../types';
import { TushareError, RequestTimeoutError } from '../errors';

const TUSHARE_API_URL = 'https://api.tushare.pro';
const DEFAULT_TIMEOUT = 10000;

let globalToken: string | null = null;

export function init(token: string): void {
  globalToken = token;
}

async function getFetch(): Promise<any> {
  if (typeof fetch !== 'undefined') {
    return fetch;
  }
  
  try {
    const undici = await import('undici');
    return undici.fetch;
  } catch {
    throw new Error(
      'fetch is not available. Please upgrade to Node.js 18+ or install undici as a peer dependency.'
    );
  }
}

function transformResponse<T>(response: TushareResponse): T[] {
  if (!response.data || !response.data.fields || !response.data.items) {
    return [];
  }

  const { fields, items } = response.data;
  
  return items.map(item => {
    const obj: any = {};
    fields.forEach((field, index) => {
      obj[field] = item[index];
    });
    return obj as T;
  });
}

export async function request<T = any>(
  apiName: string,
  params?: Record<string, any>,
  fields?: string
): Promise<T[]> {
  if (!globalToken) {
    throw new Error('TuShare token not initialized. Call init(token) first.');
  }

  const fetchFn = await getFetch();
  
  const requestBody: RequestParams = {
    api_name: apiName,
    token: globalToken,
    params: params || {},
    fields
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetchFn(TUSHARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: TushareResponse = await response.json();

    if (data.code !== 0) {
      throw new TushareError(data.code, data.msg);
    }

    return transformResponse<T>(data);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new RequestTimeoutError(DEFAULT_TIMEOUT);
    }
    
    throw error;
  }
}

export async function call<T = any>(
  apiName: string,
  params?: Record<string, any>,
  fields?: string
): Promise<T[]> {
  return request<T>(apiName, params, fields);
}