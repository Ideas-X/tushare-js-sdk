import { request } from '../core/request';
import { IndexWeight } from '../types';
import { ValidationError } from '../errors';

export async function getIndexWeight(
  indexCode: string,
  date?: string
): Promise<IndexWeight[]> {
  if (!indexCode) {
    throw new ValidationError('indexCode is required');
  }

  const params: any = {
    index_code: indexCode,
  };

  if (date) {
    params.trade_date = date;
  }

  const fields = 'index_code,con_code,trade_date,weight';

  return request<IndexWeight>('index_weight', params, fields);
}