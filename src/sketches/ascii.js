// const { useStaticQuery, graphql } = require("gatsby");
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

  // let video
  // const resolution = 3
  // const fontSize = 1.0

  // const videoWidth = 176
  // const videoHeight = 144

  // let ascii

  // let letterOrder = `Q0RMNWBDHK@$U8&AOkYbZGPXgE4dVhgSqm6pF523yfwCJ#TnuLjz7oeat1[]!?I}*{srlcx%vi)><\\)|"/+=^;,:'_-\`.`

  // let letters
  // let bright
  // let chars

  // let font

  // const preload = p => {
  //   font = p.loadFont(data.allFile.nodes[0].publicURL)
  // }

  // const setup = (p, canvasParentRef) => {
  //   p.createCanvas(400, 300).parent(canvasParentRef) // use parent to render canvas in this ref (without that p render this canvas outside your component)
  //   video = p.createvideo(p.VIDEO)
  //   video.size(videoWidth, videoHeight)
  //   video.hide()

  //   let count = p.int(videoWidth * videoHeight)
  //   letters = new Array(256)

  //   for (let i = 0; i < 256; i++) {
  //     let index = p.int(p.map(i, 0, 256, 0, letterOrder.length))
  //     letters[i] = letterOrder.charAt(index)
  //   }

  //   bright = new Array(count)

  //   for (let i = 0; i < count; i++) {
  //     bright[i] = 128
  //   }

  //   p.textFont(font, fontSize)
  //   p.fill(0)
  // }

  // const draw = p => {
  //   p.background(255)

  //   // p.image(video,0,0)
  //   p.push()
  //   let hgap = p.width / videoWidth
  //   let vgap = p.height / videoHeight

  //   p.scale(p.max([hgap, vgap]) * fontSize)

  //   let index = 0
  //   video.loadPixels()

  //   for (let y = 1; y < video.height; y++) {
  //   //   //   // Move down for next line
  //     p.translate(0, 1.0 / fontSize)

  //     p.push()
  //     for (let x = 0; x < video.width; x++) {
  //       let pixelColor = video.pixels[index]
  //   //     //     // Faster method of calculating r, g, b than red(), green(), blue()
  //       let r = (pixelColor >> 16) & 0xff
  //       let g = (pixelColor >> 8) & 0xff
  //       let b = pixelColor & 0xff

  //   //     //     // Another option would be to properly calculate brightness as luminance:
  //   //     //     // luminance = 0.3*red + 0.59*green + 0.11*blue
  //   //     //     // Or you could instead red + green + blue, and make the the values[] array
  //   //     //     // 256*3 elements long instead of just 256.
  //       let pixelBright = 0.3 * r + 0.59 * g + 0.11 * b

  //   //     //     // The 0.1 value is used to damp the changes so that letters flicker less
  //       let diff = pixelBright - bright[index]
  //       bright[index] += diff * 0.1

  //       let num = p.int(bright[index])
  //       p.text(letters[num], 0, 0)
  //       // p.text("#",0,0)

  //   //     //     // Move to the next pixel
  //       index++

  //   //     //     // Move over for next character
  //       p.translate(1.0 / fontSize, 0)
  //     }
  //     p.pop()
  //   }
  //   p.pop()
  //   // p.noLoop()
  // }

  // let canvas
  // const characters =
  //   " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLunT#JCwfy325Fp6mqSghVd4EgXgraphicsZbYkOA&8U$@KHDBWNMR0Q"
  // let video
  // let graphics
  // let font
  // const fontSize = 8.0
  // const videoWidth = 80
  // const videoHeight = 60
  // const w = 400
  // const h = 400

  // const preload = p => {
  //   font = p.loadFont(data.allFile.nodes[0].publicURL)
  // }

  // const setup = (p, canvasParentRef) => {
  //   canvas = p.createCanvas(w, h).parent(canvasParentRef)
  //   graphics = p.createGraphics(videoWidth, videoHeight)
  //   video = p.createCapture(p.VIDEO)
  //   video.hide()

  //   p.textFont(font, fontSize)
  // }

  // const draw = p => {
  //   graphics.image(video, 0, 0, videoWidth, videoHeight)

  //   p.background(255)
  //   p.fill(0)

  //   for (let i = 0; i < videoHeight; i++) {
  //     for (let j = 0; j < videoWidth; j++) {
  //       let pixel = graphics.get(p.round(j * 1.143), i * 2)
  //       let f = 1 - pixel[0] / 255.0
  //       f = f * f //square factor to lighten up, because less bright characters
  //       let bright = p.round(f * 40)
  //       let index = p.floor(p.random(characters[bright].length))
  //       // let chr = ;
  //       p.fill(pixel)
  //       p.text(characters[bright], j * 5.7, i * 11)
  //     }
  //   }
  // }

  let resolution = 3
  let fontSize = 11.0
  let fraction = 4
  let video,font,graphics
  // let letters = "@@@MMMBBBHHEEENNNRR###KKKWWXXXDDDFFFPPQQQAAASSUUUZZZbbdddeeehhxxx***888GGmmm&&&00444LLLOOVVVYYYkkkppqqq555TTaaagggnnsss66699ooowwwzzz$$CCCIIIuu222333JJcccfffrryyy%%%111vv777lll++iiittt[[]]]   {{{}}???jjj||((()))==~~~!!!--///<<<>>>\"\"^^^___'';;;,,,::```... "
  // let letters =
  //   " ...```::,,,;;;''___^^^\"\">>><<<///--!!!~~~==)))(((||jjj???}}{{{]]][[tttiii++lll777vv111%%%yyyrrfffcccJJ333222uuIIICCC$$zzzwwwooo99666sssnngggaaaTT555qqqppkkkYYYVVVOOLLL44400&&&mmmGG888***xxxhheeedddbbZZZUUUSSAAAQQQPPFFFDDDXXXWWKKK###RRNNNEEEHHBBBMMM@@@"
  let letters = "................................::::::::::::::::::::::::::::::::********************************oooooooooooooooooooooooooooooooo&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&88888888888888888888888888888888@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@################################"
  // let letters = ".:*o&8@#"
  let showVideo = false,
    aspectRatio = true,
    trueColor = true,
    frames = true
  const w = 630,
    h = 3 * w / 4
  let captureWidth = w / fraction
  let captureHeight = h / fraction

  const wRatio = w / captureWidth,
    hRatio = h / captureHeight

  const preload = p => {
    font = p.loadFont(data.allFile.nodes[0].publicURL)
  }

  const setup = (p, canvasParentRef) => {
    p.disableFriendlyErrors = true;
    p.createCanvas(w, h*2).parent(canvasParentRef)
    graphics = p.createGraphics(captureWidth, captureHeight)

    video = p.createCapture(p.VIDEO)
    video.hide()
  }

  const draw = p => {
    p.textFont(font, fontSize)
    p.background(0)
    p.image(video,0,h,w,h)
    graphics.image(video, 0, 0, captureWidth, captureHeight)
    video.loadPixels()
    for (let y = 0; y < captureHeight; y += resolution) {
      for (let x = 0; x < captureWidth; x += resolution) {
        // let pixel = graphics.get(x, y)
        let index = (x + y * video.width) * (resolution*4)
        let r = video.pixels[index + 0]
        let g = video.pixels[index + 1]
        let b = video.pixels[index + 2]

        // let r = p.red(pixel)
        // let g = p.green(pixel)
        // let b = p.blue(pixel)

        // let r = (pixel >> 16) & 1
        // let g = (pixel >> 8) & 1
        // let b = pixel & 1

        let brightness = p.max([r, g, b])
        // let brightness = 0.3 * r + 0.59 * g + 0.11 * b

        if (trueColor) p.fill(r,g,b)
        else p.fill(brightness)

        // if(aspectRatio) p.text(letters[p.int(p.brightness(pixel))], x*wRatio,y*hRatio)
        // else p.text(letters[p.int(p.brightness(pixel))], x,y)
        // if (letters[p.int(brightness)] != null) {
          if (aspectRatio) p.text(letters[p.int(brightness)], x * wRatio, y * hRatio)
          else p.text(letters[p.int(brightness)], x, y)
        // }
      }
    }

    if (showVideo) {
      p.image(video, 0, 0, p.width, p.height)
    }

    if (frames) {
      p.push()
      p.fill("#22B455")
      p.textAlign(p.LEFT, p.TOP)
      p.textSize(20)
      p.text(p.round(p.frameRate()),3,3)
      p.pop()
    }
  }

  const keyTyped = p => {
    let key = p.key

    if (key === "v") {
      showVideo = !showVideo
    }

    if (key === "a") {
      aspectRatio = !aspectRatio
    }

    if (key === "c") {
      trueColor = !trueColor
    }

    if (key === "f") {
      frames = !frames
    }

    if (key === "r") {
      if (resolution > 2) resolution--
      if (fontSize > 8.0) fontSize -= 1.0
    }

    if (key === "R") {
      resolution++
      fontSize += 1.0
    }

    if (key === "s") {
      p.noLoop()
    }

    if (key === "S") {
      p.loop()
    }
  }

  return (
    <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped} />
  )
}

export default AsciiSketch
