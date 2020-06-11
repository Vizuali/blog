const React = require("react")
const { Component } = React
const Sketch = typeof window !== `undefined` ? require("react-p5") : null


class ShaderSketch extends Component {
  w = 100
  h = 100

  preload = p => {
    this.img = p.loadImage(
      "https://4.bp.blogspot.com/-mLOwpEsNL4Y/UCu0wcVsPBI/AAAAAAAAA6s/7ECKTpxXr3o/s1600/lena.bmp"
    )
    this.shader = p.loadShader('https://aferriss.github.io/p5jsShaderExamples/2_texture-coordinates/2-1_basic/texcoord.vert','https://aferriss.github.io/p5jsShaderExamples/2_texture-coordinates/2-1_basic/texcoord.frag');
  }

  setup = (p, canvasParentRef) => {
    this.cvn = p.createCanvas(this.w*2,this.h).parent(canvasParentRef); 
    // p.pixelDensity(1);

    this.graphics = p.createGraphics(this.w,this.h,p.WEBGL)
    // this.graphics.imageMode(p.CENTER);
  }

  draw = p => {
    this.graphics.shader(this.shader)
    this.graphics.rect(0,0,this.w,this.h)


    p.image(this.graphics,0,0)
    p.image(this.img,this.w,0,this.w,this.h)
  }

  render() {
    return <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
  }
}

export default ShaderSketch;