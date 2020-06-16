import React from "react"

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const GraySketch = () => {
  const minW = 630
  let w = minW,
    h = 3 * w / 4

  const rgbAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
  const rgbMax = arr => Math.max(...arr)
  const rgbMid = arr => (Math.max(...arr)+Math.min(...arr))/2

  const luma601 = arr => 0.2989 * arr[0] + 0.5870 * arr[1] + 0.1140 * arr[2]
  const luma240 = arr => 0.212 * arr[0] + 0.701 * arr[1] + 0.087 * arr[2]
  const luma709 = arr => 0.2126 * arr[0] + 0.7152 * arr[1] + 0.0722 * arr[2]
  const luma2020 = arr => 0.2627 * arr[0] + 0.6780 * arr[1] + 0.0593 * arr[2]


  let dest,video,img,img2,img3
  let images = []
  let imgIndex
  let grayFunction = arr => 0.2989 * arr[0] + 0.5870 * arr[1] + 0.1140 * arr[2]
  let grayIndex = 0
  let grays = []
  let frames = true, imageMode = true

  const preload = p => {
    img = p.loadImage("https://upload.wikimedia.org/wikipedia/commons/0/02/Fire_breathing_2_Luc_Viatour.jpg")
    img2 = p.loadImage("https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp")
    img3 = p.loadImage("https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80")

    images = [img,img2,img3]
    imgIndex = 0

    grayFunction = luma601
    grays = [rgbAvg,rgbMax,rgbMid,luma601,luma240,luma709,luma2020]
  }

  const setup = (p, canvasParentRef) => {
    // Set canvas to viewport width
    if(p.windowWidth < minW){
      w = p.windowWidth - 40
      h = 3 * (w/4)
    }

    // Resize images
    for(let im of images) im.resize(w,h)
    
    // Init Canvas
    p.createCanvas(w, h*2).parent(canvasParentRef)

    // Init Output image
    dest = p.createImage(img.width,img.height)

    // Init Video
    video = p.createCapture(p.VIDEO)
    video.hide()

    // Init graphics 
    // graphics = p.createGraphics(w, h)

  }

  const draw = p => {
    // Set background to black
    p.background(0)

    // Add img/video to graphics and canvas
    if (imageMode){
      // graphics.image(img,0,0)
      p.image(img,0,h,w,h)
    }else{
      // graphics.image(video,0,0)
      p.image(video,0,h,w,h)
    }

    if(imageMode) gray(p,img,grayFunction)
    else gray(p,video,grayFunction)

    // Show frameRate/histogram
    if (!imageMode && frames) {
      p.push()
      p.strokeWeight(2)
      p.stroke(0)
      p.fill("#22B455")
      p.textSize(w/10)
      p.text(p.round(p.frameRate()),w/25,h/8)
      p.pop()
    } else histogram(p)

    p.image(img,0,0,w,h)
  }

  const gray = (p,input,f) => {
    input.loadPixels()
    dest.loadPixels()
    p.push()
    // p.colorMode(p.RGB,1.0)
    for (let y = 0; y < input.height; y += 5) {
      for (let x = 0; x < input.width; x += 5) {
        var loc = (x + y * input.width) * 4;

        let r = input.pixels[loc+0]
        let g = input.pixels[loc+1]
        let b = input.pixels[loc+2]

        let value = f([r,g,b])

        dest.set(x, y, p.color(value));
      }
    }
    p.pop()

  }

  const histogram = (p) => {
    var maxRange = 256
    var histogram = []

    p.push()
    p.colorMode(p.HSL,255,255,255,255)

    for (var i = 0; i < maxRange; i++) {
      histogram[i] = 0;
    }

    img.loadPixels()
    for (var x = 0; x < img.width; x+=5) {
      for (var y = 0; y < img.height; y+=5) {
        var loc = (x + y * img.width) * 4;
        histogram[img.pixels[loc + 2]]++
      }
    }

    var maxPixels = Math.max(...histogram)
    
    p.push()
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

  const keyTyped = p => {
    let key = p.key

    if (key === "g") {
      if(grayIndex >= 1) {
        grayIndex--
        grayFunction = grays[grayIndex]
        p.redraw()
      }
    } 
  
    if (key === "G") {
      if(grayIndex <= grays.length-2) {
        grayIndex++
        grayFunction = grays[grayIndex]
        p.redraw()
      }
    } 

    if (key === "f") {
      frames = !frames
    }
  }

  const keyPressed = p => {
    let key = p.keyCode

    if (key === p.LEFT_ARROW) {
      if(imgIndex >= 1) {
        imgIndex--
        img = images[imgIndex]
        p.redraw()
      }
    } 

    if (key === p.RIGHT_ARROW) {
      if(imgIndex <= images.length-2) {
        imgIndex++
        img = images[imgIndex]
        p.redraw()
      }
    } 

    if (key === p.BACKSPACE) {
      if(imageMode) {
        imageMode = false
        p.loop()
      } else {
        imageMode = true
      }
    } 
  }

  return <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} keyPressed={keyPressed} />
}

export default GraySketch
