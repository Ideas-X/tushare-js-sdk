import { request } from '../core/request';
import { WeeklyMonthlyBar, GetWeeklyMonthlyOptions } from '../types';
import { ValidationError } from '../errors';

/**
 * 获取周线行情数据
 * @param tsCode 股票代码
 * @param options 查询参数
 * @returns 周线行情数据
 */
export async function getWeeklyData(
  tsCode: string,
  options: GetWeeklyMonthlyOptions = {}
): Promise<WeeklyMonthlyBar[]> {
  if (!tsCode || tsCode.trim() === '') {
    throw new ValidationError('Stock code (tsCode) is required');
  }

  const { start_date, end_date } = options;
  
  const params: Record<string, any> = {
    ts_code: tsCode
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

  return request<WeeklyMonthlyBar>('weekly', params);
}

/**
 * 获取月线行情数据
 * @param tsCode 股票代码
 * @param options 查询参数
 * @returns 月线行情数据
 */
export async function getMonthlyData(
  tsCode: string,
  options: GetWeeklyMonthlyOptions = {}
): Promise<WeeklyMonthlyBar[]> {
  if (!tsCode || tsCode.trim() === '') {
    throw new ValidationError('Stock code (tsCode) is required');
  }

  const { start_date, end_date } = options;
  
  const params: Record<string, any> = {
    ts_code: tsCode
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

  return request<WeeklyMonthlyBar>('monthly', params);
}