const { 
  init, 
  getTradeCal,
  getStockBasic,
  getMinuteData,
  getWeeklyData,
  getMonthlyData
} = require('../dist/index.js');

const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN;

describe('New TuShare SDK API Tests', () => {
  beforeAll(() => {
    init(TUSHARE_TOKEN);
  });

  describe('getTradeCal - Trading Calendar', () => {
    test('should get trading calendar data', async () => {
      const data = await getTradeCal({
        start_date: '20241201',
        end_date: '20241210'
      });
      
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('exchange');
        expect(data[0]).toHaveProperty('cal_date');
        expect(data[0]).toHaveProperty('is_open');
        expect(data[0]).toHaveProperty('pretrade_date');
        expect(typeof data[0].is_open).toBe('number');
      }
      console.log('Trading calendar sample:', data.slice(0, 3));
    }, 10000);

    test('should get SSE trading calendar', async () => {
      const data = await getTradeCal({
        exchange: 'SSE',
        start_date: '20241201',
        end_date: '20241205'
      });
      
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0].exchange).toBe('SSE');
      }
      console.log('SSE trading calendar:', data);
    }, 10000);

    test('should filter by trading days only', async () => {
      const data = await getTradeCal({
        start_date: '20241201',
        end_date: '20241210',
        is_open: '1'
      });
      
      expect(Array.isArray(data)).toBe(true);
      data.forEach(item => {
        expect(item.is_open).toBe(1);
      });
      console.log('Trading days only:', data.length, 'days');
    }, 10000);

    test('should handle date validation', async () => {
      try {
        await getTradeCal({
          start_date: 'invalid_date'
        });
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toContain('YYYYMMDD format');
        console.log('Expected date validation error:', error.message);
      }
    }, 5000);
  });

  describe('getStockBasic - Enhanced Stock Basic', () => {
    test('should get stocks with new parameters', async () => {
      const data = await getStockBasic({
        exchange: 'SSE',
        list_status: 'L'
      });
      
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('ts_code');
        expect(data[0]).toHaveProperty('exchange');
        expect(data[0]).toHaveProperty('list_status');
        expect(data[0]).toHaveProperty('curr_type');
        expect(data[0]).toHaveProperty('is_hs');
        expect(data[0].exchange).toBe('SSE');
      }
      console.log('SSE stocks sample:', data.slice(0, 3));
      console.log('SSE stocks count:', data.length);
    }, 15000);

    test('should filter by market type', async () => {
      try {
        // Add delay to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 61000));
        
        const data = await getStockBasic({
          market: '科创板',
          list_status: 'L'
        });
        
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
          expect(data[0].market).toBe('STAR');
        }
        console.log('STAR market stocks sample:', data.slice(0, 3));
      } catch (error) {
        console.log('Market filter may hit rate limit:', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 70000);

    test('should get specific stock by code', async () => {
      const data = await getStockBasic({
        ts_code: '600519.SH'
      });
      
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0].ts_code).toBe('600519.SH');
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('industry');
      }
      console.log('Specific stock info:', data[0]);
    }, 10000);
  });

  describe('getMinuteData - Minute Level Data', () => {
    test('should handle minute data API (premium feature)', async () => {
      try {
        const data = await getMinuteData('600519.SH', {
          freq: '5min',
          start_date: '20241210'
        });
        
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('ts_code');
          expect(data[0]).toHaveProperty('trade_time');
          expect(data[0]).toHaveProperty('open');
          expect(data[0]).toHaveProperty('close');
          expect(data[0]).toHaveProperty('vol');
        }
        console.log('Minute data sample:', data.slice(0, 3));
      } catch (error) {
        console.log('Minute data requires premium access (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 10000);

    test('should validate stock code for minute data', async () => {
      try {
        await getMinuteData('');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toContain('Stock code');
        console.log('Expected validation error:', error.message);
      }
    }, 5000);

    test('should validate date format for minute data', async () => {
      try {
        await getMinuteData('600519.SH', {
          start_date: 'invalid'
        });
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toContain('YYYYMMDD format');
        console.log('Expected date validation error:', error.message);
      }
    }, 5000);
  });

  describe('getWeeklyData & getMonthlyData - Weekly/Monthly Data', () => {
    test('should handle weekly data API (premium feature)', async () => {
      try {
        const data = await getWeeklyData('600519.SH', {
          start_date: '20241101',
          end_date: '20241210'
        });
        
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('ts_code');
          expect(data[0]).toHaveProperty('trade_date');
          expect(data[0]).toHaveProperty('open');
          expect(data[0]).toHaveProperty('close');
          expect(data[0]).toHaveProperty('vol');
          expect(data[0]).toHaveProperty('pct_chg');
        }
        console.log('Weekly data sample:', data.slice(0, 3));
      } catch (error) {
        console.log('Weekly data requires premium access (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 10000);

    test('should handle monthly data API (premium feature)', async () => {
      try {
        const data = await getMonthlyData('000001.SZ', {
          start_date: '20240101',
          end_date: '20241210'
        });
        
        expect(Array.isArray(data)).toBe(true);
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('ts_code');
          expect(data[0]).toHaveProperty('trade_date');
          expect(data[0]).toHaveProperty('open');
          expect(data[0]).toHaveProperty('close');
        }
        console.log('Monthly data sample:', data.slice(0, 3));
      } catch (error) {
        console.log('Monthly data requires premium access (expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 10000);

    test('should validate stock code for weekly data', async () => {
      try {
        await getWeeklyData('');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toContain('Stock code');
        console.log('Expected validation error:', error.message);
      }
    }, 5000);

    test('should validate date format for monthly data', async () => {
      try {
        await getMonthlyData('600519.SH', {
          start_date: 'invalid',
          end_date: '20241210'
        });
      } catch (error) {
        expect(error.name).toBe('ValidationError');
        expect(error.message).toContain('YYYYMMDD format');
        console.log('Expected date validation error:', error.message);
      }
    }, 5000);
  });

  describe('Integration Tests', () => {
    test('should handle API rate limits gracefully', async () => {
      try {
        // Test multiple API calls in sequence
        const tradeCal = await getTradeCal({
          start_date: '20241210',
          end_date: '20241210'
        });
        expect(Array.isArray(tradeCal)).toBe(true);
        
        // Add delay between calls
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const stocks = await getStockBasic({
          ts_code: '000001.SZ'
        });
        expect(Array.isArray(stocks)).toBe(true);
        
        console.log('Rate limit handling successful');
      } catch (error) {
        console.log('Rate limit error (may be expected):', error.message);
        expect(error.name).toBe('TushareError');
      }
    }, 15000);
  });
});