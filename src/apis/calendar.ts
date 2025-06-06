import { request } from '../core/request';
import { TradeCal, GetTradeCalOptions } from '../types';
import { ValidationError } from '../errors';

/**
 * 获取交易日历
 * @param options 查询参数
 * @returns 交易日历数据
 */
export async function getTradeCal(options: GetTradeCalOptions = {}): Promise<TradeCal[]> {
  const { exchange, start_date, end_date, is_open } = options;
  
  const params: Record<string, any> = {};
  
  if (exchange) params.exchange = exchange;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (is_open) params.is_open = is_open;

  // 验证日期格式
  if (start_date && !/^\d{8}$/.test(start_date)) {
    throw new ValidationError('start_date must be in YYYYMMDD format');
  }
  
  if (end_date && !/^\d{8}$/.test(end_date)) {
    throw new ValidationError('end_date must be in YYYYMMDD format');
  }

  return request<TradeCal>('trade_cal', params);
}