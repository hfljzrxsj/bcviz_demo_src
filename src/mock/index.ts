// 引入mockjs  
import { mock } from 'mockjs';
// const { integer, float } = Random;
// 定义模拟数据  
// mock(/\/api\/sale\/subregion.*/, 'get', {
//   "code": 1000,
//   "data|1-50": [
//     {
//       "regionName": "@city",
//       "daySalesNum": ~~(random() * 10),
//       "monthSalesNum": ~~(random() * 100),
//       "monthRelativeRate": (random() - 0.5) * 10,
//       "yearSalesNum": ~~(random() * 1000),
//       level: 1
//     }
//   ]
// });
// mock(/\/api\/SalesVolumeMonitoring\/TerminalActivitySalesStructure\?.*type=year.*/, 'get', {
//   "code": 1000,
//   "data": [
//     { value: ~~(random() * 1000), name: '顺差让利' },
//     { value: ~~(random() * 1000), name: '分期合约' },
//     { value: ~~(random() * 1000), name: '金币合约' },
//   ]
// });
// mock(/\/api\/SalesVolumeMonitoring\/TerminalActivitySalesStructure\?.*type=month.*/, 'get', {
//   "code": 1000,
//   "data": [
//     { value: ~~(random() * 100), name: '顺差让利' },
//     { value: ~~(random() * 100), name: '分期合约' },
//     { value: ~~(random() * 100), name: '金币合约' },
//   ]
// });
// mock(/\/api\/SalesVolumeMonitoring\/TerminalActivitySalesStructure\?.*type=day.*/, 'get', {
//   "code": 1000,
//   "data": [
//     { value: ~~(random() * 10), name: '顺差让利' },
//     { value: ~~(random() * 10), name: '分期合约' },
//     { value: ~~(random() * 10), name: '金币合约' },
//   ]
// });
// const ramdomArr = () => new Array(25).fill('').map((_item, index) => ({ label: String.fromCharCode(index + 65), id: index }));
// mock(/\/api\/getAddressList.*/, 'get', {
//   "code": 1000,
//   "data": ramdomArr()
// });
mock('/queryAllProduct', 'get', [
  {
    "id": 1,
    "product_name": "手机",
    "price": 3999.990
  },
  {
    "id": 2,
    "product_name": "电脑",
    "price": 9999.000
  },
  {
    "id": 3,
    "product_name": "充气娃娃",
    "price": 600.000
  },
  {
    "id": 4,
    "product_name": "枸杞",
    "price": 49.000
  }
]);
mock(/findStockByProductId\/.*/, 'get', {
  salesStock: 100,
  realStock: 1000
});