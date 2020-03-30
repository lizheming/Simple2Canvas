//单个数字显示
function ncovCountGroup({top, left, width, height, diffPrefix, diffCount, count, color, name}) {
  const DIFF_FONT_SIZE = 13;
  const {width: diffWidth} = simple2canvas.utils.getTextWidth({text: diffPrefix + diffCount, fontSize: DIFF_FONT_SIZE});
  const {width: prefixWdith} = simple2canvas.utils.getTextWidth({text: diffPrefix, fontSize: DIFF_FONT_SIZE});
  const diffLeft = (width - diffWidth) / 2;
  const diffCountLeft = diffLeft + prefixWdith;
  const COUNT_TOP = DIFF_FONT_SIZE + 5;
  const NAME_TOP = COUNT_TOP + 19 + 5;

  return {
    type: 'group',
    top,
    left,
    width,
    height,
    elements: [
      {
        type: 'text',
        text: diffPrefix,
        fontSize: DIFF_FONT_SIZE,
        lineHeight: DIFF_FONT_SIZE,
        color: '#666666',
        top: 0,
        left: diffLeft
      },
      {
        type: 'text',
        text: diffCount,
        fontSize: DIFF_FONT_SIZE,
        lineHeight: DIFF_FONT_SIZE,
        color,
        top: 0,
        left: diffCountLeft
      },
      {
        type: 'text',
        text: count,
        color,
        fontSize: 19,
        lineHeight: 19,
        top: COUNT_TOP,
        textAlign: 'center',
        fontWeight: 600,
        left: width / 2
      },
      {
        type: 'text',
        text: name,
        fontSize: 11,
        fontWeight: 500,
        color: '#222',
        lineHeight: 11,
        top: NAME_TOP,
        textAlign: 'center',
        left: width/2
      }
    ]
  };
}

//双排数字显示
function drawTotalNumber({top, left, tabHasDiff, tabList}) {
  const PER_ROW = 3; //每行个数
  const BLOCK_WIDTH = 103;
  const BLOCK_HEIGHT = tabHasDiff ? 56 : 38; 
  const BLOCK_MARGIN_BOTTOM = tabHasDiff ? 17 : 8.5;

  const ret = [];
  for(let i = 0; i < tabList.length; i++) {
    let {name, color, count, diff = ['', '']} = tabList[i];
    const [diffPrefix, diffCount] = diff;

    const RECT = {
      TOP: Math.floor(i / PER_ROW) * (BLOCK_HEIGHT + BLOCK_MARGIN_BOTTOM),
      LEFT: (i % PER_ROW) * (BLOCK_WIDTH + 1)
    };

    ret.push(ncovCountGroup({top: RECT.TOP, left: RECT.LEFT, width: BLOCK_WIDTH, height: BLOCK_HEIGHT, diffPrefix, diffCount, name, color, count}));
    if(i%PER_ROW === PER_ROW - 1) {
      continue;
    }

    const gapHeight = tabHasDiff ? 40 : 22;
    const gapStartPoint = [RECT.LEFT + BLOCK_WIDTH, RECT.TOP + 8];
    const gapEndPoint = [gapStartPoint[0], gapStartPoint[1] + gapHeight];
    ret.push({
      type: function({start, end, keyframes, width, height}) {
        const ctx = this.ctx;
        ctx.save();
        const gradient = ctx.createLinearGradient(start[0], start[1], end[0], end[1]);
        keyframes.forEach(([percent, color]) => gradient.addColorStop(percent, color));
        ctx.fillStyle = gradient;
        ctx.fillRect(start[0], start[1], width, height);
        ctx.restore();
      },
      start: gapStartPoint,
      end: gapEndPoint,
      keyframes: [
        [0, 'rgba(232,232,232,1)'],
        [1, 'rgba(232,232,232,0)']
      ],
      width: 1,
      height: gapHeight,
    })
  }

  ret.forEach(item => {
    item.left += left;
    item.top += top;
    if(Array.isArray(item.start)) {
      item.start[0] += left;
      item.start[1] += top;
    }
    if(Array.isArray(item.end)) {
      item.end[0] += left;
      item.end[1] += top;
    }
  });

  return {
    type: 'group',
    top,
    left,
    width: 311,
    height: BLOCK_HEIGHT * 2 + BLOCK_MARGIN_BOTTOM,
    elements: ret
  }; 
}

const SPIRITS = {
  //背景部分
  BACKGROUND({banner, content, width, height}) {
    return {
      type: 'group',
      top: 0,
      left: 0,
      width,
      height,
      elements: [
        {
          type: 'rect',
          fill: '#0091f9',
          top: 0,
          left: 0,
          width,
          height
        },
        {
          type: 'image',
          url: banner,
          top: 0,
          left: 0,
          width,
          height: 166
        },
        content,
        // 中国背景 
        {
          type: function({url, top: y, left: x, width, height}) {
            const ctx = this.ctx;
            return new Promise((resolve, reject) => {
              const img = document.createElement('img');
              img.crossOrigin = '*';
              img.onload = function() {
                ctx.save();
                ctx.clip();
                ctx.drawImage(img, x, y, width, height);
                ctx.restore();
                img.parentNode.removeChild(img);
                resolve();
              }
              img.onerror = reject;
              img.src = url;
              document.body.appendChild(img);
            })
          },
          url: 'https://p0.ssl.qhimg.com/t014f2d80d4ff89f4eb.png',
          top: content.top,
          left: 15,
          width: 330,
          height: 165
        },
      ]
    };
  },
  //全国总数显示
  TOTAL_COUNT({tabHasDiff, tabList, modifyTime, name}, {top, left}) {
    let height = 0;
    const ret = [];
  
    // 定位icon
    ret.push({
      type: 'image',
      url: 'https://p1.ssl.qhimg.com/t01a17ec0a50e2b4fa6.png',
      top: top + 6,
      left: 145,
      width: 13,
      height: 18
    });
    ret.push({
      type: 'text',
      text: name,
      left: 164,
      top,
      fontSize: 24,
      lineHeight: 24,
      fontWeight: 600,
      color: 'rgba(243,74,75,1)'
    });
    height += 24 + 8;
  
    ret.push({
      type: 'text',
      text: `截至 ${modifyTime} 疫情数据结果`,
      textAlign: 'center',
      left: 180,
      top: height + top,
      width: 330,
      fontSize: 12,
      lineHeight: 12,
      // fontWeight: 600,
      color: 'rgba(136,136,136,1)'
    });
    height += 12 + 20;
    
    const totalNumber = drawTotalNumber({top: height + top, left: 25, tabHasDiff, tabList});
    (JSON.stringify(totalNumber, null, '\t'));
    height += totalNumber.height;
  
    return {
      type: 'group',
      top: 0,
      left: 0,
      width: 330,
      height,
      elements: ret.concat(totalNumber.elements)
    };
  },
  //全国非湖北总数显示
  TOTAL_COUNT_EXCEPT_HUBEI({tabList, modifyTime, name}, {top, left}) {
    let height = 0;
    const ret = [];

    ret.push({
      type: 'text',
      text: name,
      textAlign: 'center',
      left: 180,
      top,
      width: 330,
      fontSize: 19,
      lineHeight: 19,
      fontWeight: 600,
      color: 'rgba(243,74,75,1)'
    });
    height += 19 + 8;

    ret.push({
      type: 'text',
      text: `截至 ${modifyTime} 疫情数据结果`,
      textAlign: 'center',
      left: 180,
      top: height + top,
      width: 330,
      fontSize: 12,
      lineHeight: 12,
      // fontWeight: 600,
      color: 'rgba(136,136,136,1)'
    });
    height += 12 + 20;
    
    const totalNumber = drawTotalNumber({top: height + top, left: 25, tabHasDiff: true, tabList});
    height += totalNumber.height;

    return {
      type: 'group',
      left: 0,
      top: 0,
      width: 330,
      height,
      elements: ret.concat(totalNumber.elements)
    };
  },
  //治愈地图部分
  MAPS({mapList}, {top, left}) {
    const width = 330;
    let height = 0;
    const ret = [];

    ret.push({type: 'text', text: '治愈人数分布地图', width, left: 180, top: 0, textAlign: 'center', fontWeight: 600, fontSize: 14, lineHeight: 14, color: '#222'});
    height += 28;

    ret.push({
      type: 'image',
      url: mapList,
      top: height,
      left: 0,
      width,
      height: 330 / 4 * 3
    });
    height += 330 / 4 * 3;

    return {
      type: 'group',
      top,
      left,
      width: 330,
      height,
      elements: ret
    };
  },
  //图表显示
  CHARTS({chartList}, {top, left}) {
    return {
      type: 'group',
      top,
      left,
      width: chartList[0].width,
      height: chartList[ chartList.length - 1 ].top + chartList[0].height,
      elements: chartList.map(chart => {
        chart.type = 'image';
        return chart;
      })
    };
  },
  //底部显示
  FOOTER({qrCode}, {top, left}) {
    return {
      type: 'group',
      top,
      left,
      width: 330,
      height: 87,
      elements: [
        {type: 'image', url: qrCode, top: 0, left: 243, width: 87, height: 87},
        // 快资讯logo
        {
          type: 'image',
          url: 'https://p1.ssl.qhimg.com/t01c2572a1effaa3fa8.png',
          width: 60,
          height: 15,
          left: 15,
          top: 41
        },
        {
          type: 'text',
          text: '长按识别二维码，查看全国疫情实时动态',
          fontSize: 10,
          color: '#fff',
          lineHeight: 13,
          left: 15,
          top: 63
        }
      ]
    };
  }
}

function createOptions({country, countryExceptHubei, mapList, chartList, qrCode}) {
  const options = {
    width: 360,
    height: 0,
    rate: 3,
    elements: []
  };

  //主体内容区
  const content = {
    type: 'rect',
    fill: '#FFF',
    round: 7,
    top: 50,
    left: 15, 
    width: 330, 
    height: 18
  };

  //全国数
  const countryCount = SPIRITS.TOTAL_COUNT({
    name: country.name,
    modifyTime: country.modifyTime,
    tabList: country.tabList,
    tabHasDiff: true
  }, { top: content.top + content.height, left: 25 });
  content.height += countryCount.height + 32;

  //全国非湖北数
  const countryExceptHubeiCount = SPIRITS.TOTAL_COUNT_EXCEPT_HUBEI({
    name: countryExceptHubei.name,
    modifyTime: countryExceptHubei.modifyTime,
    tabList: countryExceptHubei.tabList
  }, { top: content.top + content.height, left: countryCount.left });
  content.height += countryExceptHubeiCount.height + 32;

  //治愈地图
  mapList = SPIRITS.MAPS({mapList}, { top: content.height + content.top, left: content.left });
  content.height += mapList.height + 32;  

  //图表
  chartList = SPIRITS.CHARTS({chartList}, {top: content.height + content.top, left: content.left + 10});
  content.height += chartList.height + 20;

  //主体内容结束，清算主体内容的高度到画布上
  options.height += content.top + content.height + 15;
  //footer区域
  const footer = SPIRITS.FOOTER({qrCode}, {top: options.height, left: 15});
  options.height += footer.height + 15;

  const background = SPIRITS.BACKGROUND({width: options.width, height: options.height, banner: 'https://p2.ssl.qhimgs4.com/t011c90ac743cf16dfb.png', content});

  options.elements = [
    background,
    footer,
    countryCount,
    countryExceptHubeiCount,
    mapList,
    chartList
  ];
  return options;
}


(async () => {
  const options = createOptions({
    country: {
      "name": "全国",
      "modifyTime": "2020-02-23 22:37",
      "tabList": [
        {
          "name": "现存确诊",
          "count": 51420,
          "color": "#FB3132",
          "diff": [
            "较昨日",
            "-1952"
          ]
        },
        {
          "name": "现存疑似",
          "count": 4148,
          "color": "#FFAC1B",
          "diff": [
            "较昨日",
            "+882"
          ]
        },
        {
          "name": "现存重症",
          "count": 10968,
          "color": "#507FFC",
          "diff": [
            "较昨日",
            "-509"
          ]
        },
        {
          "name": "累计确诊",
          "count": 77048,
          "color": "#CC4AEF",
          "diff": [
            "较昨日",
            "+656"
          ]
        },
        {
          "name": "累计治愈",
          "count": 23183,
          "color": "#2FBD51",
          "diff": [
            "较昨日",
            "+2511"
          ]
        },
        {
          "name": "累计死亡",
          "count": 2445,
          "color": "#6D6D6D",
          "diff": [
            "较昨日",
            "+97"
          ]
        }
      ]
    },
    countryExceptHubei: {
      "name": "全国（不含湖北）",
      "modifyTime": "2020-02-23 22:37",
      "tabList": [
        {
          "name": "现存确诊",
          "count": 4981,
          "color": "#FB3132",
          "diff": [
            "较昨日",
            "-744"
          ]
        },
        {
          "name": "现存疑似",
          "count": 785,
          "color": "#FFAC1B",
          "diff": [
            "较昨日",
            "+251"
          ]
        },
        {
          "name": "现存重症",
          "count": 540,
          "color": "#507FFC",
          "diff": [
            "较昨日",
            "-45"
          ]
        },
        {
          "name": "累计确诊",
          "count": 12964,
          "color": "#CC4AEF",
          "diff": [
            "较昨日",
            "+26"
          ]
        },
        {
          "name": "累计治愈",
          "count": 7840,
          "color": "#2FBD51",
          "diff": [
            "较昨日",
            "+725"
          ]
        },
        {
          "name": "累计死亡",
          "count": 99,
          "color": "#6D6D6D",
          "diff": [
            "较昨日",
            "+1"
          ]
        }
      ]
    },
    mapList: 'https://p2.ssl.qhimgs4.com/t01c053ca3d7fd80a7c.png',
    chartList: [
      {
        "width": 310,
        "height": 200,
        "left": 0,
        "top": 0,
        "url": "https://p2.ssl.qhimgs4.com/t019ab2d9b66822d598.png",
        "type": "image"
      },
      {
        "width": 310,
        "height": 200,
        "left": 0,
        "top": 236,
        "url": "https://p2.ssl.qhimgs4.com/t015dce9662ca14b502.png",
        "type": "image"
      },
      {
        "width": 310,
        "height": 200,
        "left": 0,
        "top": 472,
        "url": "https://p2.ssl.qhimgs4.com/t01bb37b1e2f0e3275f.png",
        "type": "image"
      },
      {
        "width": 310,
        "height": 200,
        "left": 0,
        "top": 708,
        "url": "https://p2.ssl.qhimgs4.com/t0172e556ca2ef036da.png",
        "type": "image"
      }
    ],
    qrCode: 'https://p2.ssl.qhimgs4.com/t01da7e4ceb14e4fd65.png'
  });
  const canvas = await simple2canvas(options);
  const img = document.createElement('img');
  img.style.width = options.width + 'px';
  img.style.height = options.height + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();