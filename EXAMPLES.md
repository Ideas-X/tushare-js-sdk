# TuShare JS SDK 使用示例

本文档提供了 TuShare JS SDK 各个接口的详细使用示例。

## 目录

- [基础设置](#基础设置)
- [基础数据接口](#基础数据接口)
- [行情数据接口](#行情数据接口)
- [高级功能](#高级功能)
- [错误处理](#错误处理)
- [权限说明](#权限说明)

## 基础设置

```typescript
import { init } from 'tushare-js-sdk';

// 初始化 SDK
init(process.env.TUSHARE_TOKEN!);
```

## 基础数据接口

### 交易日历

```typescript
import { getTradeCal } from 'tushare-js-sdk';

// 获取指定日期范围的交易日历
const tradeCal = await getTradeCal({
  start_date: '20241201',
  end_date: '20241210'
});

// 获取特定交易所的交易日历
const sseTradeCal = await getTradeCal({
  exchange: 'SSE',
  start_date: '20241201',
  end_date: '20241210'
});

// 只获取交易日
const tradingDays = await getTradeCal({
  start_date: '20241201',
  end_date: '20241210',
  is_open: '1'
});

console.log('交易日历:', tradeCal);
// 输出示例:
// [
//   {
//     exchange: 'SSE',
//     cal_date: '20241201',
//     is_open: 0,
//     pretrade_date: '20241129'
//   }
// ]
```

### 股票基础信息

```typescript
import { getStockBasic } from 'tushare-js-sdk';

// 获取所有上市股票
const allStocks = await getStockBasic();

// 按交易所筛选
const sseStocks = await getStockBasic({
  exchange: 'SSE',
  list_status: 'L'
});

// 按市场类型筛选
const starStocks = await getStockBasic({
  market: '科创板'
});

// 获取特定股票信息
const stock = await getStockBasic({
  ts_code: '600519.SH'
});

// 获取沪深港通标的
const hsStocks = await getStockBasic({
  is_hs: 'H'  // H-沪股通, S-深股通, N-非沪深港通
});

console.log('贵州茅台信息:', stock[0]);
// 输出示例:
// {
//   ts_code: '600519.SH',
//   symbol: '600519',
//   name: '贵州茅台',
//   area: '贵州',
//   industry: '白酒',
//   market: 'Main',
//   list_date: '20010827',
//   exchange: 'SSE',
//   curr_type: 'CNY',
//   list_status: 'L',
//   is_hs: 'H'
// }
```

## 行情数据接口

### 日线数据

```typescript
import { getDaily } from 'tushare-js-sdk';

// 获取指定时间段的日线数据
const dailyData = await getDaily('600519.SH', {
  start: '20241201',
  end: '20241210'
});

// 获取前复权数据
const qfqData = await getDaily('600519.SH', {
  start: '20241201',
  adj: 'qfq'
});

// 获取后复权数据
const hfqData = await getDaily('600519.SH', {
  start: '20241201',
  adj: 'hfq'
});

console.log('日线数据:', dailyData[0]);
// 输出示例:
// {
//   ts_code: '600519.SH',
//   trade_date: '20241210',
//   open: 1520.0,
//   high: 1550.0,
//   low: 1510.0,
//   close: 1546.59,
//   pre_close: 1518.8,
//   change: 27.79,
//   pct_chg: 1.83,
//   vol: 60312.1,
//   amount: 925080.0
// }
```

### 分钟级数据

```typescript
import { getMinuteData } from 'tushare-js-sdk';

// 获取1分钟数据
const minute1Data = await getMinuteData('600519.SH', {
  freq: '1min',
  start_date: '20241210'
});

// 获取5分钟数据
const minute5Data = await getMinuteData('600519.SH', {
  freq: '5min',
  start_date: '20241210'
});

// 获取指定时间段的15分钟数据
const minute15Data = await getMinuteData('600519.SH', {
  freq: '15min',
  start_date: '20241201',
  end_date: '20241210'
});

console.log('5分钟数据:', minute5Data[0]);
// 输出示例:
// {
//   ts_code: '600519.SH',
//   trade_time: '2024-12-10 15:00:00',
//   open: 1506.0,
//   high: 1506.6,
//   low: 1505.31,
//   close: 1506.39,
//   vol: 98838,
//   amount: 148873550
// }
```

### 周线/月线数据

```typescript
import { getWeeklyData, getMonthlyData } from 'tushare-js-sdk';

// 获取周线数据
const weeklyData = await getWeeklyData('600519.SH', {
  start_date: '20241101',
  end_date: '20241210'
});

// 获取月线数据
const monthlyData = await getMonthlyData('600519.SH', {
  start_date: '20240101',
  end_date: '20241210'
});

console.log('周线数据:', weeklyData[0]);
console.log('月线数据:', monthlyData[0]);
// 输出格式与日线数据相同，但时间周期不同
```

### 实时行情

```typescript
import { getRealtimeQuote } from 'tushare-js-sdk';

// 获取单个股票实时行情
const [quote] = await getRealtimeQuote('600519.SH');

// 获取多个股票实时行情
const quotes = await getRealtimeQuote(['600519.SH', '000001.SZ', '000002.SZ']);

console.log('实时行情:', quote);
// 输出示例:
// {
//   ts_code: '600519.SH',
//   name: '贵州茅台',
//   price: 1546.59,
//   change: 27.79,
//   pct_chg: 1.83,
//   vol: 60312.1,
//   amount: 925080.0,
//   open: 1520.0,
//   high: 1550.0,
//   low: 1510.0,
//   pre_close: 1518.8
// }
```

## 高级功能

### 通用接口调用

```typescript
import { call } from 'tushare-js-sdk';

// 调用任意 TuShare API
const data = await call('daily', {
  ts_code: '600519.SH',
  start_date: '20241201',
  end_date: '20241210'
}, 'ts_code,trade_date,close,vol');

// 调用股票基础信息接口
const stocks = await call('stock_basic', {
  exchange: 'SSE',
  list_status: 'L'
}, 'ts_code,symbol,name,list_date');

// 调用交易日历接口
const calendar = await call('trade_cal', {
  exchange: 'SSE',
  start_date: '20241201',
  end_date: '20241210'
});

console.log('通用接口调用结果:', data);
```

### 批量数据处理

```typescript
import { getDaily, getStockBasic } from 'tushare-js-sdk';

// 获取多只股票的历史数据
async function getBatchData(tsCodes: string[], options: any) {
  const results = [];
  
  for (const tsCode of tsCodes) {
    try {
      const data = await getDaily(tsCode, options);
      results.push({ tsCode, data });
      
      // 避免频率限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`获取 ${tsCode} 数据失败:`, error.message);
    }
  }
  
  return results;
}

// 使用示例
const stocks = ['600519.SH', '000001.SZ', '000002.SZ'];
const batchData = await getBatchData(stocks, {
  start: '20241201',
  end: '20241210'
});
```

## 错误处理

```typescript
import { 
  TushareError, 
  RequestTimeoutError, 
  ValidationError 
} from 'tushare-js-sdk';

try {
  const data = await getDaily('600519.SH');
} catch (error) {
  if (error instanceof TushareError) {
    console.log(`TuShare API 错误 [${error.code}]: ${error.msg}`);
    
    // 处理不同类型的错误
    switch (error.code) {
      case 40203:
        console.log('权限不足或超出调用限制');
        break;
      case 40001:
        console.log('参数错误');
        break;
      default:
        console.log('其他 API 错误');
    }
  } else if (error instanceof RequestTimeoutError) {
    console.log(`请求超时 (${error.timeout}ms)`);
  } else if (error instanceof ValidationError) {
    console.log(`参数验证失败: ${error.message}`);
  } else {
    console.log('未知错误:', error.message);
  }
}
```

### 重试机制

```typescript
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (error instanceof RequestTimeoutError && i < maxRetries - 1) {
        console.log(`请求超时，${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // 指数退避
      } else {
        throw error;
      }
    }
  }
  throw new Error('超出最大重试次数');
}

// 使用示例
const data = await retryRequest(() => getDaily('600519.SH', {
  start: '20241201',
  end: '20241210'
}));
```

## 权限说明

### 接口权限等级

| 接口 | 所需积分 | 调用限制 | 说明 |
|------|----------|----------|------|
| `daily` | 基础权限 | 120点/分钟 | 日线数据 |
| `trade_cal` | 2000积分 | 限制调用 | 交易日历 |
| `stock_basic` | 2000积分 | 5次/天, 1次/分钟 | 股票基础信息 |
| `stk_mins` | 高级权限 | VIP用户 | 分钟数据 |
| `weekly`/`monthly` | 中级权限 | 限制调用 | 周线/月线 |
| 实时行情 | 高级权限 | VIP用户 | 实时数据 |

### 权限获取

1. **注册 TuShare Pro 账户**: https://tushare.pro/register
2. **获取积分**: 通过签到、邀请等方式获取积分
3. **升级权限**: 根据需要购买相应的数据权限
4. **查看权限详情**: https://tushare.pro/document/1?doc_id=108

### 调用建议

1. **合理控制频率**: 避免超出接口调用限制
2. **错误处理**: 正确处理权限不足等错误
3. **数据缓存**: 对于基础数据建议本地缓存
4. **批量处理**: 避免频繁调用，使用批量接口

## 完整示例

查看 `example/comprehensive-demo.js` 文件了解完整的使用示例。

```bash
# 运行完整示例
npm run example
```