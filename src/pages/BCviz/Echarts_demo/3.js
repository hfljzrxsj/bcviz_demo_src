//@ts-check
// 获取图表容器元素
var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

// 假设你的数据点如下
var data = [10, 20, 30, 40, 50, 60, 70];
var colors = ['red', 'yellow', 'blue'];
var series = [];

// 为每段折线创建一个单独的series
for (var i = 0; i < data.length - 1; i++) {
  var color = colors[i % colors.length];
  series.push({
    type: 'line',
    data: [
      [i, data[i]],
      [i + 1, data[i + 1]]
    ],
    lineStyle: {
      color: color,
      width: 2
    },
    // 隐藏数据点标记，只显示折线
    symbol: 'none'
  });
}

option = {
  xAxis: {
    type: 'category',
    data: Array.from({ length: data.length }, (_, i) => i.toString())
  },
  yAxis: {
    type: 'value'
  },
  series: series
};



// 使用配置项显示图表
myChart.setOption(option);

/*
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    >
    <title>Echarts 折线图</title>
    <!-- 引入 Echarts 库 -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js"></script>
  </head>

  <body>
    <!-- 定义图表容器 -->
    <div
      id="main"
      style="width: 600px; height: 400px;"
    ></div>
    <script>
      // 获取图表容器元素
      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);
      var option;

      // 假设你的数据点如下
      var data = [10, 20, 30, 40, 50, 60, 70];
      var colors = ['red', 'yellow', 'blue'];
      var series = [];

      // 为每段折线创建一个单独的series
      for (var i = 0; i < data.length - 1; i++) {
        var color = colors[i % colors.length];
        series.push({
          type: 'line',
          data: [
            [i, data[i]],
            [i + 1, data[i + 1]]
          ],
          lineStyle: {
            color: color,
            width: 2
          },
          // 隐藏数据点标记，只显示折线
          symbol: 'none'
        });
      }

      option = {
        xAxis: {
          type: 'category',
          data: Array.from({ length: data.length }, (_, i) => i.toString())
        },
        yAxis: {
          type: 'value'
        },
        series: series
      };



      // 使用配置项显示图表
      myChart.setOption(option);
    </script>
  </body>

</html>
<script>
  fetch('https://cn.apihz.cn/api/tianqi/tqyb.php?id=10002669&key=31db4c118bb7fd52bc7e287b093db73d&sheng=%E9%BB%91%E9%BE%99%E6%B1%9F&place=%E5%8D%97%E5%B2%97')
</script>

*/