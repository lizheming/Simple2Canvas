const options = {
  width: 360,
  height: 360,
  elements: [
    {type: 'rect', fill: '#FFF', width: 360, height: 360, top: 0, left: 0},
    {type: 'text', text: 'Hello World!', top: 10, left: 10, fontSize: 20, lineHeight: 30}
  ]
};

(async () => {
  const canvas = await simple2canvas(options);
  const img = document.createElement('img');
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();