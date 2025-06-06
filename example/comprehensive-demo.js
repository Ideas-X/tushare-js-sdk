const { 
  init, 
  getDaily,
  getRealtimeQuote,
  getStockBasic,
  getTradeCal,
  getMinuteData,
  getWeeklyData,
  getMonthlyData,
  getIndexWeight,
  call
} = require('../dist/index.js');

// 从环境变量读取 TuShare token
require('dotenv').config();
const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN;

async function comprehensiveDemo() {
  try {
    // 初始化 SDK
    console.log('🚀 初始化 TuShare SDK...');
    init(TUSHARE_TOKEN);
    
    console.log('\n=== 基础数据接口演示 ===\n');
    
    // 1. 获取交易日历
    console.log('📅 获取交易日历数据...');
    try {
      const tradeCal = await getTradeCal({
        start_date: '20241201',
        end_date: '20241210'
      });
      console.log(`✅ 获取到 ${tradeCal.length} 条交易日历记录`);
      console.log('示例数据:', tradeCal.slice(0, 3));
    } catch (error) {
      console.log('❌ 交易日历需要更高权限:', error.message);
    }
    
    // 添加延迟避免频率限制
    await delay(2000);
    
    // 2. 获取股票基础信息
    console.log('\n📋 获取股票基础信息...');
    try {
      const stocks = await getStockBasic({
        ts_code: '600519.SH'
      });
      console.log('✅ 贵州茅台基础信息:', stocks[0]);
    } catch (error) {
      console.log('❌ 股票基础信息获取失败:', error.message);
    }
    
    await delay(2000);
    
    console.log('\n=== 行情数据接口演示 ===\n');
    
    // 3. 获取日线数据
    console.log('📈 获取日线行情数据...');
    const dailyData = await getDaily('600519.SH', {
      start: '20241201',
      end: '20241210'
    });
    console.log(`✅ 获取到 ${dailyData.length} 条日线数据`);
    console.log('最新行情:', dailyData[0]);
    
    await delay(2000);
    
    // 4. 获取分钟数据（需要高级权限）
    console.log('\n⏱️ 获取分钟级数据...');
    try {
      const minuteData = await getMinuteData('600519.SH', {
        freq: '5min',
        start_date: '20241210'
      });
      console.log(`✅ 获取到 ${minuteData.length} 条5分钟数据`);
      console.log('最新分钟数据:', minuteData[0]);
    } catch (error) {
      console.log('❌ 分钟数据需要高级权限:', error.message);
    }
    
    await delay(2000);
    
    // 5. 获取周线数据
    console.log('\n📊 获取周线数据...');
    try {
      const weeklyData = await getWeeklyData('600519.SH', {
        start_date: '20241101',
        end_date: '20241210'
      });
      console.log(`✅ 获取到 ${weeklyData.length} 条周线数据`);
      console.log('最新周线:', weeklyData[0]);
    } catch (error) {
      console.log('❌ 周线数据获取失败:', error.message);
    }
    
    await delay(2000);
    
    // 6. 获取月线数据
    console.log('\n📈 获取月线数据...');
    try {
      const monthlyData = await getMonthlyData('000001.SZ', {
        start_date: '20240101',
        end_date: '20241210'
      });
      console.log(`✅ 获取到 ${monthlyData.length} 条月线数据`);
      console.log('最新月线:', monthlyData[0]);
    } catch (error) {
      console.log('❌ 月线数据获取失败:', error.message);
    }
    
    await delay(2000);
    
    // 7. 获取实时行情（需要高级权限）
    console.log('\n⚡ 获取实时行情...');
    try {
      const quotes = await getRealtimeQuote(['600519.SH', '000001.SZ']);
      console.log('✅ 实时行情:', quotes);
    } catch (error) {
      console.log('❌ 实时行情需要高级权限:', error.message);
    }
    
    await delay(2000);
    
    console.log('\n=== 高级功能演示 ===\n');
    
    // 8. 使用通用接口
    console.log('🔧 使用通用接口获取数据...');
    const genericData = await call('daily', {
      ts_code: '600519.SH',
      start_date: '20241210',
      end_date: '20241210'
    }, 'ts_code,trade_date,close,vol,amount');
    console.log('✅ 通用接口调用成功:', genericData[0]);
    
    // 9. 错误处理演示
    console.log('\n⚠️ 错误处理演示...');
    try {
      await getDaily('INVALID_CODE');
    } catch (error) {
      console.log('✅ 正确捕获错误:', error.constructor.name);
    }
    
    console.log('\n🎉 演示完成！');
    
  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
    console.error('错误详情:', error);
  }
}

// 辅助函数：延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 权限说明
function showPermissionInfo() {
  console.log('\n📖 权限说明:');
  console.log('• 交易日历 (trade_cal): 需要 2000 积分');
  console.log('• 股票基础信息 (stock_basic): 需要 2000 积分，每天限5次');
  console.log('• 分钟数据 (stk_mins): 需要高级权限');
  console.log('• 实时行情: 需要高级权限');
  console.log('• 日线数据: 基础权限即可访问');
  console.log('• 详细权限说明: https://tushare.pro/document/1?doc_id=108');
  console.log('');
}

// 如果直接运行此文件
if (require.main === module) {
  if (!TUSHARE_TOKEN) {
    console.error('❌ 请先设置 TUSHARE_TOKEN 环境变量');
    console.log('1. 复制 .env.example 为 .env');
    console.log('2. 在 .env 文件中设置您的 TuShare token');
    process.exit(1);
  }
  
  showPermissionInfo();
  comprehensiveDemo();
}

module.exports = {
  comprehensiveDemo,
  showPermissionInfo
};