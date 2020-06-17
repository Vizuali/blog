import { useStaticQuery, graphql } from "gatsby"
import React from 'react'

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const AsciiShaderSketch = (props) => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "shaders" }, name: { eq: "ascii" } }
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

  let gray = false, monotone = false, frames = true, imageMode = props.imageMode

  const preload = p => {
    try{
      shader = p.loadShader(
        data.allFile.nodes[0].publicURL,
        data.allFile.nodes[1].publicURL
      )
    } catch(e){
      shader = p.loadShader("https://raw.githubusercontent.com/Vizuali/index/master/src/shaders/ascii.vert","https://raw.githubusercontent.com/Vizuali/index/master/src/shaders/ascii.frag")
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
      h = 3 * (p.windowWidth/4)
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
    // This line is for maintain good aspect ratio on small devices
    shader.setUniform("iResolution", [w < minW ? w*4 : w, w < minW ? h*4 : h]);
    if (imageMode) shader.setUniform("iChannel0", img);
    else shader.setUniform("iChannel0", video);
    shader.setUniform("iMouse", gray);
    shader.setUniform("monotone", monotone);
    
    // Add img/video to graphics and canvas
    if (imageMode){
      graphics.image(img, 0, 0)
      p.image(img,0,h,w,h)
    }else{
      graphics.image(video, 0, 0)
      p.image(video,0,h,w,h)
    }
    
    if(gray || monotone) p.filter(p.GRAY);

    // Flip video for proper visualization
    // graphics.translate(0,h)
    p.scale(1.0,-1.0); 

    // This is just a geometry needed to visualize the shader output
    graphics.rect(0,0,0,0)

    // Show shader output on canvas
    p.image(graphics, 0,-h)

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

    img.loadPixels()
    for (var x = 0; x < img.width; x+=5) {
      for (var y = 0; y < img.height; y+=5) {
        var loc = (x + y * img.width) * 4;
        histogram[img.pixels[loc + 2]]++
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

    if (key === "g") {
      gray = !gray
      monotone = false
    }

    if (key === "m") {
      monotone = !monotone
      gray = false
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

  return <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} keyPressed={keyPressed} />
}

export default AsciiShaderSketch