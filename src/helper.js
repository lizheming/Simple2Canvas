const isNumber = function(num) {
  return typeof num === 'number' && !isNaN(num);
}

const isFunction = function(fn) {
  return typeof fn === 'function';
}

const formatCoord = function({top, left, width, height, right, bottom}, {width: canvasWidth, height: canvasHeight}) {
  if(isNumber(right) && isNumber(width)) {
    left = canvasWidth - width - right;
  }
  if(isNumber(bottom) && isNumber(height)) {
    top = canvasHeight - height - bottom;
  }
  return {top, left};
}

const getTextWidth = function({
  fontWeight,
  fontSize,
  width,
  text,
  top,
  left,
  lineHeight
}) {
  const canvas = document.createElement('canvas');
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;
  const ctx = canvas.getContext('2d');
  ctx.font = [fontWeight, fontSize ? fontSize + 'px' : '', 'Arial'].filter(v => v).join(' ');
  if(!width) {
    const metrics = ctx.measureText(text);
    return metrics;
  }

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
  return result;
}

export default {
  getTextWidth,
  isNumber,
  isFunction,
  formatCoord
};