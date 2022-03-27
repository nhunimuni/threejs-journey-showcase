varying vec3 vColor;

void main() {
  // Sadly, we cannot send the UV from the vertex shader to the fragment shader. 
  // The vertex shader controls each particle position and a square plane facing the camera appears in place of the vertex
  // We already have access to the UV in the fragment shader with gl_PointCoord. 
  // This variable is specific to the particles.
  // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

  // Disc pattern
  // Distance gl_PointCoord to the center of the particle plane
  /* float strength = distance(gl_PointCoord, vec2(0.5));
  // If strength is below 0.5 return 0.0, if above return 1.0
  strength = step(0.5, strength);
  // Invert the value
  strength = 1.0 - strength;
  gl_FragColor = vec4(vec3(strength), 1.0); */

  // Diffuse point
  /* float strength = distance(gl_PointCoord, vec2(0.5));
  // Multiply by 2 so it reaches 1.0 before touching the edge of the particle plane
  strength *= 2.0;
  strength = 1.0 - strength;
  gl_FragColor = vec4(vec3(strength), 1.0); */

  // Light point
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  // Pow so that value reaches 0 faster
  strength = pow(strength, 10.0);
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // Final color
  // Mix black with the varying color
  // vec3 color = mix(vec3(0.0), vColor, strength);
  // gl_FragColor = vec4(color, 1.0);

  // OR
  // Need to turn on transparent: true on the material,
  gl_FragColor = vec4(vColor, strength);
}