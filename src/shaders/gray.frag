precision mediump float;

// grab texcoords from the vertex shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform bool isRgbAvg;
uniform bool isRgbMax;
uniform bool isRgbMid;
uniform bool isLuma601;
uniform bool isLuma240;
uniform bool isLuma709;
uniform bool isLuma2020;

// this is a common glsl function of unknown origin to convert rgb colors to luminance
// it performs a dot product of the input color against some known values that account for our eyes perception of brighness
// i pulled this one from here https://github.com/hughsk/glsl-luma/blob/master/index.glsl
float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;

  // get the webcam as a vec4 using texture2D
  vec4 tex = texture2D(tex0, uv);

  // convert the texture to grayscale by using the luma function  
  float gray;

  if(isRgbAvg){
    float avg = 1.0 / (tex.r + tex.g + tex.b);
    gray = dot(tex.rgb, vec3(avg,avg,avg));
  }else if(isRgbMax){
    float M = max(max(tex.r, tex.g),tex.b);
    gray = dot(tex.rgb, vec3(M,M,M));
  }else if(isRgbMid){
    float m = min((tex.r, tex.g),tex.b);
    float M = max(max(tex.r, tex.g),tex.b);
    float mid = (M+m)/2.0;
    gray = dot(tex.rgb, vec3(mid,mid,mid));
  }else if(isLuma601){
    gray = dot(tex.rgb, vec3(0.2989,0.5870,0.1140));
  }else if(isLuma240){
    gray = dot(tex.rgb, vec3(0.212,0.701,0.087));
  }else if(isLuma709){
    gray = dot(tex.rgb, vec3(0.2126,0.7152,0.0722));
  }else{
    gray = dot(tex.rgb, vec3(0.2627,0.6780,0.0593));
  }

  // output the grayscale value in all three rgb color channels
  gl_FragColor = vec4(gray, gray, gray, 1.0);
}