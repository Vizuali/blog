#version 300 es
// This is a port of "Ascii Art " by movAX13h
// https://www.shadertoy.com/view/lssGDj

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform bool iMouse;
uniform bool monotone;

out vec4 outputColor;

float character(int n, vec2 p){
  // The point is considered by every 4 pixels
  // Streches p to -4 to 4 (y is flipped here too) and shifts it by 2.5 diagonally so that letters are not cut on screen 
  // (see character alignment at bottom left of canvas). Note that the characters are 5x5 excluding the space around them.
	p = floor(p * vec2(4.0, -4.0) + 2.5);

  // This if makes sure that the coordinates ranges between 0.0 - 4.0
  if (clamp(p.x, 0.0, 4.0) == p.x){
    if (clamp(p.y, 0.0, 4.0) == p.y){
      
      // This will help us to select by given 8 characters
      int a = int(floor(p.x) + 5.0 * floor(p.y));

      // Original code would do this
      // But it's not doable with WEBGL 1.0
      if (((n >> a) & 1) == 1) return 1.0;

      // So this is the alternative implementation
      // We trim the bitmap interpretation
      // And check if its less significan bit is 1
      // In that case, we return 1.0
      // n = n/int(exp2(float(a)));
      // n = int(mod(float(n),2.0));
      // if (n == 0) return 1.0;
    }	
  }
	return 0.0;
}

void main(){
	vec2 pix = gl_FragCoord.xy;

  // texture2D returns a texel, or color for a given coordinate
	vec3 col = texture(iChannel0, floor(pix / 8.0) * 8.0 / iResolution.xy).rgb;	
	
  // Calculate of luminance given rgb values
	float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
	
  // More information about this bitmap representation on: http://www.thrill-project.com/archiv/coding/bitmap/
	int n =  4096;                // .
	if (gray > 0.2) n = 65600;    // :
	if (gray > 0.3) n = 332772;   // *
	if (gray > 0.4) n = 15255086; // o 
	if (gray > 0.5) n = 23385164; // &
	if (gray > 0.6) n = 15252014; // 8
	if (gray > 0.7) n = 13199452; // @
	if (gray > 0.8) n = 11512810; // #
	
  // Normalize p into the range -1 - 1. 
	vec2 p = mod(pix / 4.0, 2.0) - vec2(1.0);

  // If a color-agnostic representation is desired
  
  if (iMouse) col = gray * vec3(character(n, p));
  else if(monotone) col = vec3(1.0,1.0,1.0)*character(n, -p);
  else col = col*character(n, -p);

  // Return fragment
	outputColor = vec4(col, 1.0);
}