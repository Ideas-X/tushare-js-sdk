# tushare-js-sdk

[![npm version](https://badge.fury.io/js/tushare-js-sdk.svg)](https://badge.fury.io/js/tushare-js-sdk)
[![npm downloads](https://img.shields.io/npm/dm/tushare-js-sdk.svg)](https://www.npmjs.com/package/tushare-js-sdk)
[![GitHub license](https://img.shields.io/github/license/Ideas-X/tushare-js-sdk.svg)](https://github.com/Ideas-X/tushare-js-sdk/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Ideas-X/tushare-js-sdk.svg?style=social&label=Star)](https://github.com/Ideas-X/tushare-js-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/node/v/tushare-js-sdk.svg)](https://nodejs.org/)

一个轻量级的 TuShare Pro API TypeScript SDK，零依赖设计，支持 Node.js 和浏览器环境。

## 特性

![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/tushare-js-sdk.svg)
![Tree Shaking](https://img.shields.io/badge/tree%20shaking-supported-green.svg)

- 🚀 **轻量级** - 仅依赖原生 `fetch` API，可选集成 `undici`
- 📦 **零配置** - 仅需提供 TuShare Pro token，即可快速接入
- 🔧 **TypeScript 优先** - 完整的类型定义和智能提示
- 🌐 **跨平台** - 同时支持 Node.js 18+ 和现代浏览器
- ⚡ **快速调用** - 5 行代码内获取实时或历史行情数据

## 安装

```bash
npm install tushare-js-sdk
```

对于 Node.js < 18 环境，推荐安装 undici：

```bash
npm install undici
```

## 快速开始

```typescript
import { init, getRealtimeQuote, getDaily } from 'tushare-js-sdk';

// 初始化（使用你的 TuShare Pro token）
init(process.env.TUSHARE_TOKEN!);

// 获取实时行情
const [quote] = await getRealtimeQuote('600519.SH');
console.log(`贵州茅台最新价: ¥${quote.price}`);

// 获取日线数据（前复权）
const dailyBars = await getDaily('600519.SH', { 
  start: '20240101', 
  adj: 'qfq' 
});
console.log(`获取到 ${dailyBars.length} 条日线数据`);
```

## 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 TuShare Pro token：
```bash
TUSHARE_TOKEN=你的token
```

3. 确保 `.env` 文件已被 `.gitignore` 忽略，不会被提交到代码仓库。

## API 文档

### 初始化

```typescript
init(token: string): void
```

使用你的 TuShare Pro token 初始化 SDK。

### 实时行情

```typescript
getRealtimeQuote(tsCodes: string | string[]): Promise<Quote[]>
```

获取股票实时行情数据。

**参数：**
- `tsCodes` - 股票代码，支持单个代码或代码数组（如 `'600519.SH'` 或 `['600519.SH', '000001.SZ']`）

**返回：**
```typescript
interface Quote {
  ts_code: string;     // 股票代码
  name: string;        // 股票名称
  price: number;       // 最新价
  change: number;      // 涨跌额
  pct_chg: number;     // 涨跌幅(%)
  vol: number;         // 成交量
  amount: number;      // 成交额
  open: number;        // 开盘价
  high: number;        // 最高价
  low: number;         // 最低价
  pre_close: number;   // 昨收价
}
```

### 日线行情

```typescript
getDaily(tsCode: string, options?: GetDailyOptions): Promise<DailyBar[]>
```

获取股票日线历史数据。

**参数：**
- `tsCode` - 股票代码
- `options` - 可选参数
  - `start?: string` - 开始日期（格式：YYYYMMDD）
  - `end?: string` - 结束日期（格式：YYYYMMDD）
  - `adj?: 'qfq' | 'hfq'` - 复权类型（前复权/后复权）

**返回：**
```typescript
interface DailyBar {
  ts_code: string;      // 股票代码
  trade_date: string;   // 交易日期
  open: number;         // 开盘价
  high: number;         // 最高价
  low: number;          // 最低价
  close: number;        // 收盘价
  pre_close: number;    // 昨收价
  change: number;       // 涨跌额
  pct_chg: number;      // 涨跌幅(%)
  vol: number;          // 成交量(手)
  amount: number;       // 成交额(千元)
}
```

### 股票列表

```typescript
getStockBasic(market?: MarketType): Promise<StockBasic[]>
```

获取股票基础信息列表。

**参数：**
- `market` - 可选，市场类型（`'主板'` | `'科创板'` | `'创业板'`）

### 指数成分

```typescript
getIndexWeight(indexCode: string, date?: string): Promise<IndexWeight[]>
```

获取指数成分股及权重。

**参数：**
- `indexCode` - 指数代码
- `date` - 可选，交易日期（格式：YYYYMMDD）

### 通用接口

```typescript
call<T = any>(apiName: string, params?: Record<string, any>, fields?: string): Promise<T[]>
```

调用任意 TuShare Pro 原生接口。

**示例：**
```typescript
// 调用原生 daily 接口
const data = await call('daily', {
  ts_code: '600519.SH',
  start_date: '20240101'
}, 'ts_code,trade_date,close');
```

## 错误处理

SDK 提供了三种类型的错误：

```typescript
// TuShare API 错误
try {
  const data = await getDaily('INVALID_CODE');
} catch (error) {
  if (error instanceof TushareError) {
    console.log(`API错误 [${error.code}]: ${error.msg}`);
  }
}

// 网络超时错误
try {
  const data = await getDaily('600519.SH');
} catch (error) {
  if (error instanceof RequestTimeoutError) {
    console.log('请求超时，请检查网络连接');
  }
}

// 参数验证错误
try {
  const data = await getDaily(''); // 空代码
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`参数错误: ${error.message}`);
  }
}
```

## 环境要求

- **Node.js**: 16.0+ (推荐 18.0+ 以获得原生 fetch 支持)
- **浏览器**: 支持 fetch API 的现代浏览器
- **TuShare Pro**: 需要有效的 TuShare Pro 账户和 token

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

[![GitHub issues](https://img.shields.io/github/issues/Ideas-X/tushare-js-sdk.svg)](https://github.com/Ideas-X/tushare-js-sdk/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Ideas-X/tushare-js-sdk.svg)](https://github.com/Ideas-X/tushare-js-sdk/pulls)

## 链接

- 📦 [npm package](https://www.npmjs.com/package/tushare-js-sdk)
- 📖 [GitHub repository](https://github.com/Ideas-X/tushare-js-sdk)
- 🐛 [报告问题](https://github.com/Ideas-X/tushare-js-sdk/issues)
- 🔧 [TuShare Pro 官网](https://tushare.pro)

## 更新日志

### 1.0.0
- 🎉 初始版本发布
- ✅ 支持实时行情、日线数据、股票列表、指数成分等核心功能
- 📘 完整的 TypeScript 类型定义
- 🌐 跨平台支持（Node.js + 浏览器）

---

如果这个项目对你有帮助，请给个 ⭐ Star！