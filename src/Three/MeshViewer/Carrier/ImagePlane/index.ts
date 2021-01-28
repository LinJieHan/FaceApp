import * as THREE from "three";
import { faceDetection } from "Three/MeshViewer/Carrier/ImagePlane/faceDetection";
import { getGeometry } from "./delaunator";
import RenderOrder from "Three/MeshViewer/renderOrder";

export default class ImagePlane {
  basePlaneMesh: THREE.Mesh;
  basePlaneMaterial: THREE.MeshBasicMaterial;
  delaunayMesh: THREE.Mesh;
  delaunayMaterial: THREE.MeshBasicMaterial;
  width: number = 0;
  height: number = 0;

  constructor() {
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this.basePlaneMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    this.basePlaneMesh = new THREE.Mesh(geometry, this.basePlaneMaterial);
    this.basePlaneMesh.renderOrder = RenderOrder.basePlane;
    this.delaunayMaterial = new THREE.MeshBasicMaterial();
    this.delaunayMesh = new THREE.Mesh(geometry, this.delaunayMaterial);
    this.delaunayMesh.name = "delaunay";
    this.delaunayMesh.renderOrder = RenderOrder.wireFrame;
  }

  displayWire(display: boolean) {
    if (display) {
      this.delaunayMaterial.wireframe = true;
      this.delaunayMaterial.color = new THREE.Color(0x00ff00);
    } else {
      this.delaunayMaterial.wireframe = false;
      this.delaunayMaterial.color = new THREE.Color(0xffffff);
    }
  }

  updateGeomerty(
    width: number,
    height: number,
    texture: THREE.Texture,
    image: any
  ) {
    const self = this;
    return new Promise(async (resolve) => {
      self.delaunayMaterial.map = texture;
      self.basePlaneMaterial.map = texture;
      const newWidth = 600;
      const scale = newWidth / width;
      const res = await faceDetection(image, scale);
      this.height = height * scale;
      this.width = newWidth;

      if (res !== undefined) {
        self.delaunayMesh.geometry = await getGeometry(res, newWidth, height * scale);
        self.basePlaneMesh.geometry = self.delaunayMesh.geometry;
        resolve(null);
      }
    });
  }
}
