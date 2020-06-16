import { useStaticQuery, graphql } from "gatsby"
import React from 'react'

const Sketch = typeof window !== `undefined` ? require("react-p5") : null

const ShaderSketch = () => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "shaders" }, name: { eq: "ascii2" } }
        sort: { fields: extension, order: DESC }
      ) {
        nodes {
          publicURL
        }
      }
    }
  `)

  const minW = 630
  let w = minW
  let h = 3 * (w/4)

  let shader
  let graphics
  let video
  let click = false, monotone = false;

  const preload = p => {
    shader = p.loadShader(
      data.allFile.nodes[0].publicURL,
      data.allFile.nodes[1].publicURL
    )
  }

  const setup = (p, canvasParentRef) => {
    if(p.windowWidth < minW){
      w = p.windowWidth - 40
      h = 3 * (w/4)
    }

    p.createCanvas(w, h * 2).parent(canvasParentRef)
    video = p.createCapture(p.VIDEO)
    video.hide()

    // Init graphics 
    graphics = p.createGraphics(w, h, p.WEBGL)
    console.log(graphics.drawContext)
  }

  const draw = p => {
    // Shader setup
    graphics.shader(shader)

    // Uniforms setup
    shader.setUniform("iResolution", [w, h]);
    shader.setUniform("iChannel0", video);
    shader.setUniform("iMouse", click);
    shader.setUniform("monotone", monotone);
    
    // Add video to graphics and canvas
    graphics.image(video, 0, 0)
    p.image(video,0,h,w,h)

    if(click || monotone) p.filter(p.GRAY);

    // Flip video for proper visualization
    graphics.translate(0,h)
    p.scale(1.0,-1.0); 

    // This is just a geometry needed to visualize the shader output
    graphics.rect(0, 0, w, h)

    // Show shader output on canvas
    p.image(graphics, 0,-h)
  }

  // Toggle color from image
  const keyTyped = p => {
    let key = p.key

    if (key === "c") {
      click = !click
    }

    if (key === "m") {
      monotone = !monotone
    }
  }

  return <Sketch preload={preload} setup={setup} draw={draw} keyTyped={keyTyped}/>
}

export default ShaderSketch