import { request } from '../core/request';
import { StockBasic, MarketType } from '../types';

export async function getStockBasic(
  market?: MarketType
): Promise<StockBasic[]> {
  const params: any = {};

  if (market) {
    const marketMap = {
      '主板': 'Main',
      '科创板': 'STAR',
      '创业板': 'GEM'
    };
    params.market = marketMap[market];
  }

  const fields = 'ts_code,symbol,name,area,industry,market,list_date';

  return request<StockBasic>('stock_basic', params, fields);
}