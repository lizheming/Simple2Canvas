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
  const PER_ROW = 4; //每行个数
  const BLOCK_WIDTH = 78;
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
    height: (BLOCK_HEIGHT + BLOCK_MARGIN_BOTTOM) *  Math.ceil(tabList.length / PER_ROW) - BLOCK_MARGIN_BOTTOM,
    elements: ret
  }; 
}

function circle({top, left}) {
  return {
    type: 'group',
    width: 11,
    height: 11,
    top,
    left,
    elements: [
      {
        type: 'rect',
        width: 11,
        height: 11, 
        round: 5.5,
        fill: '#D4E8FF',
        top: 0,
        left: 0
      },
      {
        type: 'rect',
        width: 5,
        height: 5, 
        round: 2.5,
        fill: '#298AFD',
        top: 3,
        left: 3
      }
    ]
  }
}

function newsBlock({title, p}, {top, left}) {
  const ret = [];

  let singleHeight = 0;
  //时间
  ret.push({
    type: 'text',
    text: p,
    fontSize: 11,
    fontWeight: 400,
    color: 'rgba(136,136,136,1)',
    lineHeight: 11,
    left: 20,
    top: 0
  });
  singleHeight += 20;

  const lines = simple2canvas.utils.getTextWidth({width: 280, fontSize: 14, fontWeight: 400, lineHeight: 16, text: title, top: singleHeight, left: 20});
  lines.forEach(({top, left, line}) => ret.push({type: 'text', text: line, top, left, fontSize: 14, fontWeight: 400, lineHeight: 16, color: '#222222'}));
  singleHeight += lines.length * 16;
  ret.push(circle({top: 0, left: 0}));

  return {
    type: 'group',
    top,
    left,
    width: 310,
    height: singleHeight,
    elements: ret
  };
}

const SPIRITS = {
  BACKGROUND({width, height, content}) {
    return {
      type: 'group',
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
          url: 'https://p2.ssl.qhimgs4.com/t011c90ac743cf16dfb.png',
          top: 0,
          left: 0,
          width,
          height: 166
        },
        content
      ]
    };
  },
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
  MAP({title, map}, {top, left}) {
    const width = 310;
    let height = 0;
    const ret = [];
  
    if(!title || !map) {
      return {width: 300, height, elements: ret};
    }
  
    ret.push({type: 'text', text: title, width, left: 180, top, textAlign: 'center', fontWeight: 600, fontSize: 13, lineHeight: 14, color: '#222'});
    height += 28;
  
    ret.push({
      type: 'image',
      url: map,
      top: top + height,
      left,
      width,
      height: 310 / 4 * 3
    });
    height += 310 / 4 * 3;
  
    return {
      type: 'group',
      width: 330,
      height,
      elements: ret
    };
  },
  CHART({chartUrl}, {top, left}) {
    const width = 310;
    const height = 200;
    return {
      type: 'image',
      url: chartUrl,
      top, 
      left,
      width,
      height
    };
  },
  NEWS({news}, {top, left}) {
    const width = 330;
    let height = 0;
    const ret = [];
  
    ret.push({
      type: 'text',
      text: '海外动态',
      width,
      left: 180,
      top,
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 14, 
      lineHeight: 14, 
      color: '#222'
    });
    height += 34;
  
    for(let i = 0; i < news.length; i++) {
      const newsGroup = newsBlock(news[i], {top: top + height, left: 30});
  
      if(i !== news.length - 1) {
        ret.push({
          type: 'rect',
          width: 1,
          height: newsGroup.height + 32,
          fill: '#298AFD',
          top: top + height + 5.5,
          left: 35
        });
      }

      ret.push(newsGroup);
      height += newsGroup.height + (i !== news.length - 1 ? 32 : 0);
    }
  
  
    return {
      type: 'group',
      width,
      height,
      elements: ret
    };
  },
  FOOTER({qrCode}, {top, left}) {
    const qrCodeSize = 87;

    return {
      type: 'group',
      top,
      left,
      width: 330,
      height: 87,
      elements: [
        {type: 'rect', fill: '#FFF', top: 0, left: 243, width: qrCodeSize, height: qrCodeSize},
        {type: 'image', url: qrCode, top: 4, left: 247, width: 79, height: 79},
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
          text: '长按识别二维码，查看新冠肺炎疫情实时动态',
          fontSize: 10,
          color: '#fff',
          lineHeight: 13,
          left: 15,
          top: 63
        }
      ]
    };
  },
}

function createOptions({info, news, mapTitle, mapUrl, chartUrl, qrCode}) {
  let posterWidth = 360;
  let posterHeight = 0;
  const rate = 3;

  //主体内容区
  let content = {type: 'rect', fill: '#FFF', round: 7, top: 50, left: 15, width: 330, height: 18};
  //全国数
  const countryCount = SPIRITS.TOTAL_COUNT({
    tabHasDiff: true, 
    name: info.name,
    modifyTime: info.modifyTime,
    tabList: info.data
  }, {top: content.top + content.height, left: 25});
  content.height += countryCount.height + 32;

  //地图部分
  const map = SPIRITS.MAP({
    title: mapTitle,
    map: mapUrl
  }, {top: content.top + content.height, left: 25});
  map.height && (content.height += map.height + 32);

  const chart = SPIRITS.CHART({chartUrl}, {
    top: content.top + content.height,
    left: 25
  });
  chart.height && (content.height += chart.height +  32);
  
  //海外动态
  news = SPIRITS.NEWS({news}, {top: content.top + content.height, left: 25});
  if(news.height) {
    content.height += news.height + 32;
  }

  //主体内容结束，清算主体内容的高度到画布上
  posterHeight += content.top + content.height + 15;

  //footer区域
  const footer = SPIRITS.FOOTER({qrCode}, {top: posterHeight, left: 15});
  posterHeight += footer.height + 15;

  const background = SPIRITS.BACKGROUND({width: posterWidth, height: posterHeight, content});

  return {
    width: posterWidth,
    height: posterHeight,
    rate,
    elements: [
      background,
      footer,
      countryCount,
      map,
      chart,
      news
    ]
  };
}


(async () => {
  const options = createOptions({
    info: {
      "name": "海外",
      "modifyTime": "2020-03-30 17:31:00",
      "data": [
        {
          "name": "现存确诊",
          "count": 542364,
          "color": "#FB3132",
          "diff": [
            "较昨日",
            "+39816"
          ]
        },
        {
          "name": "累计确诊",
          "count": 651511,
          "color": "#CC4AEF",
          "diff": [
            "较昨日",
            "+50608"
          ]
        },
        {
          "name": "累计治愈",
          "count": 77751,
          "color": "#2FBD51",
          "diff": [
            "较昨日",
            "+8131"
          ]
        },
        {
          "name": "累计死亡",
          "count": 31396,
          "color": "#6D6D6D",
          "diff": [
            "较昨日",
            "+2661"
          ]
        }
      ]
    },
    mapTitle: "全球现存确诊人数分布图",
    mapUrl: "https://p2.ssl.qhimgs4.com/t016ef5dab6a0563540.png",
    qrCode: "https://p2.ssl.qhimgs4.com/t0193e510c45fba58aa.png",
    chartUrl: "https://p2.ssl.qhimgs4.com/t0105db71c9801b9dc6.png",
    news: [
      {
        "p": "03月30日17时20分",
        "title": "日媒：东京奥运会将于2021年7月23日正式开幕"
      },
      {
        "p": "03月30日17时39分",
        "title": "西班牙确诊数达85195例 超中国成确诊第三多国家"
      },
      {
        "p": "03月30日17时35分",
        "title": "英首相高级顾问出现新冠症状 曾小跑“逃离”唐宁街"
      },
      {
        "p": "03月30日17时40分",
        "title": "伊朗新增3186例新冠肺炎确诊病例 累计确诊41495例"
      },
      {
        "p": "03月30日15时56分",
        "title": "文在寅宣布向韩国七成家庭发钱：四口之家给100万韩元"
      }
    ]
  });
  const canvas = await simple2canvas(options);
  const img = document.createElement('img');
  img.style.width = options.width + 'px';
  img.style.height = options.height + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();