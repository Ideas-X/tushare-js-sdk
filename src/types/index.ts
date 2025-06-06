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
  exchange: string;
  curr_type: string;
  list_status: string;
  delist_date: string;
  is_hs: string;
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

// Trading Calendar Types
export interface TradeCal {
  exchange: string;
  cal_date: string;
  is_open: number;
  pretrade_date: string;
}

export interface GetTradeCalOptions {
  exchange?: string;
  start_date?: string;
  end_date?: string;
  is_open?: '0' | '1';
}

// Enhanced Stock Basic Options
export interface GetStockBasicOptions {
  ts_code?: string;
  name?: string;
  exchange?: 'SSE' | 'SZSE';
  market?: MarketType;
  list_status?: 'L' | 'D' | 'P';
  is_hs?: 'N' | 'H' | 'S';
}

// Minute Data Types
export interface MinuteBar {
  ts_code: string;
  trade_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  amount: number;
}

export interface GetMinuteOptions {
  freq?: '1min' | '5min' | '15min' | '30min' | '60min';
  start_date?: string;
  end_date?: string;
}

// Weekly/Monthly Data Types
export interface WeeklyMonthlyBar {
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

export interface GetWeeklyMonthlyOptions {
  start_date?: string;
  end_date?: string;
}