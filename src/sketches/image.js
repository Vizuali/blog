import React from 'react'

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const ImageSketch = () => {
  const masks = {
    identity: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    edge: [
      [-1, 0, 1],
      [0, 0, 0],
      [1, 0, -1],
    ],
    edge1: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    edge2: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0],
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
    boxblur: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ]
  }

  let kernel = masks.edge
  let img,dest

  const w = 630, h = 3 * w / 4

  const preload = p => {
    img = p.loadImage(
      "https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp"
    )
  }

  const setup = (p, canvasParentRef) => {
    p.createCanvas(w, h * 2).parent(canvasParentRef)
    dest = p.createImage(img.width, img.height)
    apply(p)
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

  const histogram = (p) => {
    var maxRange = 256
    var histogram = []

    p.push()
    p.colorMode(p.HSL,255,255,255,255)

    for (var i = 0; i < maxRange; i++) {
      histogram[i] = 0;
    }

    dest.loadPixels()
    for (var x = 0; x < dest.width; x+=5) {
      for (var y = 0; y < dest.height; y+=5) {
        var loc = (x + y * dest.width) * 4;
        histogram[dest.pixels[loc + 2]]++
      }
    }

    var maxPixels = Math.max(...histogram)
    
    p.push()
    // p.scale(1.0,-1.0)
    p.noStroke()
    p.fill(255,255,255,180)
    p.rect(0,h,w,h)
    for (i = 0; i < 255; i++) {
      var height = p.map(histogram[i], 0, maxPixels, 0, h)
      p.fill(255,255,i,200)
      p.rect((i * (w / 256)) + 1, h*2, w / 256, -height)
    }
    p.pop()

    p.pop()

    // Histogram is intensive on pixels, run once and stop loop
    p.noLoop()
  }
  const grayScale = () => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        // var a = img.pixels[index + 3]

        var bw = (r + g + b) / 3

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const grayScaleLuma601 = () => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        // var a = img.pixels[index + 3]

        var bw = r * 0.299 + g * 0.587 + b * 0.0114

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const grayScaleLuma709 = () => {
    dest.loadPixels()
    img.loadPixels()
    for (var y = 0; y < dest.height; y++) {
      for (var x = 0; x < dest.width; x++) {
        var index = (x + y * dest.width) * 4
        var r = img.pixels[index + 0]
        var g = img.pixels[index + 1]
        var b = img.pixels[index + 2]
        // var a = img.pixels[index + 3]

        var bw = r * 0.2126 + g * 0.7152 + b * 0.0722

        dest.pixels[index + 0] = bw
        dest.pixels[index + 1] = bw
        dest.pixels[index + 2] = bw
      }
    }

    dest.updatePixels()
  }

  const draw = p => {
    p.image(dest, 0, 0,w,h)
    p.image(img, 0, h,w,h)
    histogram(p)
  }

  const keyTyped = p => {
    let key = p.key

    // identity
    if (key === "i") {
      kernel = masks.identity
      apply(p)
      p.loop()
    }

    // blur
    if (key === "b") {
      kernel = masks.gaussianblur5x5
      apply(p)
      p.loop()
    }
    if (key === 'v') {
      kernel = masks.boxblur
      apply(p)
      p.loop()
    }

    // edge
    if (key === "e") {
      kernel = masks.edge
      apply(p)
      p.loop()
    }
    if (key === 'r') {
      kernel = masks.edge1
      apply(p)
      p.loop()
    }
    if (key === 't') {
      kernel = masks.edge2
      apply(p)
      p.loop()
    }

    //sharp
    if (key === "s") {
      kernel = masks.sharp
      apply(p)
      p.loop()
    }

    if (key === "g") {
      grayScale()
    }
    if (key === "h") {
      grayScaleLuma601()
    }
    if (key === "j") {
      grayScaleLuma709()
    }
  }

  return <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} />
}

export default ImageSketch