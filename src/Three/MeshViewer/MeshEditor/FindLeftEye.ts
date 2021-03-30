import * as THREE from "three";
import MeshEditor from "../MeshEditor";
import { Vector2, Vector3 } from "three";

let myMeshEditior: MeshEditor;
const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// let LeftEyesVertices : number[] = [11,37,134,148,149,157,158,161,162,163,164,165,167,177,250];
let LeftEyesVertices : number[] = [11,26,27,28,29,30,31,32,33,34,37,60,114,116,117,134,137,148,149,157,158,159,161,162,163,164,165,167,177,194,225,230,236,237,247,250,251];
export default class FindLeftEye {
  LeftEyeScale: number = 0;
  LeftEyeOffset: Vector2[];
  constructor(self: MeshEditor) {
	this.LeftEyeScale = 0;
    myMeshEditior = self;
	this.LeftEyeOffset = null;
  }
  async FindLeftEyesVertices()
  {
	let xtotal: number = 0;
	let ytotal: number = 0;
	let ztotal: number = 0;
	let First: boolean = false;
	if(this.LeftEyeOffset == null)
	{
        //Initalization
		First = true;
		this.LeftEyeOffset = []
	}
    for (let v_it = myMeshEditior.triMesh.vertices_begin(); v_it.idx() !== myMeshEditior.triMesh.vertices_end().idx(); v_it.next()) {
      const vhandle = v_it.handle();
      let mesh = myMeshEditior.controlPoints.children[vhandle.idx()] as THREE.Mesh;
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
	const geometry = new THREE.PlaneBufferGeometry(myMeshEditior.controlPointSize, myMeshEditior.controlPointSize);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const midpoint = new THREE.Mesh(geometry, material);
    midpoint.position.set(xtotal / LeftEyesVertices.length, ytotal / LeftEyesVertices.length, ztotal / LeftEyesVertices.length);
    myMeshEditior.controlPoints.add(midpoint);
    midpoint.userData.index = 468;
	for (let v_it = myMeshEditior.triMesh.vertices_begin(); v_it.idx() !== myMeshEditior.triMesh.vertices_end().idx(); v_it.next()) {
		const vhandle = v_it.handle();
		let mesh3 = myMeshEditior.controlPoints.children[vhandle.idx()] as THREE.Mesh;
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
			myMeshEditior.currentIndex = vhandle.idx();
			if (
				myMeshEditior.mesh.geometry instanceof THREE.BufferGeometry &&
				myMeshEditior.currentIndex !== null
			  ) {
				//update mesh
				//console.log(myMeshEditior.planePoint);
				myMeshEditior.mesh.geometry.attributes.position.setXY(
                    myMeshEditior.currentIndex,
                    myMeshEditior.planePoint.x +midpoint.position.x+ this.LeftEyeOffset[i].x * (this.LeftEyeScale + 1),
                    myMeshEditior.planePoint.y +midpoint.position.y+ this.LeftEyeOffset[i].y * (this.LeftEyeScale + 1)
				);
				//update control point position
				myMeshEditior.controlPoints.children[myMeshEditior.currentIndex].position.set(
                    myMeshEditior.planePoint.x +midpoint.position.x+ this.LeftEyeOffset[i].x * (this.LeftEyeScale + 1),	
                    myMeshEditior.planePoint.y +midpoint.position.y+ this.LeftEyeOffset[i].y * (this.LeftEyeScale + 1),
				  0
				);
				//console.log(this.LeftEyeOffset[i]);
				myMeshEditior.mesh.geometry.attributes.position.needsUpdate = true;
			  }
		  }
		}
		myMeshEditior.currentIndex = null;
	  }
  }
}
