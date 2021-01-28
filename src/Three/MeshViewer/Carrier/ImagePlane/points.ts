import * as THREE from "three";
import Shader from "Three/MeshViewer/Shader";

function updatePoints(
  points: THREE.Points,
  position: THREE.InterleavedBufferAttribute | THREE.BufferAttribute
) {
  const sizes = [];
  for (let i = 0, l = position.array.length / 3; i < l; i++) {
    sizes.push(0.2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", position);
  geometry.setAttribute(
    "size",
    new THREE.BufferAttribute(Float32Array.from(sizes), 1)
  );
  const shader = new Shader.PointsShader();
  const material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
  });
  points.geometry = geometry;
  points.material = material;
}

function createPoints(points: THREE.Points, coords: any[]) {
  const pointSize = 5;
  // const sizes = [];
  const points3d = [];
  for (let i = 0, l = coords.length; i < l; i += 3) {
    points3d.push(new THREE.Vector3(coords[i], coords[i + 1], coords[i + 2]));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points3d);
  // geometry.setAttribute(
  //   "position",
  //   new THREE.BufferAttribute(Float32Array.from(coords), 3)
  // );
  // geometry.setAttribute(
  //   "size",
  //   new THREE.BufferAttribute(Float32Array.from(sizes), 1)
  // );
  // const shader = new Shader.PointsShader();
  // const material = new THREE.ShaderMaterial({
  //   fragmentShader: shader.fragmentShader,
  //   vertexShader: shader.vertexShader,
  //   uniforms: shader.uniforms,
  // });

  const old_geo = points.geometry;
  points.geometry = geometry;
  old_geo.dispose();
  // points.material = material;
}
export { updatePoints, createPoints };
