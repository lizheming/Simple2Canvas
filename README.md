# Simple2Canvas
Generate image with json data by canvas https://simple2canvas.netlify.com/

## Installation

You can install it with npm or `<script>`:

```bash
npm install simple2canvas --save-dev
```

```html
<script src="https://unpkg/simple2canvas/dist/simplecanvas.umd.min.js"></script>
```

## Usage

```js
const simple2canvas = require('simple2canvas');
const options = {
  width: 360,
  height: 360,
  rate: 2,
  elements: [
    {
      type: 'rect',
      width: 360,
      height: 360,
      top: 0,
      left: 0,
      fill: '#FFF'
    },
    {
      type: 'text',
      text: 'Hello World!',
      top: 10, 
      left: 10,
      fontSize: 18,
      lineHeight: 18,
      color: 'black'
    }
  ]
};

(async() => {
  const canvas = await simple2canvas(options);
  
  const img = document.createElement('img');
  img.style.width = options.width + 'px';
  img.style.height = options.height + 'px';
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
})();
```

## Configuration

| name | required | default | description |
|------|:----------:|:---------:|-------------|
| width | ✔️ | | canvas width |
| height | ✔️ | | canvas height |
| rate | | 1 | canvas pixel ratio |
| render | | 'html' | canvas render |
| elements | | [] | canvas elements |

### Elements Configuration

#### rect

- `top`
- `left`
- `width`
- `height`
- `fill`
- `round`

#### image

- `top`
- `left`
- `width`
- `height`
- `url`

#### text

- `top`
- `left`
- `fontSize`
- `lineHeight`
- `text`
- `color`
- `textAlign`
- `fontWeight`
- `fontFamily`

## Example
run npm start and open http://localhost:3000

online example: https://simple2canvas.netlify.com/

## License
simple2canvas is released under the MIT license.