export default `
uniform vec3 color;
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color, 1.0 );
}`;
