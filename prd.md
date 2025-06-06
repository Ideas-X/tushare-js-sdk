# `@ideasx/tushare-js-sdk` 简易功能规格说明

> **定位**：面向 Node.js / TypeScript / Next.js 项目的一站式 **TuShare** 数据封装。  
> **关键词**：**简单** · **零依赖** · **快速接入**

---

## 1. 产品目标

| 目标 | 说明 |
| ---- | ---- |
| **轻量级** | 只依赖 `fetch`（运行时自动选用全局 `fetch` 或 `node-fetch`）。 |
| **零配置** | 使用者仅需提供 **TuShare Pro** 的 `token`；默认直连 `https://api.tushare.pro`。 |
| **快速调用** | 典型用例应在 **5 行代码内**拿到实时或历史行情。 |

---

## 2. 功能列表

| 方法 | TypeScript 签名 | TuShare 对应接口 |
| ---- | --------------- | ---------------- |
| **初始化** | `init(token: string): void` | — |
| **实时行情** | `getRealtimeQuote(tsCodes: string | string[]): Promise<Quote[]>` | `get_realtime_quotes`（公开版）或自建 `/ws` 轮询【**注**】 :contentReference[oaicite:0]{index=0} |
| **日线行情** | `getDaily(tsCode: string, opts?: { start?: string; end?: string; adj?: 'qfq' \| 'hfq' }): Promise<DailyBar[]>` | `daily` 接口 :contentReference[oaicite:1]{index=1} |
| **股票列表** | `getStockBasic(market?: '主板' | '科创板' | '创业板'): Promise<StockBasic[]>` | `stock_basic` |
| **指数成分** | `getIndexWeight(indexCode: string, date?: string): Promise<IndexWeight[]>` | `index_weight` |
| **通用 RPC** | `call<T = any>(apiName: string, params?: Record<string, any>, fields?: string): Promise<T>` | 任意原生接口 :contentReference[oaicite:2]{index=2} |

> **返回数据**全部按接口文档字段原样返回（大小写、含义保持不变）

---

## 3. 技术实现

| 模块 | 选型 | 说明 |
| ---- | ---- | ---- |
| 网络库 | 原生 `fetch` + 可选 `undici` | 保持浏览器/Node 统一。 |
| 构建 | `tsup` | 输出 `cjs` + `esm` + 声明文件。 |
| 类型定义 | `zod` + `ts-morph` 生成 | 一次性抓取文档字段→生成 `interface`。 |
| 代码结构 | `/src/apis`（每个接口一个文件）<br>`/src/core/request.ts`（统一请求器） |

### 3.1 请求格式

```jsonc
POST https://api.tushare.pro
{
  "api_name": "daily",
  "token": "<YOUR_TOKEN>",
  "params": { "ts_code": "000001.SZ", "start_date": "20250101" },
  "fields": "ts_code,trade_date,open,close,high,low,vol"
}
```

### 3.2 响应格式
```json
{
  "code": 0,
  "msg": "",
  "data": { "fields": [...], "items": [...] }
}
```

## 4. 典型用法
```ts
import { init, getRealtimeQuote, getDaily } from '@ac-finance/tushare-sdk';

init(process.env.TUSHARE_TOKEN!);

// 1. 实时行情
const [quote] = await getRealtimeQuote('600519.SH');
console.log(`贵州茅台最新价: ¥${quote.price}`);

// 2. 最近一年日线（前复权）
const dailyBars = await getDaily('600519.SH', { start: '20240101', adj: 'qfq' });

```

## 5. 错误处理
- TuShare 返回 code != 0	抛出 TushareError，其中含 code / msg。
- 网络超时	默认 10 s 超时；超时抛出 RequestTimeoutError。
- 参数缺失/格式错误	通过 zod 校验，抛出 ValidationError
