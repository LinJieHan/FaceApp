import * as THREE from "three";
import RenderOrder from "Three/MeshViewer/renderOrder";
import ImagePlane from "Three/MeshViewer/Carrier/ImagePlane"
import OpenMesh from "OpenMesh"
import TriMesh from "OpenMesh/Mesh/TriMeshT";
import { Vector2, Vector3 } from "three";

const openMesh = new OpenMesh();
const OBJExporter = require('three-obj-exporter');
const exporter = new OBJExporter();
let self: MeshEditor;
const ioManager = openMesh.ioManager;
const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// let LeftEyesVertices : number[] = [11,37,134,148,149,157,158,161,162,163,164,165,167,177,250];
let LeftEyesVertices : number[] = [11,26,27,28,29,30,31,32,33,34,37,60,114,116,117,134,137,148,149,157,158,159,161,162,163,164,165,167,177,194,225,230,236,237,247,250,251];

function pointInTriangle(point: THREE.Vector3, v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3) {
  let d1, d2, d3;
  let has_neg, has_pos;
  d1 = sign(point, v1, v2);
  d2 = sign(point, v2, v3);
  d3 = sign(point, v3, v1);

  has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(has_neg && has_pos);

}
function sign(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
export default class MeshEditor {
  mesh: THREE.Mesh;
  camera: THREE.Camera;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  intersects: any[] = [];
  isDragging = false;
  currentIndex: number | null;
  planePoint = new THREE.Vector3();
  planeNormal = new THREE.Vector3();
  plane = new THREE.Plane();
  controlPoints = new THREE.Group();
  _enabled = false;
  controlPointSize: number;
  currentPoint: THREE.Mesh;
  triMesh: TriMesh;
  currentPointOneRing: THREE.Mesh[] = [];
  selectMode: boolean = false;
  basePlane: THREE.Mesh;
  currentFace: any;
  LeftEyeScale: number = 0;
  LeftEyeOffset: Vector2[];
  constructor(imagePlane: ImagePlane, camera: THREE.Camera, controlPointSize: number) {
    this.basePlane = imagePlane.basePlaneMesh;
    this.mesh = imagePlane.delaunayMesh;
    this.camera = camera;
    this.currentIndex = null;
    this.controlPoints.renderOrder = RenderOrder.controlPoints;
    this.controlPointSize = controlPointSize;
    this.enable = false;
	this.LeftEyeScale = 0;
    self = this;
	this.LeftEyeOffset = null;
    this.attachPointerEvent();
    this.createControlPoints();

  }

  loadOpenMesh() {
    return new Promise<void>(async resolve => {
      const objFile = exporter.parse(this.mesh);
      this.triMesh = await ioManager.read(objFile, new TriMesh());
      console.log(this.triMesh)
      resolve()
    })
  }

  set enable(option: boolean) {
    this._enabled = option;
    if (option === false) {
      this.detachPointerEvent();
      this.controlPoints.visible = false;
    } else if (option === true) {
      this.attachPointerEvent();
      this.controlPoints.visible = true;
    }
  }
  openMeshDemo(e) {
    if (e.key === "e" || e.key === "E") {
      if (self.selectMode) {
        self.findOneRingVertices();
      } else {
        self.findOneRingFaces();
      }
    } else if (e.key === "q" || e.key === "Q") {
      self.selectMode = !self.selectMode;
      self.clearMarks();
      console.log(self.selectMode)
    } else if (e.key === "w" || e.key === "W")
    {
		this.LeftEyeScale = 0.02;
      	self.FindLeftEyesVertices();
    }else if (e.key === "s" || e.key === "S")
    {
		this.LeftEyeScale = -0.02;
      	self.FindLeftEyesVertices();
    }
  }
  async FindLeftEyesVertices()
  {
	let xtotal: number = 0;
	let ytotal: number = 0;
	let ztotal: number = 0;
	let First: boolean = false;
	if(this.LeftEyeOffset == null)
	{
		First = true;
		this.LeftEyeOffset = []
	}
    for (let v_it = self.triMesh.vertices_begin(); v_it.idx() !== self.triMesh.vertices_end().idx(); v_it.next()) {
      const vhandle = v_it.handle();
      let mesh = self.controlPoints.children[vhandle.idx()] as THREE.Mesh;
      for(let i = 0; i < LeftEyesVertices.length; i++)
      {
        if(LeftEyesVertices[i] === vhandle.idx())
        {
          //self.currentPointOneRing.push(mesh)
          mesh.material = greenMat;
		  //console.log(mesh.position);
		  xtotal+= mesh.position.x;
		  ytotal+= mesh.position.y;
			ztotal+= mesh.position.z;
        }
      }
    }
	const geometry = new THREE.PlaneBufferGeometry(this.controlPointSize, this.controlPointSize);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const midpoint = new THREE.Mesh(geometry, material);
    midpoint.position.set(xtotal / LeftEyesVertices.length, ytotal / LeftEyesVertices.length, ztotal / LeftEyesVertices.length);
    this.controlPoints.add(midpoint);
    midpoint.userData.index = 468;
	for (let v_it = self.triMesh.vertices_begin(); v_it.idx() !== self.triMesh.vertices_end().idx(); v_it.next()) {
		const vhandle = v_it.handle();
		let mesh3 = self.controlPoints.children[vhandle.idx()] as THREE.Mesh;
		for(let i = 0; i < LeftEyesVertices.length; i++)
		{
		  if(LeftEyesVertices[i] === vhandle.idx())
		  {
			//self.currentPointOneRing.push(mesh3)
			mesh3.material = greenMat;
			let MidtoVertex_x :number = mesh3.position.x - midpoint.position.x;
			let MidtoVertex_y :number = mesh3.position.y - midpoint.position.y;
			if(First === true)
			{
				this.LeftEyeOffset.push(new Vector2(MidtoVertex_x,MidtoVertex_y));
			}
			self.currentIndex = vhandle.idx();
			if (
				self.mesh.geometry instanceof THREE.BufferGeometry &&
				self.currentIndex !== null
			  ) {
				//update mesh
				console.log(this.LeftEyeScale);
				self.mesh.geometry.attributes.position.setXY(
				  self.currentIndex,
				  self.planePoint.x +midpoint.position.x+ this.LeftEyeOffset[i].x * (this.LeftEyeScale + 1),
				  self.planePoint.y +midpoint.position.y+ this.LeftEyeOffset[i].y * (this.LeftEyeScale + 1)
				);
				//update control point position
				self.controlPoints.children[self.currentIndex].position.set(
				  self.planePoint.x +midpoint.position.x+ this.LeftEyeOffset[i].x * (this.LeftEyeScale + 1),	
				  self.planePoint.y +midpoint.position.y+ this.LeftEyeOffset[i].y * (this.LeftEyeScale + 1),
				  0
				);
				//console.log(this.LeftEyeOffset[i]);
				self.mesh.geometry.attributes.position.needsUpdate = true;
			  }
		  }
		}
		self.currentIndex = null;
		//this.LeftEyeScale = 0;
	  }
  }
  async findOneRingVertices() {

    if (self.currentPoint !== undefined) {
      self.currentPointOneRing.push(self.currentPoint);
      const currentPointPos = self.currentPoint.position;
      for (let v_it = self.triMesh.vertices_begin(); v_it.idx() !== self.triMesh.vertices_end().idx(); v_it.next()) {
        const point = self.triMesh.point(v_it.handle());
        if (point.x === currentPointPos.x && point.y === currentPointPos.y && point.z === currentPointPos.z) {
          for (let vv_cwiter = self.triMesh.vv_cwbegin(v_it.handle()); vv_cwiter.is_valid(); await vv_cwiter.next()) {
            const vhandle = vv_cwiter.handle();
            let mesh = self.controlPoints.children[vhandle.idx()] as THREE.Mesh;
            self.currentPointOneRing.push(mesh)
            mesh.material = greenMat;
          }
        }
      }
    }
  }
  async findOneRingFaces() {
    if (this.currentFace !== undefined) {
      for (let ff_iter = self.triMesh.ff_cwiter(this.currentFace); ff_iter.is_valid(); await ff_iter.next()) {
        for (let fv_iter = self.triMesh.fv_cwiter(ff_iter.handle()); fv_iter.is_valid(); await fv_iter.next()) {
          const index = fv_iter.handle().idx();
          let meshes = this.controlPoints.children as THREE.Mesh[];
          this.currentPointOneRing.push(meshes[index]);
          meshes[index].material = greenMat;
        }
      }
    }
  }

  createControlPoints() {
    const geometry = new THREE.PlaneBufferGeometry(this.controlPointSize, this.controlPointSize);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    let position;
    if (this.mesh.geometry instanceof THREE.BufferGeometry) {
      position = this.mesh.geometry.getAttribute("position").array;
      for (let i = 0; i < position.length; i += 3) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[i], position[i + 1], position[i + 2]);
        this.controlPoints.add(mesh);
        mesh.userData.index = i;
        if (i >= 3) {
          mesh.userData.index = i / 3;
        }
      }
    }
  }

  updateControlPoints() {
    for (let i = this.controlPoints.children.length - 1; i >= 0; i--) {
      this.controlPoints.remove(this.controlPoints.children[i]);
    }
    this.createControlPoints();
  }
  clearMarks() {
    this.currentPointOneRing.forEach(mesh => {
      mesh.material = redMat;
    })
    this.currentPointOneRing = []
    this.currentFace = undefined;
    this.currentPoint = undefined;
  }
  onPointerDown(event: any) {
    self.setRaycaster(event);
    if (self.selectMode) {
      self.getIndex();
    } else {
      self.getFace();
    }
    self.isDragging = true;
  }
  async getFace() {

    const intersects = self.raycaster.intersectObject(this.basePlane, true);
    if (this.currentFace !== undefined) {
      self.clearMarks();
    }
    if (intersects.length > 0) {
      const point = intersects[0].point;
      for (let f_iter = self.triMesh.faces_begin(); f_iter.idx() !== self.triMesh.faces_end().idx(); f_iter.next()) {
        let v1, v2, v3
        let fv_iter = self.triMesh.fv_cwiter(f_iter.handle());

        let temp = self.triMesh.point(fv_iter.handle());
        let temp1 = new THREE.Vector3(temp.x, temp.y, temp.z);
        v1 = fv_iter.handle().idx();
        await fv_iter.next();

        temp = self.triMesh.point(fv_iter.handle());
        let temp2 = new THREE.Vector3(temp.x, temp.y, temp.z);
        v2 = fv_iter.handle().idx();
        await fv_iter.next();

        temp = self.triMesh.point(fv_iter.handle());
        let temp3 = new THREE.Vector3(temp.x, temp.y, temp.z);
        v3 = fv_iter.handle().idx();

        let intri = pointInTriangle(point, temp1, temp2, temp3)
        if (intri) {
          let meshes = this.controlPoints.children as THREE.Mesh[];
          meshes[v1].material = greenMat;
          meshes[v2].material = greenMat;
          meshes[v3].material = greenMat;
          this.currentPointOneRing.push(meshes[v1], meshes[v2], meshes[v3])
          this.currentFace = f_iter.handle();
          return;
        }
      }
    }
  }
  onPointerMove(event: any) {
    if (self.isDragging) {
      self.setRaycaster(event);
      self.raycaster.ray.intersectPlane(self.plane, self.planePoint);
      if (
        self.mesh.geometry instanceof THREE.BufferGeometry &&
        self.currentIndex !== null
      ) {
        //update mesh
        console.log(self.currentIndex);
        self.mesh.geometry.attributes.position.setXY(
          self.currentIndex,
          self.planePoint.x,
          self.planePoint.y
        );
        //update control point position
        self.controlPoints.children[self.currentIndex].position.set(
          self.planePoint.x,
          self.planePoint.y,
          0
        );
        self.mesh.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  onPointerUp() {
    self.isDragging = false;
    self.currentIndex = null;
  }

  getIndex() {
    this.intersects = this.raycaster.intersectObjects(
      this.controlPoints.children
    );
    if (this.currentPoint !== undefined) {
      self.clearMarks();
    }
    if (this.intersects.length > 0) {
    } else {
      this.currentIndex = null;
      return;
    }
    const controlPointIndex = this.intersects[0].object.userData.index;
    if (controlPointIndex !== null) {
		console.log(controlPointIndex);
      this.currentIndex = controlPointIndex;
      this.currentPoint = this.intersects[0].object;
      this.currentPoint.material = greenMat
      this.setPlane(this.intersects[0].point);
    }
  }

  setPlane(point: any) {
    this.planeNormal.subVectors(this.camera.position, point).normalize();
    this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, point);
  }

  setRaycaster(event: any) {
    this.getMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  getMouse(event: any) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  attachPointerEvent() {
    document.addEventListener("pointerdown", this.onPointerDown, false);
    document.addEventListener("pointermove", this.onPointerMove, false);
    document.addEventListener("pointerup", this.onPointerUp, false);
    window.addEventListener("keydown", this.openMeshDemo);
  }

  detachPointerEvent() {
    document.removeEventListener("pointerdown", this.onPointerDown, false);
    document.removeEventListener("pointermove", this.onPointerMove, false);
    document.removeEventListener("pointerup", this.onPointerUp, false);
  }
}
