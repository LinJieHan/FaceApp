import * as THREE from "three";

export default class CameraController {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: any;

  constructor(canvas: any) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    this.camera.position.z = 500;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    window.addEventListener("resize", this.windowResized, false);
  }

  windowResized = () => {
    if (this.camera != null) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    );
  };

  render = (scene: THREE.Scene) => {
    this.renderer.render(scene, this.camera);
  };
}
