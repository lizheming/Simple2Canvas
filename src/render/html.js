import Render from './render';

export default class HTMLRender extends Render {
  constructor(width, height, {rate}) {
    super(width, height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    this.rate = rate;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  //矩形
  rect({top: y, left: x, width: w, height: h, fill, round: r}) {
    [x, y, w, h, r] = [x, y, w, h, r].map(v => v * this.rate);

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
    [x, y, width, height] = [x, y, width, height].map(v => v * this.rate);

    const {ctx} = this;
    return new Promise((resolve, reject) => {
      ctx.save();
      const img = document.createElement('img');
      img.crossOrigin = '*';
      img.onload = function() {
        if(!width && !height) {
          width = img.width;
          height = img.height;
        } else if(!width) {
          width = img.width / img.height * height;
        } else if(!height) {
          height = img.height / img.widht * width;
        }
        
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
  text({text, top, left, fontSize, lineHeight, color, textAlign, fontWeight, width}) {
    const {ctx} = this;
    [top, left, fontSize, lineHeight, width] = [top, left, fontSize, lineHeight, width].map(v => v * this.rate);

    ctx.save();
    ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
    ctx.fillStyle = color;
    ctx.textAlign = textAlign || 'left';

    top = top + lineHeight - Math.max((lineHeight - fontSize)/2, 0);
    ctx.fillText(text, left, top, width);
    ctx.restore();
    return Promise.resolve(this);
  }

  //多行文字
  wrapText({text, top, left, fontSize, lineHeight, color, width, height, textAlign, fontWeight}) {
    const {ctx} = this; 
    
    ctx.save();
    ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
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
    ctx.restore();

    result.forEach(({line: text, top, left}, idx) => {
      if(height && (idx + 1) * lineHeight > height) {
        return;
      }
      this.text({text, top, left, fontSize, lineHeight, color, width, textAlign, fontWeight});
    });
    return result;
  }
}