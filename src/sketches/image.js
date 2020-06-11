const React = require("react")
const { Component } = React
const Sketch = typeof window !== `undefined` ? require("react-p5") : null

class ImageSketch extends Component {
  cnv = null
  options =
    " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLunT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q"
  gui = null
  btn = null
  livebtn = null
  live = true
  capture = null
  pg = null
  img = null

  masks = {
    identity: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    edge1: [
      [1, 0, -1],
      [0, 0, 0],
      [-1, 0, 1],
    ],
    edge2: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0],
    ],
    edge3: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    sharp: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    boxblur: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
    gaussianblur3x3: [
      [1 / 16, 1 / 8, 1 / 16],
      [1 / 8, 1 / 4, 1 / 8],
      [1 / 16, 1 / 8, 1 / 16],
    ],
    gaussianblur5x5: [
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 /256],
      [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 /256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 /256],
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    ],
  }

  kernel = this.masks.gaussianblur5x5
  dest = null

  preload = p5 => {
    this.img = p5.loadImage(
      "https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp"
    )
  }

  setup = (p5, canvasParentRef) => {
    this.cvn = p5
      .createCanvas(this.img.width * 2, this.img.height)
      .parent(canvasParentRef)
    p5.pixelDensity(1)
    this.dest = p5.createImage(this.img.width, this.img.height)
    this.apply(p5)
  }

  apply = p => {
    this.dest.loadPixels()
    this.img.loadPixels()
    // console.log(this.kernel.length)
    for (let x = 0; x < this.dest.width; x++) {
      for (let y = 0; y < this.dest.height; y++) {
        let result = this.convolution(
          p,
          this.img,
          x,
          y,
          this.kernel,
          this.kernel.length
        )
        let index = (x + y * this.dest.width) * 4
        // console.log(result)
        this.dest.pixels[index + 0] = result[0]
        this.dest.pixels[index + 1] = result[1]
        this.dest.pixels[index + 2] = result[2]
        this.dest.pixels[index + 3] = 255
      }
    }
    this.dest.updatePixels()
  }

  convolution = (p, img, x, y, kernel, ksize) => {
    let accumulator = [0.0, 0.0, 0.0]
    let offset = p.floor(ksize / 2)
    // console.log(offset)

    for (let i = 0; i < ksize; i++) {
      for (let j = 0; j < ksize; j++) {
        let xpos = x + i - offset
        let ypos = y + j - offset
        let index = (xpos + img.width * ypos) * 4
        index = p.constrain(index, 0, img.pixels.length - 1)

        accumulator[0] += img.pixels[index + 0] * kernel[i][j]
        accumulator[1] += img.pixels[index + 1] * kernel[i][j]
        accumulator[2] += img.pixels[index + 2] * kernel[i][j]
      }
    }
    return accumulator
  }

  draw = p5 => {
    p5.image(this.img, 0, 0)
    p5.image(this.dest, this.img.width, 0)
  }
  render() {
    return <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
  }
}

export default ImageSketch;