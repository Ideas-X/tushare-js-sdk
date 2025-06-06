import { request } from '../core/request';
import { StockBasic, GetStockBasicOptions } from '../types';

/**
 * 获取股票基础信息
 * @param options 查询参数
 * @returns 股票基础信息列表
 */
export async function getStockBasic(
  options: GetStockBasicOptions = {}
): Promise<StockBasic[]> {
  const { ts_code, name, exchange, market, list_status = 'L', is_hs } = options;
  
  const params: Record<string, any> = {};
  
  if (ts_code) params.ts_code = ts_code;
  if (name) params.name = name;
  if (exchange) params.exchange = exchange;
  if (list_status) params.list_status = list_status;
  if (is_hs) params.is_hs = is_hs;
  
  if (market) {
    const marketMap = {
      '主板': 'Main',
      '科创板': 'STAR',
      '创业板': 'GEM'
    };
    params.market = marketMap[market];
  }

  const fields = 'ts_code,symbol,name,area,industry,market,list_date,exchange,curr_type,list_status,delist_date,is_hs';

  return request<StockBasic>('stock_basic', params, fields);
}