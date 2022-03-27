uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  /**
    * Position
    */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // Rotate
  // https://thebookofshaders.com/glossary/?search=atan
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // Randomness
  // With this the result should look much better and the ribbon shape should be gone.
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  /**
    * Size
    */
  // Determine pixel ratio: window.devicePixelRatio = 1
  // If you have a screen with a pixel ratio of 1, the particles will look 2 times bigger than if you had a screen with a pixel ratio of 2.
  // fragment size: 2x2, on screen size will be different according to the pixel ratio
  // How to fix that so that everyone sees the same size of particles?
  gl_PointSize = uSize * aScale;

  // To set up the prop sizeAttenuation (which was part of the PointMaterial)
  // Have a look at the PointMataterial vertex glsl file in three file
  // /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js 
  // gl_PointSize *= ( scale / - mvPosition.z )
  // Scale defines the render height in relation to the particle size (will be streched etc)
  // mvPosition is our model view position
  gl_PointSize *= ( 1.0 / - viewPosition.z );

  vColor = color;
}