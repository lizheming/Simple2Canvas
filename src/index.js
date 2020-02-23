import Render from './render/render';
import HTMLRender from './render/html';

const Renders = {
  html: HTMLRender
};

function generator({width, height, rate = 1, render = 'html', elements}) {
  const Render = typeof render === 'function' ? render : (Renders[render] || Renders.html);
  render = new Render(width, height);

  elements = elements.filter(({type}) => typeof type === 'function' || typeof render[type] === 'function');
  const processes = elements.reduce((defer, opt) => {
    return defer.then(() => typeof opt.type === 'function' ? opt.type.call(render, opt) : render[opt.type](opt))
  }, Promise.resolve());

  return processes.then(() => render.canvas);
}

generator.Render = Render;
generator.Renders = Renders;

export default generator;