const { init, getDaily, getStockBasic, call } = require('../dist/index.js');

// 初始化 SDK
init(process.env.TUSHARE_TOKEN);

async function demo() {
  console.log('=== TuShare JS SDK 演示 ===\n');

  try {
    // 1. 获取贵州茅台最近5个交易日数据
    console.log('1. 获取贵州茅台最近日线数据:');
    const moutaiData = await getDaily('600519.SH', {
      start: '20241201',
      end: '20241210'
    });
    
    console.log(`获取到 ${moutaiData.length} 条数据:`);
    moutaiData.slice(0, 3).forEach(item => {
      console.log(`  ${item.trade_date}: 开盘 ${item.open}, 收盘 ${item.close}, 涨跌幅 ${item.pct_chg}%`);
    });
    console.log('');

    // 2. 获取平安银行前复权数据
    console.log('2. 获取平安银行前复权数据:');
    const paData = await getDaily('000001.SZ', {
      start: '20241201',
      adj: 'qfq'
    });
    
    if (paData.length > 0) {
      const latest = paData[0];
      console.log(`  最新交易日: ${latest.trade_date}`);
      console.log(`  前复权价格: 开盘 ${latest.open}, 收盘 ${latest.close}`);
    }
    console.log('');

    // 3. 使用通用接口获取指定字段
    console.log('3. 使用通用接口获取简化数据:');
    const simpleData = await call('daily', {
      ts_code: '600519.SH',
      start_date: '20241209',
      end_date: '20241210'
    }, 'ts_code,trade_date,close,vol');
    
    simpleData.forEach(item => {
      console.log(`  ${item.trade_date}: 收盘价 ${item.close}, 成交量 ${item.vol}`);
    });
    console.log('');

    // 4. 获取股票基础信息（注意频率限制）
    console.log('4. 获取股票基础信息:');
    const stocks = await getStockBasic();
    console.log(`  总共有 ${stocks.length} 只股票`);
    console.log('  前5只股票:');
    stocks.slice(0, 5).forEach(stock => {
      console.log(`    ${stock.ts_code} - ${stock.name} (${stock.industry})`);
    });
    
  } catch (error) {
    console.error('API调用失败:', error.message);
    if (error.name === 'TushareError') {
      console.error(`错误代码: ${error.code}`);
    }
  }
}

demo();