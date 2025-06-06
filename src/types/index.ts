export interface TushareResponse<T = any> {
  code: number;
  msg: string;
  data: {
    fields: string[];
    items: any[][];
  } | null;
}

export interface Quote {
  ts_code: string;
  name: string;
  price: number;
  change: number;
  pct_chg: number;
  vol: number;
  amount: number;
  open: number;
  high: number;
  low: number;
  pre_close: number;
}

export interface DailyBar {
  ts_code: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  pre_close: number;
  change: number;
  pct_chg: number;
  vol: number;
  amount: number;
}

export interface StockBasic {
  ts_code: string;
  symbol: string;
  name: string;
  area: string;
  industry: string;
  market: string;
  list_date: string;
}

export interface IndexWeight {
  index_code: string;
  con_code: string;
  trade_date: string;
  weight: number;
}

export interface RequestParams {
  api_name: string;
  token: string;
  params?: Record<string, any>;
  fields?: string;
}

export interface GetDailyOptions {
  start?: string;
  end?: string;
  adj?: 'qfq' | 'hfq';
}

export type MarketType = '主板' | '科创板' | '创业板';