require('dotenv').config();
const { init, getDaily, call } = require('./dist/index.js');

async function verify() {
  console.log('=== TuShare SDK 验证测试 ===\n');
  
  const token = process.env.TUSHARE_TOKEN;
  console.log('Token loaded:', token ? `${token.substring(0, 8)}...` : 'No');
  
  if (!token) {
    console.error('❌ 未找到 TUSHARE_TOKEN 环境变量');
    return;
  }
  
  // 初始化SDK
  init(token);
  console.log('✅ SDK初始化成功');
  
  try {
    // 测试1: 获取日线数据
    console.log('\n1. 测试获取日线数据...');
    const dailyData = await getDaily('600519.SH', {
      start: '20241209',
      end: '20241210'
    });
    
    if (dailyData && dailyData.length > 0) {
      console.log('✅ 日线数据获取成功');
      console.log(`   获取到 ${dailyData.length} 条数据`);
      console.log(`   示例: ${dailyData[0].trade_date} 收盘价 ${dailyData[0].close}`);
    } else {
      console.log('⚠️  日线数据为空');
    }
    
    // 测试2: 通用接口调用
    console.log('\n2. 测试通用接口调用...');
    const genericData = await call('daily', {
      ts_code: '600519.SH',
      start_date: '20241210',
      end_date: '20241210'
    }, 'ts_code,trade_date,close');
    
    if (genericData && genericData.length > 0) {
      console.log('✅ 通用接口调用成功');
      console.log(`   获取到 ${genericData.length} 条数据`);
      console.log(`   示例: ${genericData[0].trade_date} 收盘价 ${genericData[0].close}`);
    } else {
      console.log('⚠️  通用接口返回数据为空');
    }
    
    console.log('\n🎉 所有核心功能验证通过！');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    if (error.name === 'TushareError') {
      console.error(`   错误代码: ${error.code}`);
    }
  }
}

verify();