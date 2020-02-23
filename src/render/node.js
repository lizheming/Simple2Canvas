
import canvas from 'canvas';
import HTMLRender from './html';

const { createCanvas, loadImage } = canvas;

export default class NodeRender extends HTMLRender {
  constructor(width, height, {rate}) {
    super(width, height);

    const canvas = createCanvas(width, height);

    this.rate = rate;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  //图片
  image({url, top: y, left: x, width, height}) {
    [x, y, width, height] = [x, y, width, height].map(v => v * this.rate);

    const {ctx} = this;
    return new Promise((resolve, reject) => {
      ctx.save();
      loadImage(url).then(img => {
        ctx.drawImage(img, x, y, width, height);
        ctx.resolve();
      });
    })
  }
}