const React = require("react")
const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const ImageSketch = () => {
  let cnv = null
  let options = ` .\`-_':,;^=+/"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLunT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q`
  let gui = null
  let capture = null
  let pg = null
  let img = null

  let masks = {
    identity: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    edge: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    sharp: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    gaussianblur5x5: [
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
      [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    ],
  }

  let kernel = masks.edge
  let dest = null

  const preload = p5 => {
    img = p5.loadImage(
      "https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp"
    )
  }

  const setup = (p5, canvasParentRef) => {
    cnv = p5.createCanvas(img.width * 2, img.height).parent(canvasParentRef)
    p5.pixelDensity(1)
    dest = p5.createImage(img.width, img.height)
    apply(p5)
  }

  const apply = p => {
    dest.loadPixels()
    img.loadPixels()
    for (let x = 0; x < dest.width; x++) {
      for (let y = 0; y < dest.height; y++) {
        let result = convolution(p, img, x, y, kernel, kernel.length)
        let index = (x + y * dest.width) * 4
        dest.pixels[index + 0] = result[0]
        dest.pixels[index + 1] = result[1]
        dest.pixels[index + 2] = result[2]
        dest.pixels[index + 3] = 255
      }
    }
    dest.updatePixels()
  }

  const convolution = (p, img, x, y, kernel, ksize) => {
    let accumulator = [0.0, 0.0, 0.0]
    let offset = p.floor(ksize / 2)
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

  const grayScale = p => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        var a = img.pixels[index + 3]

        var bw = (r + g + b) / 3

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const grayScaleLuma601 = p => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        var a = img.pixels[index + 3]

        var bw = r * 0.299 + g * 0.587 + b * 0.0114

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const grayScaleLuma709 = p => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        var a = img.pixels[index + 3]

        var bw = r * 0.2126 + g * 0.7152 + b * 0.0722

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const draw = p5 => {
    p5.image(img, 0, 0)
    p5.image(dest, img.width + 1, 0)
  }

  const keyTyped = p5 => {
    let key = p5.key

    // identity
    if (key === "i") {
      kernel = masks.identity
      apply(p5)
    }

    // blur
    if (key === "b") {
      kernel = masks.gaussianblur5x5
      apply(p5)
    }

    // edge
    if (key === "e") {
      kernel = masks.edge
      apply(p5)
    }

    //sharp
    if (key === "s") {
      kernel = masks.sharp
      apply(p5)
    }

    if (key === "g") {
      grayScale(p5)
    }
    if (key === "h") {
      grayScaleLuma601(p5)
    }
    if (key === "j") {
      grayScaleLuma709(p5)
    }
  }

  return (
    <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} />
  )
}

export default ImageSketch
