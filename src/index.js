import Render from './render/render';
import HTMLRender from './render/html';
import NodeRender from './render/node';

const Renders = {
  html: HTMLRender,
  node: NodeRender
};

function generator({width, height, rate = 1, render = 'html', elements}) {
  width *= rate;
  height *= rate;

  const Render = typeof render === 'function' ? render : (Renders[render] || Renders.html);
  render = new Render(width, height, {rate});

  elements = elements.filter(({type}) => typeof type === 'function' || typeof render[type] === 'function');
  const processes = elements.reduce((defer, opt) => {
    if(typeof opt.right === 'number' && typeof opt.width === 'number') {
      opt.left = width - opt.width - opt.right;
      delete opt.right;
    }
    if(typeof opt.bottom === 'number' && typeof opt.height === 'number') {
      opt.top = height - opt.height - opt.bottom;
      delete opt.bottom;
    }
    return defer.then(() => typeof opt.type === 'function' ? opt.type.call(render, opt) : render[opt.type](opt))
  }, Promise.resolve());

  return processes.then(() => render.canvas);
}

generator.Render = Render;
generator.Renders = Renders;

export default generator;