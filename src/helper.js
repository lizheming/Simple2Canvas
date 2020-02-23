export const getTextWidth = function({
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