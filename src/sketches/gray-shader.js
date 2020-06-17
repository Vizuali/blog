import { useStaticQuery, graphql } from "gatsby"
import React from "react"

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const GrayShaderSketch = () => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "shaders" }, name: { eq: "gray" } }
        sort: { fields: extension, order: DESC }
      ) {
        nodes {
          publicURL
        }
      }
    }
  `)
  const minW = 630
  let w = minW,
    h = 3 * w / 4

  let shader
  let graphics
  let images = []
  let imgIndex
  let img,video,img2,img3

  let grayIndex = 4
  let names = ["RGB: Average","RGB: Max","RGB: Mid","Luma: 601","Luma: 240","Luma: 709","Luma: 2020"]
  let imageMode = true

  let isRgbMax = false,
      isRgbMid = false,
      isRGBAvg = false,
      isLuma240 = false,
      isLuma601 = false,
      isLuma709 = false

  const preload = p => {
    try{
      shader = p.loadShader(
        data.allFile.nodes[0].publicURL,
        data.allFile.nodes[1].publicURL
      )
    } catch(e){
      shader = p.loadShader("https://raw.githubusercontent.com/Vizuali/index/master/src/shaders/gray.vert","https://raw.githubusercontent.com/Vizuali/index/master/src/shaders/gray.frag")
    }

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

    // Init graphics 
    graphics = p.createGraphics(w, h, p.WEBGL)
  }

  const draw = p => {
    // Shader setup
    graphics.shader(shader)

    // Uniforms setup
    // This line is for maintain good aspect ratio on small devices
    shader.setUniform("iResolution", [w < minW ? w*4 : w, w < minW ? h*4 : h])
    imageMode ? shader.setUniform("tex0", img) : shader.setUniform("tex0", video)
    shader.setUniform("isRGBAvg", isRGBAvg)
    shader.setUniform("isRgbMax", isRgbMax)
    shader.setUniform("isRgbMid", isRgbMid)
    shader.setUniform("isLuma601", isLuma601)
    shader.setUniform("isLuma240", isLuma240)
    shader.setUniform("isLuma709", isLuma709)

    // Add img/video to graphics and canvas
    // Then calculate gray pixels
    // And display output image
    if (imageMode){
      graphics.image(img, 0, 0)
      p.image(img,0,h,w,h)
    }else{
      graphics.image(video, 0, 0)
      p.image(video,0,h,w,h)
    }

    // Flip video for proper visualization
    // graphics.translate(0,h)
    p.push()
    p.scale(-1.0,1.0); 

    // This is just a geometry needed to visualize the shader output
    graphics.rect(0,0,0,0)

    // Show shader output on canvas
    // p.image(graphics, 0,0)
    // p.image(graphics, 0,-h)
    p.image(graphics, -w,1)
    p.pop()

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
        isRgbMax = isRgbMid = isRGBAvg = isLuma240 = isLuma601 = isLuma709 = false

        switch(grayIndex){
          case 0:
            isRGBAvg = true
            break
          case 1:
            isRgbMax = true
            break
          case 2:
            isRgbMid = true
            break
          case 3:
            isLuma601 = true
            break
          case 4:
            isLuma240 = true
            break
          case 5:
            isLuma709 = true
            break
          default:
            break
        }

        p.redraw()
      }
    } 
  
    if (key === "G") {
      if(grayIndex <= names.length-2) {
        grayIndex++

        isRgbMax = isRgbMid = isRGBAvg = isLuma240 = isLuma601 = isLuma709 = false

        switch(grayIndex){
          case 0:
            isRGBAvg = true
            break
          case 1:
            isRgbMax = true
            break
          case 2:
            isRgbMid = true
            break
          case 3:
            isLuma601 = true
            break
          case 4:
            isLuma240 = true
            break
          case 5:
            isLuma709 = true
            break
          default:
            break
        }

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

export default GrayShaderSketch
