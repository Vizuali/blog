const React = require("react")
const { Component } = React
const Sketch = typeof window !== `undefined` ? require("react-p5") : null

class AsciiSketch extends Component {
  // letterOrder = " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLu" +
  // "nT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q"

  // letters = []
  // bright = []
  // chars = []

  // font = ""
  // fontSize = 1.5

  // preload = p5 => {
  //   // this.font = p5.loadFont("Roboto")
  // }

  // setup =   for (int y = 0; y < img.height; y += resolution) {
  // for (int x = 0; x < img.width; x += resolution) {
  // color pixel = img.pixels[y * img.width + x];
  //text(ascii[int(brightness(pixel))], x, y);
  // }
  // } => {
  //   p5.createCanvas(640, 480).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  //   // this.image = p5.loadImage("https://shop.salvador-dali.org/media/catalog/category/lincoln_3.jpg")
  //   this.image = p5.createCapture(p5.VIDEO)
  //   this.image.size(160,120)
  //   this.image.hide()
  //   // this.image.start()

  //   let count = p5.int(160 * 120)
  //   this.letters = new Array(256)

  //   for(let i = 0; i < 256; i++){
  //     let index = p5.int(p5.map(i,0,256,0,this.letterOrder.length))
  //     this.letters[i] = this.letterOrder.charAt(index)
  //   }

  //   this.bright = new Array(count)

  //   for(let i = 0; i < count; i++){
  //     this.bright[i] = 128
  //   }

  //   p5.textFont('Inconsolata', 10);
  // };

  // draw = p5 => {
  //   p5.background(255)
  //   p5.fill(0)

  //   p5.push()
  //   let hgap = p5.width / this.image.width
  //   let vgap = p5.height / this.image.height

  //   p5.scale(p5.max([hgap, vgap]) * this.fontSize)

  //   let index = 0
  //   this.image.loadPixels()

  //   for (let y = 1; y < this.image.height; y++) {

  //   //   // Move down for next line
  //     p5.translate(0, 1.0 / this.fontSize);

  //     p5.push();
  //     for (let x = 0; x < this.image.width; x++) {
  //       let pixelColor = this.image.pixels[index]
  //   //     // Faster method of calculating r, g, b than red(), green(), blue()
  //       let r = (pixelColor >> 16) & 0xff;
  //       let g = (pixelColor >> 8) & 0xff;
  //       let b = pixelColor & 0xff;

  //   //     // Another option would be to properly calculate brightness as luminance:
  //   //     // luminance = 0.3*red + 0.59*green + 0.11*blue
  //   //     // Or you could instead red + green + blue, and make the the values[] array
  //   //     // 256*3 elements long instead of just 256.
  //       let pixelBright = 0.3*r + 0.59*g + 0.11*b

  //   //     // The 0.1 value is used to damp the changes so that letters flicker less
  //       let diff = pixelBright - this.bright[index]
  //       this.bright[index] += diff * 0.1

  //       let num = p5.int(this.bright[index])
  //       p5.text(this.letters[num], 0, 0);

  //   //     // Move to the next pixel
  //       index++;

  //   //     // Move over for next character
  //       p5.translate(1.0 / this.fontSize, 0)
  //     }
  //     p5.pop()
  //   }
  //   p5.pop()
  //   // p5.noLoop()
  // };

  cnv = null
  options =
    " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLunT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q"
  gui = null
  btn = null
  livebtn = null
  live = true
  capture = null
  pg = null

  setup = (p5, canvasParentRef) => {
    this.cvn = p5.createCanvas(400, 300).parent(canvasParentRef)

    this.pg = p5.createGraphics(400, 300)
    this.pg.parent(this.cvn)
    this.capture = p5.createCapture(p5.VIDEO)
    this.capture.size(400, 300)
    this.capture.parent(this.cvn)

    p5.textFont("Inconsolata", 10)
  }

  draw = p5 => {
    this.pg.image(this.capture, 0, 0, 80, 60)

    p5.background(255)
    p5.fill(0)

    for (let i = 0; i < 60; i++) {
      for (let j = 0; j < 80; j++) {
        let x = this.pg.get(p5.round(j * 1.143), i * 2)
        let f = 1 - x[0] / 255.0
        f = f * f //square factor to lighten up, because less bright characters
        let v = p5.round(f * 40)
        let index = p5.floor(p5.random(this.options[v].length))
        let chr = this.options[v][index]
        p5.text(chr, j * 5.7, i * 11)
      }
    }
  }

  // resolution = 9
  // fontSize = 5
  // ascii = new Array()
  // capture = null

  // setup = (p5, canvasParentRef) => {
  //   p5.createCanvas(400,300).parent(canvasParentRef)
  //   this.capture = p5.createCapture(p5.VIDEO)
  //   this.capture.size(400,300)
  //   this.capture.hide()
  //   // p5.image(this.capture,0,0)

  //   p5.background(255)
  //   p5.fill(0)
  //   p5.noStroke()

  //   this.ascii = new Array(256)
  //   let letters = " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLu" +
  //                 "nT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q";

  //   let reverse = "";

  //   for(let i = letters.length - 1; i >= 0; i--){
  //     reverse += letters.charAt(i);
  //   }

  //   letters = reverse

  //   for(let i = 0; i < 256; i++){
  //     let index = p5.int(p5.map(i,0,256,0,letters.length))
  //     this.ascii[i] = letters.charAt(index)
  //   }

  //   p5.textFont('Inconsolata', this.fontSize)
  // }

  // draw = p5 => {
  //   this.capture.loadPixels()
  //   for (let y = 0; y < this.capture.height; y += this.resolution) {
  //     for (let x = 0; x < this.capture.width; x += this.resolution) {
  //       let pixel = this.capture.pixels[y * this.capture.width + x];
  //       p5.text(this.ascii[p5.int(p5.brightness(pixel))], x, y);
  //     }
  //   }
  // }

  render() {
    return <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
  }
}

export default AsciiSketch;