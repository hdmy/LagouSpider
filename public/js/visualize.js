var mapNum = echarts.init(document.getElementById('MapNum'));
var mapSalary = echarts.init(document.getElementById('MapSalary'));
var jobCategory = echarts.init(document.getElementById('jobCategory'));
var hotCity = echarts.init(document.getElementById('hotCity'));
// var dailyNum = echarts.init(document.getElementById('dailyNum'));
var jobSalary = echarts.init(document.getElementById('jobSalary'));
// var salaryRange = echarts.init(document.getElementById('salaryRange'));
var education = echarts.init(document.getElementById('education'));
var workYear = echarts.init(document.getElementById('workYear'));
var finance = echarts.init(document.getElementById('finance'));
var ability = echarts.init(document.getElementById('ability'));

(function () {
  showEcharts();
})();

/**
 * 
 * @param {Object} element 
 * @param {String} title 
 * @param {String} text
 * @param {Object} data [{ name: "海门", value: 9 }]
 */
function drawMap(element, title, text, data) {
  // 基于准备好的dom，初始化echarts实例
  element.hideLoading();
  var cache = {};
  var geoCoordMap = {
    '中卫':[105.196754,37.52112414],
    '雅安':[103.009356,29.99971613],
    '延边':[129.485902,42.89641413],
    '益阳':[112.366547,28.58808813],
    '孝感':[113.935734,30.92795513],
    '许昌':[113.835312,34.0267413],
    '襄阳':[112.176326,32.09493412],
    '铜仁':[109.196161,27.72627114],
    '台中':[120.67,24.15],
    '上饶':[117.955464,28.45762313],
    '信阳':[114.085491,32.12858213],
    '黔西南':[104.900558,25.09514811],
    '铜陵':[117.819429,30.9409314],
    '黔南':[107.523205,26.26453611],
    '莆田':[119.077731,25.4484513],
    '龙岩':[117.017997,25.07868513],
    '宜春':[114.400039,27.8111313],
    '六安':[116.505253,31.75555813],
    '宁德':[119.542082,26.65652714],
    '乐山':[103.760824,29.60095813],
    '吉安':[114.992039,27.11384813],
    '黄冈':[114.906618,30.44610914],
    '赣州':[114.935909,25.84529613],
    '阜阳':[115.820932,32.90121113],
    '黄石':[115.050683,30.21612713],
    '滁州':[118.32457,32.31735113],
    '宿州':[116.988692,33.63677213],
    '亳州':[115.787928,33.87121113],
    '丽江':[100.229628,26.87535113],
    '眉山':[103.84143,30.06111513],
    '池州':[117.494477,30.66001914],
    '蚌埠':[117.35708,32.92949913],
    '高雄':[120.28,22.62],
    '玉林':[110.151676,22.64397414],
    '新乡':[113.91269,35.30725813],
    '三沙':[112.58,9.37],
    '南阳':[112.542842,33.0114213],
    '广元':[105.819687,32.4410413],
    '郴州':[113.037704,25.78226413],
    '安顺':[105.92827,26.22859513],
    "海门": [121.15, 31.89],
    "鄂尔多斯": [109.781327, 39.608266],
    "招远": [120.38, 37.35],
    "舟山": [122.207216, 29.985295],
    "齐齐哈尔": [123.97, 47.33],
    "盐城": [120.13, 33.38],
    "赤峰": [118.87, 42.28],
    "青岛": [120.33, 36.07],
    "乳山": [121.52, 36.89],
    "金昌": [102.188043, 38.520089],
    "泉州": [118.58, 24.93],
    "莱西": [120.53, 36.86],
    "日照": [119.46, 35.42],
    "胶南": [119.97, 35.88],
    "南通": [121.05, 32.08],
    "拉萨": [91.11, 29.97],
    "云浮": [112.02, 22.93],
    "梅州": [116.1, 24.55],
    "文登": [122.05, 37.2],
    "上海": [121.48, 31.22],
    "攀枝花": [101.718637, 26.582347],
    "威海": [122.1, 37.5],
    "承德": [117.93, 40.97],
    "厦门": [118.1, 24.46],
    "汕尾": [115.375279, 22.786211],
    "潮州": [116.63, 23.68],
    "丹东": [124.37, 40.13],
    "太仓": [121.1, 31.45],
    "曲靖": [103.79, 25.51],
    "烟台": [121.39, 37.52],
    "福州": [119.3, 26.08],
    "瓦房店": [121.979603, 39.627114],
    "即墨": [120.45, 36.38],
    "抚顺": [123.97, 41.97],
    "玉溪": [102.52, 24.35],
    "张家口": [114.87, 40.82],
    "阳泉": [113.57, 37.85],
    "莱州": [119.942327, 37.177017],
    "湖州": [120.1, 30.86],
    "汕头": [116.69, 23.39],
    "昆山": [120.95, 31.39],
    "宁波": [121.56, 29.86],
    "湛江": [110.359377, 21.270708],
    "揭阳": [116.35, 23.55],
    "荣成": [122.41, 37.16],
    "连云港": [119.16, 34.59],
    "葫芦岛": [120.836932, 40.711052],
    "常熟": [120.74, 31.64],
    "东莞": [113.75, 23.04],
    "河源": [114.68, 23.73],
    "淮安": [119.15, 33.5],
    "泰州": [119.9, 32.49],
    "南宁": [108.33, 22.84],
    "营口": [122.18, 40.65],
    "惠州": [114.4, 23.09],
    "江阴": [120.26, 31.91],
    "蓬莱": [120.75, 37.8],
    "韶关": [113.62, 24.84],
    "嘉峪关": [98.289152, 39.77313],
    "广州": [113.23, 23.16],
    "延安": [109.47, 36.6],
    "太原": [112.53, 37.87],
    "清远": [113.01, 23.7],
    "中山": [113.38, 22.52],
    "昆明": [102.73, 25.04],
    "寿光": [118.73, 36.86],
    "盘锦": [122.070714, 41.119997],
    "长治": [113.08, 36.18],
    "深圳": [114.07, 22.62],
    "珠海": [113.52, 22.3],
    "宿迁": [118.3, 33.96],
    "咸阳": [108.72, 34.36],
    "铜川": [109.11, 35.09],
    "平度": [119.97, 36.77],
    "佛山": [113.11, 23.05],
    "海口": [110.35, 20.02],
    "江门": [113.06, 22.61],
    "章丘": [117.53, 36.72],
    "肇庆": [112.44, 23.05],
    "大连": [121.62, 38.92],
    "临汾": [111.5, 36.08],
    "吴江": [120.63, 31.16],
    "石嘴山": [106.39, 39.04],
    "沈阳": [123.38, 41.8],
    "苏州": [120.62, 31.32],
    "茂名": [110.88, 21.68],
    "嘉兴": [120.76, 30.77],
    "长春": [125.35, 43.88],
    "胶州": [120.03336, 36.264622],
    "银川": [106.27, 38.47],
    "张家港": [120.555821, 31.875428],
    "三门峡": [111.19, 34.76],
    "锦州": [121.15, 41.13],
    "南昌": [115.89, 28.68],
    "柳州": [109.4, 24.33],
    "三亚": [109.511909, 18.252847],
    "自贡": [104.778442, 29.33903],
    "吉林": [126.57, 43.87],
    "阳江": [111.95, 21.85],
    "泸州": [105.39, 28.91],
    "西宁": [101.74, 36.56],
    "宜宾": [104.56, 29.77],
    "呼和浩特": [111.65, 40.82],
    "成都": [104.06, 30.67],
    "大同": [113.3, 40.12],
    "镇江": [119.44, 32.2],
    "桂林": [110.28, 25.29],
    "张家界": [110.479191, 29.117096],
    "宜兴": [119.82, 31.36],
    "北海": [109.12, 21.49],
    "西安": [108.95, 34.27],
    "金坛": [119.56, 31.74],
    "东营": [118.49, 37.46],
    "牡丹江": [129.58, 44.6],
    "遵义": [106.9, 27.7],
    "绍兴": [120.58, 30.01],
    "扬州": [119.42, 32.39],
    "常州": [119.95, 31.79],
    "潍坊": [119.1, 36.62],
    "重庆": [106.54, 29.59],
    "台州": [121.420757, 28.656386],
    "南京": [118.78, 32.04],
    "滨州": [118.03, 37.36],
    "贵阳": [106.71, 26.57],
    "无锡": [120.29, 31.59],
    "本溪": [123.73, 41.3],
    "克拉玛依": [84.77, 45.59],
    "渭南": [109.5, 34.52],
    "马鞍山": [118.48, 31.56],
    "宝鸡": [107.15, 34.38],
    "焦作": [113.21, 35.24],
    "句容": [119.16, 31.95],
    "北京": [116.46, 39.92],
    "徐州": [117.2, 34.26],
    "衡水": [115.72, 37.72],
    "包头": [110, 40.58],
    "绵阳": [104.73, 31.48],
    "乌鲁木齐": [87.68, 43.77],
    "枣庄": [117.57, 34.86],
    "杭州": [120.19, 30.26],
    "淄博": [118.05, 36.78],
    "鞍山": [122.85, 41.12],
    "溧阳": [119.48, 31.43],
    "库尔勒": [86.06, 41.68],
    "安阳": [114.35, 36.1],
    "开封": [114.35, 34.79],
    "济南": [117, 36.65],
    "德阳": [104.37, 31.13],
    "温州": [120.65, 28.01],
    "九江": [115.97, 29.71],
    "邯郸": [114.47, 36.6],
    "临安": [119.72, 30.23],
    "兰州": [103.73, 36.03],
    "沧州": [116.83, 38.33],
    "临沂": [118.35, 35.05],
    "南充": [106.110698, 30.837793],
    "天津": [117.2, 39.13],
    "富阳": [119.95, 30.07],
    "泰安": [117.13, 36.18],
    "诸暨": [120.23, 29.71],
    "郑州": [113.65, 34.76],
    "哈尔滨": [126.63, 45.75],
    "聊城": [115.97, 36.45],
    "芜湖": [118.38, 31.33],
    "唐山": [118.02, 39.63],
    "平顶山": [113.29, 33.75],
    "邢台": [114.48, 37.05],
    "德州": [116.29, 37.45],
    "济宁": [116.59, 35.38],
    "荆州": [112.239741, 30.335165],
    "宜昌": [111.3, 30.7],
    "义乌": [120.06, 29.32],
    "丽水": [119.92, 28.45],
    "洛阳": [112.44, 34.7],
    "秦皇岛": [119.57, 39.95],
    "株洲": [113.16, 27.83],
    "石家庄": [114.48, 38.03],
    "莱芜": [117.67, 36.19],
    "常德": [111.69, 29.05],
    "保定": [115.48, 38.85],
    "湘潭": [112.91, 27.87],
    "金华": [119.64, 29.12],
    "岳阳": [113.09, 29.37],
    "长沙": [113, 28.21],
    "衢州": [118.88, 28.97],
    "廊坊": [116.7, 39.53],
    "菏泽": [115.480656, 35.23375],
    "合肥": [117.27, 31.86],
    "武汉": [114.31, 30.52],
    "大庆": [125.03, 46.58]
  };
  
  if (element === mapNum) {
    cache.symbol = 'image://./image/1.png';
    cache.symbolSize = function (val) {
      return Math.round(val[2] / (val[2] > 5 * 1e3 ? 1e3 : val[2] > 1e3 ? 500 : 100) * 2);
    }
    cache.barColor = '#1a599d';
    cache.isNum = true;
  } else {
    cache.symbol = 'image://./image/2.png';
    cache.symbolSize = function (val) {
      return Math.round(val[2] * 2);
    }
    cache.barColor = '#ddb926';
    cache.isNum = false;
  }

  function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i]._id];
      if (geoCoord) {
        res.push({
          name: data[i]._id,
          value: geoCoord.concat(data[i].value)
        });
      }else{
        console.log('缺少城市经纬度：',data[i]._id);
      }
    }
    return res;
  };

  var convertedData = [
    convertData(data),
    convertData(data.sort(function (a, b) {
      return b.value - a.value;
    }).slice(0, 6))
  ];

  
  // 指定图表的配置项和数据
  var option = {
    dataRange: {
      min: 0,
      max: 30000,
      x: '4%',
      y: 'bottom',
      text: ['多', '少'],           // 文本，默认为数值文本
      textStyle: {
        color: '#fff'
      },
      calculable: true
    },
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    title: [
      {
        text: title,
        x: 'center',
        top: 20,
        textStyle: {
          color: '#fff',
          fontSize: 20
        }
      },
      {
        id: 'statistic',
        right: '12%',
        top: 40,
        width: 100,
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      }
    ],
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: '#fff'
        },
        emphasis: {
          borderColor: '#b1e4ff'
        }
      }
    },
    brush: {
      outOfBrush: {
        color: '#abc'
      },
      brushStyle: {
        borderWidth: 2,
        color: 'rgba(0,0,0,0.2)',
        borderColor: 'rgba(0,0,0,0.5)',
      },
      seriesIndex: [0, 1],
      throttleType: 'debounce',
      throttleDelay: 300,
      geoIndex: 0
    },
    geo: {
      map: 'china',
      left: '10',
      right: '35%',
      center: [105.98561551896913, 35.205000490896193],
      zoom: 1,
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#111'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    tooltip: {
      trigger: 'item'
    },
    grid: {
      right: 40,
      top: 100,
      bottom: 40,
      width: '30%'
    },
    xAxis: {
      type: 'value',
      scale: true,
      position: 'top',
      boundaryGap: false,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { margin: 2, textStyle: { color: '#aaa' },formatter:cache.isNum?'{value}':'{value}k' },
    },
    yAxis: {
      type: 'category',
      name: 'TOP 20',
      nameGap: 16,
      axisLine: { show: false, lineStyle: { color: '#ddd' } },
      axisTick: { show: false, lineStyle: { color: '#ddd' } },
      axisLabel: { interval: 0, textStyle: { color: '#ddd' } },
      data: []
    },
    series: [
      {
        name: text,
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertedData[0],
        symbol: cache.symbol,
        symbolSize: cache.symbolSize,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Top 6',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbol: cache.symbol,
        symbolSize: cache.symbolSize,
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true,
            textStyle:{
              fontSize:14
            }
          }
        },
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1,
        data: convertedData[1]
      },
      {
        id: 'bar',
        zlevel: 2,
        type: 'bar',
        symbol: 'none',
        itemStyle: {
          normal: {
            color: cache.barColor
          }
        },
        data: []
      }
    ]
  };
  element.setOption(option);
  element.on('brushselected', renderBrushed);

  setTimeout(function () {
    element.dispatchAction({
      type: 'brush',
      areas: [
        {
          geoIndex: 0,
          brushType: 'rect',
          coordRange:[[110,125],[22,40]]
        }
      ]
    });
  }, 0);

  // 圈选范围时重绘Top 20
  function renderBrushed(params) {
    var mainSeries = params.batch[0].selected[0];

    var selectedItems = [];
    var categoryData = [];
    var barData = [];
    var maxBar = 20;
    var sum = 0;
    var count = 0;

    for (var i = 0; i < mainSeries.dataIndex.length; i++) {
      var rawIndex = mainSeries.dataIndex[i];
      var dataItem = convertedData[0][rawIndex];
      var value = dataItem.value[2];

      sum += value;
      count++;

      selectedItems.push(dataItem);
    }

    selectedItems.sort(function (a, b) {
      return b.value[2] - a.value[2];   // 倒序
    });

    for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
      categoryData.unshift(selectedItems[i].name);
      barData.unshift(selectedItems[i].value[2]);
    }

    this.setOption({
      yAxis: {
        data: categoryData
      },
      xAxis: {
        axisLabel: { show: !!count }
      },
      title: {
        id: 'statistic',
        text: count ? ('平均: ' + (sum / count).toFixed(4) + (cache.isNum?'':'k')): ''
      },
      series: {
        id: 'bar',
        data: barData
      }
    });
  }
}

function drawBarAndLine(element, title, { yName, xUnit = '', yUnit = '', dataZoom = 0, showLables = 0 }, { xData, yData }) {
  element.hideLoading();
  var option = {
    title: {
      text: title,
      x: '4%',
      y: '20'
    },
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: true },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    dataZoom: dataZoom == 0 ? [] : [
      {
        show: true,
        height: 30,
        xAxisIndex: [
          0
        ],
        bottom: 20,
        start: 0,
        end: 50
      },
      {
        type: "inside",
        show: true,
        height: 15,
        xAxisIndex: [
          0
        ],
        start: 1,
        end: 35
      }
    ],
    grid: {
      containLabel: true,
      left:'7%',
      right:'7%',
      bottom: 95,
      top: 100
    },
    legend: {
      data: yName,
      y: '4%'
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        interval: 0,
      },
      axisLabel: {
        rotate: '60',
        interval: showLables ? '' : 1
      },
      data: xData
    }],
    yAxis: [{
      type: 'value',
      name: yName[1],
      min: 0,
      position: 'right',
      axisLabel: {
        formatter: '{value} ' + yUnit[1]
      }
    }, {
      type: 'value',
      name: yName[0],
      min: 0,
      position: 'left',
      axisLabel: {
        formatter: '{value} ' + yUnit[0]
      }
    }],
    series: [{
      name: yName[1],
      type: 'line',
      label: {
        normal: {
          show: true,
          position: 'top',
        }
      },
      lineStyle: {
        normal: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowBlur: 10,
          shadowOffsetY: 10
        }
      },
      data: yData[1]
    }, {
      name: yName[0],
      type: 'bar',
      yAxisIndex: 1,
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      data: yData[0]
    }]
  };
  element.setOption(option);
}

function drawBars(element, title, { yName, xUnit = '', yUnit = '', dataZoom = 0 }, { xData, yData }) {
  element.hideLoading();
  var option = {
    title: {
      text: title,
      x: "4%",
      y: '20'
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: 80,
      bottom: 95
    },
    legend: {
      top: '4%',
      data: yName
    },
    calculable: true,
    xAxis: [{
      type: "category",
      axisLine: {
        lineStyle: {
          color: '#90979c'
        }
      },
      splitArea: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      // axisLabel: { interval: 0 },
      data: xData,
    }],
    yAxis: [{
      type: "value",
      splitArea: { show: false },
      axisLabel: {
        interval: 0,
        formatter: '{value} ' + yUnit
      },
      axisLine: {
        lineStyle: {
          color: '#90979c'
        }
      }
    }],
    dataZoom: dataZoom == 0 ? [] : [{
      show: true,
      height: 30,
      xAxisIndex: [0],
      bottom: 30,
      start: 0,
      end: 20,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#d3dee5"
      },
      textStyle: {
        color: "#fff"
      },
      borderColor: "#90979c"
    }, {
      type: "inside",
      show: true,
      height: 15,
      start: 1,
      end: 35
    }],
    series: [
      {
        name: yName[0],
        type: "bar",
        barGap: "10%",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(255,144,128,1)"
          }
        },
        data: yData[0],
      },
      {
        name: yName[1],
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: function (p) {
              return p.value > 0 ? (p.value) : '';
            }
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(0,191,183,1)"
          }
        },
        data: yData[1]
      }
    ]
  }
  element.setOption(option);
}

/*
function drawLines(element, title, { yUnit = '', yName = '', dataZoom = 0 }, { xData, yData }) {
  element.hideLoading();
  var option = {
    title: {
      text: title
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        textStyle: {
          color: "#000"
        }
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }
    },
    dataZoom: dataZoom == 0 ? [] : {
      show: true,
      start: 70
    },
    legend: {
      data: yName
    },
    xAxis: [
      {
        type: 'category',
        data: xData
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} ' + yUnit
        }
      }
    ],
    series: [
      {
        name: yName,
        type: 'line',
        showAllSymbol: true,
        itemStyle: {
          normal: {
            color: '#2ec7c9'
          }
        },
        symbolSize: function (value) {
          return Math.round(value / 1000) + 10;
        },
        data: yData,
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }
    ]
  };
  element.setOption(option);
}
*/

function drawSalaryRange(element, title, { legend, node, link }) {
  // 路径配置
  require.config({
    paths: {
      echarts: '/libs/echarts/src/'
    }
  });
  require(
    [
      'echarts',
      'echarts/chart/chord' // 使用和弦图加载chord模块，按需加载
    ], function () {
      element.hideLoading();
      var option = {
        color: [
          '#FBB367', '#80B1D2', '#FB8070', '#CC99FF', '#B0D961',
          '#99CCCC', '#BEBBD8', '#FFCC99', '#8DD3C8', '#FF9999',
          '#CCEAC4', '#BB81BC', '#FBCCEC', '#CCFF66', '#99CC66',
          '#66CC66', '#FF6666', '#FFED6F', '#ff7f50', '#87cefa',
        ],
        title: {
          text: title,
          x: 'left',
          y: 'top'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.name && params.name.indexOf('-') != -1) {
              return params.name.replace('-', ' ' + params.seriesName + ' ')
            } else {
              return params.name ? params.name : params.data.id
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        legend: {
          x: 'right',
          data: legend,
          // itemStyle: {
          //   normal: {
          //     color: '#000'
          //   }
          // }
        },
        series: [
          {
            type: 'chord',
            sort: 'ascending',
            sortSub: 'descending',
            showScale: false,
            itemStyle: {
              normal: {
                label: {
                  rotate: true
                }
              }
            },
            nodes: node,
            links: link
          }
        ]
      };
      element.setOption(option);
    }
  );
}

function drawAbility(element, title, { yName, yUnit = '', dataZoom = 0 }, metadata) {
  element.hideLoading();
  var option = {
    title: {
      text: title,
      x: "4%",
      y: '20'
    },
    tooltip: {
      axisPointer: {
        type: 'shadow'
      },
      trigger: 'axis'
    },
    grid: {
      bottom: metadata.x_major_offset * 12 + 60,
      containLabel: true,
      top: 100,
      left:'7%',
      right:'7%',
    },
    legend: {
      data: yName,
      top: '4%',
    },
    xAxis: [
      {
        type: 'category',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          rotate: 90
        },
        splitArea: { show: false },
        data: metadata.data2
      },
      {
        type: 'category',
        position: 'bottom',
        offset: metadata.x_major_offset * 13,
        axisLine: { show: false },
        axisTick: {
          length: metadata.x_major_offset * 12 + 20,
          lineStyle: { color: '#CCC' },
          interval: function (index, value) {
            return value !== '';
          }
        },
        splitArea: {
          show: true,
          interval: function (index, value) {
            return value !== '';
          }
        },
        data: metadata.data1
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: yName,
        min: 0,
        interval: 50,
        axisLabel: {
          formatter: '{value} ' + yUnit
        }
      }
    ],
    series: [
      {
        name: yName,
        type: 'bar',
        z: 1,
        data: metadata.data3,
        label: {
          normal: {
          show: true,
          position: 'top'
        }
      },
      }
    ],
    calculable: true,
    dataZoom: dataZoom == 0 ? [] : [{
      show: true,
      height: 30,
      xAxisIndex: [0, 1],
      bottom: 30,
      start: 0,
      end: 20,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#d3dee5"
      },
      textStyle: {
        color: "#fff"
      },
      borderColor: "#90979c"
    }, {
      type: "inside",
      show: true,
      height: 15,
      start: 1,
      end: 35
    }]
  }
  element.setOption(option);
}

function showEcharts() {
  mapNum.showLoading();
  mapSalary.showLoading();
  jobCategory.showLoading();
  hotCity.showLoading();
  jobSalary.showLoading();
  // salaryRange.showLoading();
  education.showLoading();
  workYear.showLoading();
  finance.showLoading();
  ability.showLoading();
  var data = {};
  $.ajax({
    type: 'GET',
    url: '/api',
    success: function (data) {
      drawMap(mapNum, '全国各地区技术类职业总量', 'JobNum', data.MapNum);
      drawMap(mapSalary, '全国各地区技术类职业平均薪资', 'Salary', data.MapSalary);

      drawBarAndLine(jobCategory, '各技术类职业总数量、平均薪资', { yName: ['数量', '薪资'], yUnit: ['', 'k'], dataZoom: 1, showLables: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.JobNumAndSalary) {
          xData.push(i._id[0]);
          yData[0].push(i.num);
          yData[1].push(i.avg);
        }
        return { xData, yData };
      })());

      drawBarAndLine(hotCity, 'Top 25 热门技术类职位数量比、薪资比', { yName: ['数量', '薪资'], yUnit: ['', 'k'], showLables: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.HotCmp) {
          xData.push(i._id.city + '\n' + i._id.position[0]);
          yData[0].push(i.num);
          yData[1].push(i.avg);
        }
        return { xData, yData };
      })());

      // drawLines(dailyNum, '全国职业日总量', { yName: '数量', dataZoom: 1 }, (() => {
      //   var xData = [], yData = [];
      //   for (var i of data.DailyNum) {
      //     xData.push(i._id.join('/'));
      //     yData.push(i.num);
      //   }
      //   return { xData, yData };
      // })());

      drawBars(jobSalary, '技术类职业最高、最低薪资', { yName: ['min', 'max'], yUnit: 'k', dataZoom: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.JobSalaryRange) {
          xData.push(i._id[0]);
          yData[0].push(i.min);
          yData[1].push(i.max);
        }
        return { xData, yData };
      })());

      // drawSalaryRange(salaryRange, '技术类职业薪资范围和弦图（面积大小表示普遍率）', (() => {
      //   var node = [], legend = [], link = [];
      //   for (var i of data.SalaryRange) {
      //     if (!~legend.indexOf(i._id.from)) {
      //       legend.push(i._id.from);
      //       node.push({ name: i._id.from + 'k' });
      //     }
      //     if (!~legend.indexOf(i._id.to)) {
      //       legend.push(i._id.to);
      //       node.push({ name: i._id.to + 'k' });
      //     }
      //     link.push(
      //       { source: i._id.from + 'k', target: i._id.to + 'k', weight: i.num, name: '--' },
      //       { target: i._id.from + 'k', source: i._id.to + 'k', weight: 1 }
      //     );
      //   }
      //   return { legend, node, link };
      // })());

      drawBarAndLine(education, '不同学历下的技术类职业数量比、薪资比', { yName: ['数量', '薪资'], yUnit: ['', 'k'], showLables: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.Education) {
          xData.push(i._id);
          yData[0].push(i.num);
          yData[1].push(i.avg);
        }
        return { xData, yData };
      })());

      drawBarAndLine(workYear, '不同工作经验下的技术类职业数量比、薪资比', { yName: ['数量', '薪资'], yUnit: ['', 'k'], showLables: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.WorkYear) {
          xData.push(i._id);
          yData[0].push(i.num);
          yData[1].push(i.avg);
        }
        return { xData, yData };
      })());
      drawBarAndLine(finance, '不同融资阶段的公司数量比、平均薪资', { yName: ['融资阶段', '薪资'], yUnit: ['', 'k'], showLables: 1 }, (() => {
        var xData = [], yData = [[], []];
        for (var i of data.Finance) {
          xData.push(i._id);
          yData[0].push(i.num);
          yData[1].push(i.avg);
        }
        return { xData, yData };
      })());

      drawAbility(ability, '不同技术类职业在不同工作经验下的平均薪资', { yName: ['平均薪资'], yUnit: 'k', dataZoom: 1 }, (() => {
        var metadata = {
          data1: [],
          data2: [],
          data3: [],
          x_major_offset: ''
        };
        for (var i of data.Ability) {
          metadata.data1.push((!~metadata.data1.indexOf(i._id.position[0])) ? i._id.position[0] : '');
          metadata.data2.push(i._id.workYear);
          metadata.data3.push(i.avg);
        }
        metadata.x_major_offset = metadata.data2[0].length;
        return metadata;
      })());
    },
    error: function (xhr, type) {
      alert('Ajax error!');
    }
  });
}
