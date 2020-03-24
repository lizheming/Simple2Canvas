function RainbowElement({text, color, top, left}) {
  return {
    type: 'group',
    width: 40,
    height: 40,
    top,
    left,
    elements: [
      {
        type: 'rect',
        fill: color,
        width: 40,
        height: 40, 
        top: 0,
        left: 0
      },
      {
        type: 'text',
        text,
        color: '#FFF',
        fontSize: 20,
        lineHeight: 40,
        top: 0,
        left: 20,
        textAlign: 'center'
      }
    ]
  };
}

const rainbowText = 'Hello World!';
const options = {
  width: rainbowText.length * 40,
  height: 80,
  rate: 1,
  elements: [
    {type: 'rect', fill: '#FFF', top: 0, left: 0, width: rainbowText.length * 40 , height: 80},
    ...rainbowText.split('').map((text, i) => RainbowElement({text, color: `hsl(${10 + 350 * i / (rainbowText.length - 1)}, 100%, 60%)`, top: 20, left: i * 40}))
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