import Render from './render/render';
import HTMLRender from './render/html';
import NodeRender from './render/node';
import utils from './helper';

const {isNumber, isFunction, formatCoord} = utils;
const Renders = {
  html: HTMLRender,
  node: NodeRender
};

function generator({width, height, rate = 1, render = 'html', elements}) {
  const Render = isFunction(render) ? render : (Renders[render] || Renders.html);
  render = new Render(width * rate,  height * rate, {rate});

  //将所有的 GROUP 类型元素打平到数组中
  for(let i = 0; i < elements.length; i++) {
    const {type, elements: children, top, left, right, bottom, width, height, __GROUP_POS__, ...groupOpt} = elements[i];
    if(type !== 'group' || !Array.isArray(children) || !children.length) {
      continue;
    }

    groupOpt.__GROUP_POS__ = {top, left, right, bottom, width, height};
    //针对 group 嵌套的情况，需要将父 group 的 pos 追加到当前 group 配置中
    if(__GROUP_POS__) {
      const {top, left} = formatCoord(__GROUP_POS__, {width, height});
      if(isNumber(top)) {
        groupOpt.__GROUP_POS__.top += top;
      }
      if(isNumber(left)) {
        groupOpt.__GROUP_POS__.left += left;
      }
    }

    elements.splice(i, 1, ...children.map(child => {
      for(const k in groupOpt) {
        !child.hasOwnProperty(k) && (child[k] = groupOpt[k]);
      }
      return child;
    }));
    i -= 1;
  }

  //对所有的元素处理存在 right, bottom 和 __GROUP_POS__ 的情况
  for(let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const {top, left} = formatCoord(element, {
      width: element.__GROUP_POS__ ? element.__GROUP_POS__.width || width : width,
      height: element.__GROUP_POS__ ? element.__GROUP_POS__.height || height : height
    });
    isNumber(top) && (element.top = top);
    isNumber(left) && (element.left = left);
    delete element.right;
    delete element.bottom;

    console.log(JSON.stringify(element, null, '\t'));

    if(element.__GROUP_POS__) {
      const {top, left} = formatCoord(element.__GROUP_POS__, {width, height});
      isNumber(top) && (element.top += top);
      isNumber(left) && (element.left += left);
      delete element.__GROUP_POS__;
    }
  }

  const processes = elements.reduce((defer, opt) => defer.then(() => {
    if(isFunction(opt.type)) {
      return opt.type.call(render, opt);
    } else if(isFunction(render[opt.type])) {
      return render[opt.type](opt);
    } else {
      return Promise.resolve();
    }
  }), Promise.resolve());

  return processes.then(() => render.canvas);
}

generator.Render = Render;
generator.Renders = Renders;
generator.utils = utils;

export default generator;