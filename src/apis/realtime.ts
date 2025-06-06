import { request } from '../core/request';
import { Quote } from '../types';
import { ValidationError } from '../errors';

export async function getRealtimeQuote(
  tsCodes: string | string[]
): Promise<Quote[]> {
  if (!tsCodes || (Array.isArray(tsCodes) && tsCodes.length === 0)) {
    throw new ValidationError('tsCodes is required and cannot be empty');
  }

  const codes = Array.isArray(tsCodes) ? tsCodes.join(',') : tsCodes;
  
  const params = {
    ts_code: codes,
  };

  const fields = 'ts_code,name,price,change,pct_chg,vol,amount,open,high,low,pre_close';

  return request<Quote>('query', params, fields);
}