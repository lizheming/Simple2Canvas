import Render from './render';

export default class HTMLRender extends Render {
  constructor(width, height) {
    super(width, height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  //矩形
  rect({top: y, left: x, width: w, height: h, fill, round: r}) {
    const {ctx} = this;

    ctx.save();
    ctx.fillStyle = fill;
    if(r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
    return Promise.resolve(this);
  }

  //图片
  image({url, top: y, left: x, width, height}) {
    const {ctx} = this;
    return new Promise((resolve, reject) => {
      ctx.save();
      const img = document.createElement('img');
      img.crossOrigin = '*';
      img.onload = function() {
        ctx.drawImage(img, x, y, width, height);
        img.parentNode.removeChild(img);
        resolve();
      }
      img.onerror = reject;
      img.src = url;
      document.body.appendChild(img);
    })
  }

  //文字
  text({text, top, left, fontSize, lineHeight, color, textAlign, fontWeight}) {
    const {ctx} = this;
    ctx.save();

    ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
    ctx.fillStyle = color;
    ctx.textAlign = textAlign || 'left';

    top = top + lineHeight - Math.max((lineHeight - fontSize)/2, 0);
    ctx.fillText(text, left, top);
    ctx.restore();
    return Promise.resolve(this);
  }

  //多行文字
  wrapText({text, top, left, fontSize, lineHeight, color, width, height, textAlign, fontWeight}) {
    const {ctx} = this;
    
    ctx.save();
    var arrText = text.split('');
    var line = '';
    var result = [];
    for (var n = 0; n < arrText.length; n++) {
      var testLine = line + arrText[n];
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > width && n > 0) {
        result.push({line, top, left});
        line = arrText[n];
        top += lineHeight;
      } else {
        line = testLine;
      }
    }
    result.push({line, top, left});
    result.forEach(({line: text, top, left}, idx) => {
      if(height && (idx + 1) * lineHeight > height) {
        return;
      }
      this.text({text, top, left, fontSize, lineHeight, color, width, textAlign, fontWeight});
    });
    ctx.restore();
    return result;
  }
}