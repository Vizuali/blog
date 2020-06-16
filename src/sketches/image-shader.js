import { useStaticQuery, graphql } from "gatsby"
import React from 'react'

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const ImageShaderSketch = (props) => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "shaders" }, name: { eq: "convolution" } }
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
  let video,img,img2,img3
  let images = []
  let imgIndex

  let frames = true, imageMode = props.imageMode
  let isEdge1 = false, isEdge2 = false, isEdge3 = false, isSharp = false, isBoxblur = false;

  const preload = p => {
    shader = p.loadShader(
      data.allFile.nodes[0].publicURL,
      data.allFile.nodes[1].publicURL
    )

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

    // Init Canvas
    p.createCanvas(w, h*2).parent(canvasParentRef)

    // Init Video
    video = p.createCapture(p.VIDEO)
    video.hide()
    
    // Init graphics 
    graphics = p.createGraphics(w, h, p.WEBGL)
  }

  const draw = p => {
    // Shader setup
    graphics.shader(shader)

    // Uniforms setup
    if (imageMode) shader.setUniform("tex0", img)
    else shader.setUniform("tex0", video)

    shader.setUniform("stepSize", [1/w, 1/h])
    shader.setUniform('dist', 3.0);

    shader.setUniform("isEdge1", isEdge1)
    shader.setUniform("isEdge2", isEdge2)
    shader.setUniform("isEdge3", isEdge3)
    shader.setUniform("isSharp", isSharp)
    shader.setUniform("isBoxblur", isBoxblur)
    
    // Add img/video to graphics and canvas
    if (imageMode){
      graphics.image(img, 0, 0)
      p.image(img,0,h,w,h)
    }else{
      graphics.image(video, 0, 0)
      p.image(video,0,h,w,h)
    }
    
    // Flip video for proper visualization
    graphics.translate(0,h)
    p.scale(1.0,-1.0); 

    // This is just a geometry needed to visualize the shader output
    graphics.rect(0, 0, w, h)

    // Show shader output on canvas
    p.push()
    p.scale(1.0,-1.0)
    p.image(graphics, 0,1)
    p.pop()

    // Show frameRate/histogram
    if (!imageMode && frames) {
      p.push()
      p.strokeWeight(2)
      p.stroke(0)
      p.fill("#22B455")
      p.textSize(w/10)
      p.scale(1.0,-1.0); 
      p.text(Math.round(p.frameRate()),10,w/10)
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

    graphics.loadPixels()
    for (var x = 0; x < graphics.width; x+=5) {
      for (var y = 0; y < graphics.height; y+=5) {
        var loc = (x + y * graphics.width) * 4;
        histogram[graphics.pixels[loc + 2]]++
      }
    }

    var maxPixels = Math.max(...histogram)
    
    p.push()
    p.scale(1.0,-1.0)
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

  // Toggle color from image
  const keyTyped = p => {
    let key = p.key

    // identity
    if (key === "i") {
      isEdge1 = isEdge2 = isEdge3 = isSharp = isBoxblur = false
    }

    // edge
    if (key === "e") {
      isEdge1 = true
      isEdge2 = isEdge3 = isSharp = isBoxblur = false
    }
    if (key === 'r') {
      isEdge2 = true
      isEdge1 = isEdge3 = isSharp = isBoxblur = false
    }
    if (key === 't') {
      isEdge3 = true
      isEdge1 = isEdge2 = isSharp = isBoxblur = false
    }

    //sharp
    if (key === "s") {
      isSharp = true
      isEdge1 = isEdge2 = isEdge3 = isBoxblur = false
    }

    // blur
    // if (key === "b") {
    //   kernel = masks.gaussianblur5x5
    //   apply(p)
    // }
    if (key === 'v') {
      isBoxblur = true
      isEdge1 = isEdge2 = isEdge3 = isSharp = false
    }

    if (key === "f") {
      frames = !frames
    }
  }

  const keyPressed = p => {
    if (p.keyCode === p.LEFT_ARROW) {
      if(imgIndex >= 1) {
        imgIndex--
        img = images[imgIndex]
        p.redraw()
      }
    } 

    if (p.keyCode === p.RIGHT_ARROW) {
      if(imgIndex <= images.length-2) {
        imgIndex++
        img = images[imgIndex]
        p.redraw()
      }
    } 

    if (p.keyCode === p.BACKSPACE) {
      if(imageMode) {
        imageMode = false
        p.loop()
      } else {
        imageMode = true
      }
    } 
  }

  return <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} keyPressed={keyPressed}/>
}

export default ImageShaderSketch