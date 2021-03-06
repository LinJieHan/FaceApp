import * as THREE from "three";
import CameraController from "./Camera";
import ImagePlane from "./Carrier/ImagePlane";
import MeshEditor from "./MeshEditor";
import * as dat from "dat-gui";


export default class MeshViewer {
  scene: THREE.Scene;
  cameraController: CameraController;
  basePlane: THREE.Mesh | undefined;
  wireFrame: THREE.Line | undefined;
  facePoint: THREE.Points | undefined;
  delaunayMesh: THREE.Mesh | undefined;
  isAdded: boolean;
  gui: dat.GUI;
  meshEditor: MeshEditor | undefined;


  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.cameraController = new CameraController(canvas);
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    this.basePlane = new THREE.Mesh(geometry, material);
    this.scene.add(this.basePlane);
    this.gui = new dat.GUI();
    this.isAdded = false;
    const self = this;
    const animate = function () {
      requestAnimationFrame(animate);
      self.cameraController.render(self.scene);
    };
    animate();
  }

  setMeshEditor(option: boolean) {
    if (this.meshEditor !== undefined) {
      this.meshEditor.enable = option;
    }
  }

  async updatePlane(imagePlane: ImagePlane) {
    if (this.basePlane !== undefined) {
      this.scene.remove(this.basePlane);
    }
    this.basePlane = imagePlane.basePlaneMesh;
    this.scene.add(this.basePlane);
    if (this.meshEditor !== undefined) {
      this.meshEditor.updateControlPoints();
      await this.meshEditor.loadOpenMesh();
    }
    if (!this.isAdded) {
      const controlPointSize = imagePlane.height * imagePlane.width * 0.000012;
      this.meshEditor = new MeshEditor(
        imagePlane,
        this.cameraController.camera,
        controlPointSize,
      );
      await this.meshEditor.loadOpenMesh();
      this.scene.add(this.meshEditor.mesh)
      this.scene.add(this.meshEditor.controlPoints);
      this.isAdded = true;
      this.setEyeSizeGUI();
    }
  }

  setEyeSizeGUI(){
    const modelScale = {
      scale: 1
    }
    const slider_Left = this.gui.add(modelScale, 'scale', -5, 10);
    slider_Left.onChange(async value => {
      console.log(this.meshEditor.LeftEyeEditor.LeftEyeScale);
      if(value > 10) 
      {
        value = 10;
      }
      else if(value < -10)
      {
        value = -10;
      }
      else
      {
        this.meshEditor.LeftEyeEditor.LeftEyeScale = value * 0.02;
        this.meshEditor.LeftEyeEditor.FindLeftEyesVertices();
      }
    });
  }
}
