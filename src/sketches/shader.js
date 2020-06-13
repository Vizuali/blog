const React = require("react")
const Sketch = typeof window !== `undefined` ? require("react-p5") : null;
const { useStaticQuery, graphql } = require("gatsby")

const ShaderSketch = () => {
  const w = 100
  const h = 100
  const data = useStaticQuery(graphql`
  {
    allFile(filter: {sourceInstanceName: {eq: "shaders"}, name: {eq: "color"}}, sort: {fields: extension, order: DESC}) {
      nodes {
        publicURL
      }
    }
  }  
  `)

  let img;
  let shader; 
  let canvas;
  let graphics;

  const preload = p => {
    img = p.loadImage(
      "https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp"
    )
    // shader = p.loadShader('https://aferriss.github.io/p5jsShaderExamples/2_texture-coordinates/2-1_basic/texcoord.vert','https://aferriss.github.io/p5jsShaderExamples/2_texture-coordinates/2-1_basic/texcoord.frag');
    shader = p.loadShader(data.allFile.nodes[0].publicURL,data.allFile.nodes[1].publicURL);
  }

  const setup = (p, canvasParentRef) => {
    canvas = p.createCanvas(w*2,h).parent(canvasParentRef); 
    // p.pixelDensity(1);

    graphics = p.createGraphics(w,h,p.WEBGL)
    // graphics.imageMode(p.CENTER);
  }

  const draw = p => {
    graphics.shader(shader)
    graphics.rect(0,0,w,h)

    p.image(graphics,0,0)
    p.image(img,w,0,w,h)
  }

  return <Sketch preload={preload} setup={setup} draw={draw} />
}

export default ShaderSketch;