import { request } from '../core/request';
import { MinuteBar, GetMinuteOptions } from '../types';
import { ValidationError } from '../errors';

/**
 * 获取分钟级别行情数据
 * @param tsCode 股票代码
 * @param options 查询参数
 * @returns 分钟级别行情数据
 */
export async function getMinuteData(
  tsCode: string,
  options: GetMinuteOptions = {}
): Promise<MinuteBar[]> {
  if (!tsCode || tsCode.trim() === '') {
    throw new ValidationError('Stock code (tsCode) is required');
  }

  const { freq = '1min', start_date, end_date } = options;
  
  const params: Record<string, any> = {
    ts_code: tsCode,
    freq
  };
  
  if (start_date) {
    if (!/^\d{8}$/.test(start_date)) {
      throw new ValidationError('start_date must be in YYYYMMDD format');
    }
    params.start_date = start_date;
  }
  
  if (end_date) {
    if (!/^\d{8}$/.test(end_date)) {
      throw new ValidationError('end_date must be in YYYYMMDD format');
    }
    params.end_date = end_date;
  }

  return request<MinuteBar>('stk_mins', params);
}