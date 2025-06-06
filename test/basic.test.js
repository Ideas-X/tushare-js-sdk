require('dotenv').config();

const { 
  init, 
  getDaily, 
  call 
} = require('../dist/index.js');

const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN;

describe('TuShare SDK Basic Tests', () => {
  beforeAll(() => {
    console.log('Token loaded:', TUSHARE_TOKEN ? 'Yes' : 'No');
    if (!TUSHARE_TOKEN) {
      throw new Error('TUSHARE_TOKEN not found in environment variables');
    }
    init(TUSHARE_TOKEN);
  });

  test('getDaily - 获取贵州茅台日线数据', async () => {
    const data = await getDaily('600519.SH', {
      start: '20241201',
      end: '20241210'
    });
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const sample = data[0];
    expect(sample).toHaveProperty('ts_code', '600519.SH');
    expect(sample).toHaveProperty('trade_date');
    expect(sample).toHaveProperty('open');
    expect(sample).toHaveProperty('close');
    expect(sample).toHaveProperty('high');
    expect(sample).toHaveProperty('low');
    expect(sample).toHaveProperty('vol');
    expect(sample).toHaveProperty('amount');
    
    console.log('✅ 贵州茅台日线数据:', data.slice(0, 2));
  }, 10000);

  test('getDaily - 测试前复权', async () => {
    const data = await getDaily('000001.SZ', {
      start: '20241201',
      adj: 'qfq'
    });
    
    expect(Array.isArray(data)).toBe(true);
    console.log('✅ 前复权数据示例:', data.slice(0, 1));
  }, 10000);

  test('call - 通用接口调用', async () => {
    const data = await call('daily', {
      ts_code: '600519.SH',
      start_date: '20241209',
      end_date: '20241210'
    }, 'ts_code,trade_date,close,vol');
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const sample = data[0];
    expect(sample).toHaveProperty('ts_code');
    expect(sample).toHaveProperty('trade_date');
    expect(sample).toHaveProperty('close');
    expect(sample).toHaveProperty('vol');
    
    console.log('✅ 通用接口调用结果:', data);
  }, 10000);

  test('错误处理 - 无效股票代码', async () => {
    try {
      await getDaily('INVALID_CODE');
      fail('应该抛出错误');
    } catch (error) {
      expect(error).toBeDefined();
      console.log('✅ 正确处理无效代码:', error.message);
    }
  }, 10000);

  test('错误处理 - 空参数验证', async () => {
    try {
      await getDaily('');
      fail('应该抛出验证错误');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      console.log('✅ 正确处理空参数:', error.message);
    }
  }, 5000);
});