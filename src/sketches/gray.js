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

  let img,video,imgDest,videoDest,img2,img3
  let images = []
  let imgIndex
  let grayIndex = 4
  let grays = [rgbAvg,rgbMax,rgbMid,luma601,luma240,luma709,luma2020]
  let names = ["RGB: Average","RGB: Max","RGB: Mid","Luma: 601","Luma: 240","Luma: 709","Luma: 2020"]
  let imageMode = true

  const preload = p => {
    img = p.loadImage("https://upload.wikimedia.org/wikipedia/commons/0/02/Fire_breathing_2_Luc_Viatour.jpg")
    img2 = p.loadImage("https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp")
    img3 = p.loadImage("https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80")

    images = [img,img2,img3]
    imgIndex = 0
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

    // Init Video
    video = p.createCapture({
      video:{
        mandatory:{
          maxWidth : w,
          maxHeight: h
        }
      },
      audio:false
    })
    video.hide()

    // Init Output images
    imgDest = p.createImage(img.width,img.height)
    videoDest = p.createImage(video.width,video.height)
    
    initImage(imgDest)
    initImage(videoDest)
  }

  const initImage = input => {
    input.loadPixels()
    for (let x = 0; x < input.width; x++) {
      for (let y = 0; y < input.height; y++) {
        let i = (x + y * input.width) * 4
        input.pixels[i] = input.pixels[i+1] = input.pixels[i+2] = input.pixels[i+3] = 255 
      }
    }
    input.updatePixels()
  }

  const draw = p => {
    // Add img/video to graphics and canvas
    // Then calculate gray pixels
    // And display output image
    if (imageMode){
      p.image(img,0,h,w,h)
      gray(img,imgDest)
      p.image(imgDest,0,0,w,h)

    }else{
      p.image(videoDest,0,h,w,h)
      gray(video,videoDest)
      p.image(video,0,0,w,h)
    }

    // Show current function
    p.push()
    p.textSize(50)
    p.fill(255)
    p.stroke(0)
    p.strokeWeight(2)
    p.textAlign(p.CENTER)
    p.text(names[grayIndex],w/2,h/10)
    p.pop()
    
    // Show frameRate/histogram
    if (!imageMode) {
      p.push()
      p.strokeWeight(2)
      p.stroke(0)
      p.fill("#22B455")
      p.textSize(w/10)
      p.text(p.round(p.frameRate()),w/25,h/8)
      p.pop()
    } else histogram(p)
  } 

  const gray = (input, output) => {
    input.loadPixels()
    output.loadPixels()
    for (let x = 0; x < input.width; x++) {
      for (let y = 0; y < input.height; y++) {
        let i = (x + y * input.width) * 4
        const r = input.pixels[i]
        const g = input.pixels[i+1]
        const b = input.pixels[i+2]

        let gray = grays[grayIndex]([r,g,b])

        if(imageMode){
          output.pixels[i] = output.pixels[i+1] = output.pixels[i+2] = gray
          // output.pixels[i+3] = 255
        }else{
          input.pixels[i] = input.pixels[i+1] = input.pixels[i+2] = gray 
          output.pixels[(x+y*output.width)*4 ] = r
          output.pixels[(x+y*output.width)*4 + 1] = g
          output.pixels[(x+y*output.width)*4 + 2] = b
        }
      }
    }
    if(!imageMode) input.updatePixels()
    output.updatePixels()
    output.resize(w,h)
  }

  const histogram = (p) => {
    var maxRange = 256
    var histogram = []

    p.push()
    p.colorMode(p.HSL,255,255,255,255)

    for (var i = 0; i < maxRange; i++) {
      histogram[i] = 0;
    }

    imgDest.loadPixels()
    for (var x = 0; x < imgDest.width; x+=5) {
      for (var y = 0; y < imgDest.height; y+=5) {
        var loc = (x + y * imgDest.width) * 4;
        histogram[imgDest.pixels[loc + 2]]++
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
        p.redraw()
      }
    } 
  
    if (key === "G") {
      if(grayIndex <= grays.length-2) {
        grayIndex++
        p.redraw()
      }
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
