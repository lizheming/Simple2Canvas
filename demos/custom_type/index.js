const options = {
  width: 360,
  height: 564,
  rate: 3,
  elements: [
    {type: 'rect', width: 360, height: 564, fill: '#0091f9', top: 0, left: 0},
    {type: 'image', url: 'https://p2.ssl.qhimgs4.com/t011c90ac743cf16dfb.png', width: 360, height: 166, top: 0, left: 0},
    {type: 'rect', width: 330, height: 379, fill: '#FFF', left: 15, top: 50, round: 7},
    //谣言卡片上半部分的蓝色背景
    {
      type: function({url, top: y, left: x, width, height}) {
        [x, y, width, height] = [x, y, width, height].map(v => v * this.rate);
      
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
      url: 'https://p5.ssl.qhimg.com/t01d6f520aa46d3306f.png',
      width: 330,
      height: 160,
      top: 50, 
      left: 15
    },
    //标题上方图片
    {type: 'image', url: 'https://p2.ssl.qhimg.com/t01435ac27bbe17c70e.png', height: 48, top: 80, left: 27},
    //标题
    {type: 'wrapText', text: '钟南山预测3月多数省份将解除限制？', fontSize: 15, fontWeight: 600, lineHeight: 20, color: '#FFF', top: 140, left: 27, width: 306, height: 40},
    //印章图片
    {type: 'image', url: 'https://p4.ssl.qhimg.com/t019749f5c7ef94d271.png', width: 100, height: 100, top: 62, left: 233},
    //简介
    {
      type: 'wrapText',
      text: '近日，网上流传“钟南山院士有望初步对各地解除限制作预测”，提及：3月10日到25日前后，大多数省份将解除限制，4月15日前后湖北也将解除限制。事实上钟南山院士没这么说过，现阶段全国各省（市）依然采取严格防疫措施，具体恢复时间，属地相关部门会第一时间告知公众。',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 20,
      color: '#222',
      width: 306,
      height: 160,
      top: 222,
      left: 27
    },
    //查证者
    {
      type: 'text',
      text: '查证者：互联网联合辟谣平台',
      fontSize: 11,
      lineHeight: 11,
      color: '#888',
      width: 356,
      textAlign: 'right',
      top: 394,
      left: 27 + 306
    },
    // 快资讯logo
    {
      type: 'image',
      url: 'https://p1.ssl.qhimg.com/t01c2572a1effaa3fa8.png',
      width: 60,
      height: 15,
      left: 15,
      top: 484
    },
    {
      type: 'text',
      text: '长按识别二维码，查询辟谣+获取更多信息',
      fontSize: 10,
      color: '#fff',
      lineHeight: 13,
      left: 15,
      top: 506
    },
    // 二维码遮罩
    {
      type: 'rect',
      fill: '#FFF',
      top: 446,
      left: 258,
      width: 87,
      height: 87
    },
    {
      type: 'image',
      url: 'https://p5.ssl.qhimg.com/t01c58db0f47ae4c594.png',
      top: 448,
      left: 260,
      width: 83,
      height: 83
    },
  ]
};
  
(async () => {
  const canvas = await simple2canvas(options);
  const img = document.createElement('img');
  img.style.width = options.width + 'px';
  img.style.height = options.height + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();