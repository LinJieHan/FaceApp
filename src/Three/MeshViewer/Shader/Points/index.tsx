import fragmentShader from "./fragmentShader";
import vertexShader from "./vertexShader";
import * as THREE from "three";

class PointsShader {
  fragmentShader: string;
  vertexShader: string;
  uniforms: {};
  constructor() {
    this.fragmentShader = fragmentShader;
    this.vertexShader = vertexShader;
    this.uniforms = {
      color: { value: new THREE.Color(0xffffff) },
    };
  }
}

export default PointsShader;
