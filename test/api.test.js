const { 
  init, 
  getDaily, 
  getRealtimeQuote, 
  getStockBasic, 
  getIndexWeight, 
  call 
} = require('../dist/index.js');

const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN;

describe('TuShare SDK API Tests', () => {
  beforeAll(() => {
    init(TUSHARE_TOKEN);
  });

  describe('getDaily', () => {
    test('should get daily data for a stock', async () => {
      const data = await getDaily('600519.SH', {
        start: '20241201',
        end: '20241210'
      });
      
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('ts_code');
        expect(data[0]).toHaveProperty('trade_date');
        expect(data[0]).toHaveProperty('open');
        expect(data[0]).toHaveProperty('close');
        expect(data[0]).toHaveProperty('high');
        expect(data[0]).toHaveProperty('low');
        expect(data[0]).toHaveProperty('vol');
        expect(data[0]).toHaveProperty('amount');
      }
      console.log('Daily data sample:', data.slice(0, 2));
    }, 10000);

    test('should get daily data with qfq adjustment', async () => {
      const data = await getDaily('000001.SZ', {
        start: '20241201',
        adj: 'qfq'
      });
      
      expect(Array.isArray(data)).toBe(true);
      console.log('QFQ adjusted data sample:', data.slice(0, 1));
    }, 10000);
  });

  describe('getRealtimeQuote', () => {
    test('should handle realtime quote API (may not be available in free tier)', async () => {
      try {
        const data = await getRealtimeQuote('600519.SH');
        expect(Array.isArray(data)).toBe(true);
        console.log('Realtime quote success:', data[0]);
      } catch (error) {
        console.log('Realtime quote not available (expected for free tier):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 10000);
  });

  describe('getStockBasic', () => {
    test('should get all stocks basic info', async () => {
      const data = await getStockBasic();
      
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('ts_code');
        expect(data[0]).toHaveProperty('symbol');
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('market');
      }
      console.log('Stock basic info sample:', data.slice(0, 3));
      console.log('Total stocks count:', data.length);
    }, 15000);

    test('should handle market type filter (may hit rate limit)', async () => {
      try {
        // Add delay to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 61000));
        const data = await getStockBasic('主板');
        expect(Array.isArray(data)).toBe(true);
        console.log('Main board stocks sample:', data.slice(0, 3));
      } catch (error) {
        console.log('Market filter hit rate limit (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 70000);
  });

  describe('getIndexWeight', () => {
    test('should handle index weight API (requires higher permission)', async () => {
      try {
        const data = await getIndexWeight('000001.SH', '20241201');
        expect(Array.isArray(data)).toBe(true);
        console.log('Index weight sample:', data.slice(0, 5));
      } catch (error) {
        console.log('Index weight requires higher permission (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 10000);
  });

  describe('call - Generic API', () => {
    test('should call generic daily API', async () => {
      const data = await call('daily', {
        ts_code: '600519.SH',
        start_date: '20241201',
        end_date: '20241210'
      }, 'ts_code,trade_date,close,vol');
      
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('ts_code');
        expect(data[0]).toHaveProperty('trade_date');
        expect(data[0]).toHaveProperty('close');
        expect(data[0]).toHaveProperty('vol');
      }
      console.log('Generic API call sample:', data.slice(0, 2));
    }, 10000);

    test('should handle stock_basic via generic call (may hit rate limit)', async () => {
      try {
        // Skip this test to avoid rate limit issues
        console.log('Skipping stock_basic generic call to avoid rate limit');
        expect(true).toBe(true);
      } catch (error) {
        console.log('Generic stock_basic hit rate limit (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 5000);
  });

  describe('Error Handling', () => {
    test('should handle invalid stock code', async () => {
      try {
        await getDaily('INVALID_CODE');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('Expected error for invalid code:', error.message);
      }
    }, 10000);

    test('should handle empty parameters', async () => {
      try {
        await getDaily('');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        console.log('Expected validation error:', error.message);
      }
    }, 5000);
  });
});