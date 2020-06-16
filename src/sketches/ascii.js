import { useStaticQuery, graphql } from "gatsby"
import React from "react"

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const AsciiSketch = () => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          sourceInstanceName: { eq: "assets" }
          name: { eq: "UniversLTStd-Light" }
        }
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

  const resolution = 3
  const fontSize = 16.0

  let video,font,graphics,img,img2,img3
  let images = []
  let imgIndex
  // let letters = "@@@MMMBBBHHEEENNNRR###KKKWWXXXDDDFFFPPQQQAAASSUUUZZZbbdddeeehhxxx***888GGmmm&&&00444LLLOOVVVYYYkkkppqqq555TTaaagggnnsss66699ooowwwzzz$$CCCIIIuu222333JJcccfffrryyy%%%111vv777lll++iiittt[[]]]   {{{}}???jjj||((()))==~~~!!!--///<<<>>>\"\"^^^___'';;;,,,::```... "
  // let letters = " ...```::,,,;;;''___^^^\"\">>><<<///--!!!~~~==)))(((||jjj???}}{{{]]][[tttiii++lll777vv111%%%yyyrrfffcccJJ333222uuIIICCC$$zzzwwwooo99666sssnngggaaaTT555qqqppkkkYYYVVVOOLLL44400&&&mmmGG888***xxxhheeedddbbZZZUUUSSAAAQQQPPFFFDDDXXXWWKKK###RRNNNEEEHHBBBMMM@@@"
  let letters = "................................::::::::::::::::::::::::::::::::++++++++++++++++++++++++++++++++oooooooooooooooooooooooooooooooo&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&88888888888888888888888888888888@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@################################"
  // let letters = "################################@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@88888888888888888888888888888888&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&oooooooooooooooooooooooooooooooo++++++++++++++++++++++++++++++++::::::::::::::::::::::::::::::::................................"
  // let letters = "                          ..........................:::::::::::::::::::::::::--------------------------=========================++++++++++++++++++++++++++**************************#########################%%%%%%%%%%%%%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@"
  // let letters = "........```--___''':::,,;;;^^^==+++///\"\"\"||)))\\\\<<<>>)))iiivv%%%xxxcccllrrrsss{{***}}}III??!!!]]][[[11tttaaaeeooo777zzzjjLLLuuunnTTT###JJJCCwwwfffyyy33222555FFppp666mmmqqSSSggghhhVVddd444EEgggXXXPPPGGZZZbbbYYkkkOOOAAA&&888UUU$$$@@KKKHHHDDBBBWWWNNNMMRRR000Q";

  let gray = false, monotone = false, frames = true, imageMode = false

  const preload = p => {
    font = p.loadFont(data.allFile.nodes[0].publicURL)

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
    video = p.createCapture(p.VIDEO)
    video.hide()

    // Init graphics 
    graphics = p.createGraphics(w, h)

    // Set fotn and font size
    p.textFont(font, fontSize)
  }

  const draw = p => {
    // Set background to black
    p.background(0)

    // Add img/video to graphics and canvas
    if (imageMode){
      graphics.image(img,0,0)
      p.image(img,0,h,w,h)
    }else{
      graphics.image(video,0,0)
      p.image(video,0,h,w,h)
    }

    if(gray || monotone) p.filter(p.GRAY)

    if(imageMode) ascii(p,img)
    else ascii(p,video)

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
  }

  const ascii = (p,input) => {
    input.loadPixels()
    for (let y = 0; y < input.height; y += 5*resolution) {
      for (let x = 0; x < input.width; x += 5*resolution) {
        var loc = (x + y * input.width) * 4;

        let r = input.pixels[loc+0]
        let g = input.pixels[loc+1]
        let b = input.pixels[loc+2]

        let brightness = Math.max(r,g,b)
        // let brightness = 0.3 * r + 0.59 * g + 0.11 * b
        // let brightness = input.pixels[loc+2]

        if (gray) p.fill(brightness)
        else if(monotone) p.fill(255)
        else p.fill(r,g,b)

        p.text(letters[brightness], x, y)
      }
    }
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

export default AsciiSketch
