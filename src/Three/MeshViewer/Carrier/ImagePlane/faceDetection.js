import * as THREE from "three";

const faceLandmarksDetection = require("@tensorflow-models/face-landmarks-detection"); // Check mesh id
// If you are using the WebGL backend:
// require("@tensorflow/tfjs-backend-webgl");
// If you are using the WASM backend:
// require('@tensorflow/tfjs-backend-wasm'); // You need to require the backend explicitly because facemesh itself does not
require("@tensorflow/tfjs-backend-cpu");
let model;

async function LoadLandMarkDetectionModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.faceLandmarksDetection
  );
  console.log("loading completed");
}

async function faceDetection(image, scale) {
  let predictions;
  for (let i = 0; i < 3; i++) {
    predictions = await model.estimateFaces({
      input: image,
      flipHorizontal: false,
    });
  }
  if (predictions.length > 0) {
    const { width, height } = image;
    // return drawLandmark(predictions, width, height, scale);
    return drawScaleMesh(predictions, width, height, scale);
  }
}

function drawScaleMesh(predictions, width, height, scale) {
  const keypoints = predictions[0].scaledMesh;
  const coords = [];
  for (let i = 0; i < 468; i++) {
    const x = keypoints[i][0];
    const y = keypoints[i][1];
    coords.push((x - width / 2) * scale, (-y + height / 2) * scale, 0);
  }
  return coords;
}
// eslint-disable-next-line
function drawLandmark(predictions, width, height, scale) {
  const coords = [];
  const annotations = Object.keys(predictions[0].annotations);

  annotations.forEach((key) => {
    const coordsArr = predictions[0].annotations[key];
    for (let i = 0; i < coordsArr.length; i++) {
      const x = coordsArr[i][0];
      const y = coordsArr[i][1];
      const z = coordsArr[i][2];

      const position = new THREE.Vector4(x, y, z, 1);
      const mvm = new THREE.Matrix4();
      mvm.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      mvm.makeRotationX(THREE.MathUtils.degToRad(180));
      const newPos = position.applyMatrix4(mvm);
      coords.push(
        (newPos.x - width / 2) * scale,
        (newPos.y + height / 2) * scale,
        0
      );
    }
  });

  return coords;
}
export { faceDetection, LoadLandMarkDetectionModel };
