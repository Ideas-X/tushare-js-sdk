import { request } from '../core/request';
import { DailyBar, GetDailyOptions } from '../types';
import { ValidationError } from '../errors';

export async function getDaily(
  tsCode: string,
  options: GetDailyOptions = {}
): Promise<DailyBar[]> {
  if (!tsCode) {
    throw new ValidationError('tsCode is required');
  }

  const params: any = {
    ts_code: tsCode,
  };

  if (options.start) {
    params.start_date = options.start;
  }

  if (options.end) {
    params.end_date = options.end;
  }

  if (options.adj) {
    params.adj = options.adj;
  }

  const fields = 'ts_code,trade_date,open,high,low,close,pre_close,change,pct_chg,vol,amount';

  return request<DailyBar>('daily', params, fields);
}