import React from "react";
import MeshViewer from "Three/MeshViewer";
import ImageUploadButton from "./ImageUploadButton";
import ObjUploadButton from "./ObjUploadButton";
import store from "store";
import ImagePlane from "Three/MeshViewer/Carrier/ImagePlane";
import { LoadLandMarkDetectionModel } from "Three/MeshViewer/Carrier/ImagePlane/faceDetection";

let imagePlane: ImagePlane;
let meshViewer: MeshViewer;
let self: Viewer;

type State = {
  showMesh: boolean;
  showPoint: boolean;
  btnText: string;
  pointBtnText: string;
  imageLoaded: boolean;
};
type Props = {};
export default class Viewer extends React.Component<Props, State> {
  canvas: any;
  canvasCss: {};
  meshDisplayCss: {};
  constructor(props: any) {
    super(props);
    this.state = {
      btnText: "Show Mesh",
      pointBtnText: "Show Point",
      showPoint: false,
      showMesh: false,
      imageLoaded: false,
    };
    this.canvasCss = {
      width: "100%",
      height: "100%",
      position: "absolute",
      bottom: "0",
    };
    this.meshDisplayCss = {
      position: "relative",
    };
    this.meshDisplayControl = this.meshDisplayControl.bind(this);
    this.pointDisplayControl = this.pointDisplayControl.bind(this);
    self = this;
  }

  pointDisplayControl() {
    const { showPoint, imageLoaded } = this.state;
    if (!imageLoaded) return;
    let text = "";
    meshViewer.setMeshEditor(!showPoint);
    if (!showPoint) {
      text = "Close Point";
    } else {
      text = "Show Point";
    }
    this.setState({ showPoint: !showPoint, pointBtnText: text });
  }

  meshDisplayControl() {
    const { showMesh, imageLoaded } = this.state;
    if (!imageLoaded) return;
    let text = "";
    imagePlane.displayWire(!showMesh);
    if (!showMesh) {
      text = "Close Mesh";
    } else {
      text = "Show Mesh";
    }
    this.setState({ showMesh: !showMesh, btnText: text });
  }

  async updateImage(width: number, height: number, image: any) {
    const { texture } = store.getState();
    imagePlane.updateGeomerty(width, height, texture, image).then(() => {
      meshViewer.updatePlane(imagePlane);
      self.setState({ imageLoaded: true });
    });
  }

  updateObj(text: string) {}

  componentDidMount() {
    LoadLandMarkDetectionModel();
    imagePlane = new ImagePlane();
    meshViewer = new MeshViewer(this.canvas);
  }

  render() {
    return (
      <div className="Main">
        <div className="viewerContainer">
          <canvas
            style={this.canvasCss}
            ref={(ref) => {
              this.canvas = ref;
            }}
            id="webGL Canvas"
          />
        </div>
        <div className="UI">
          <label>
            Upload Image
            <ImageUploadButton updateImage={this.updateImage} />
          </label>
          {/* <label>
            Upload Obj
            <ObjUploadButton updateObj={this.updateObj} />
          </label> */}
          <button
            type="button"
            style={this.meshDisplayCss}
            onClick={this.meshDisplayControl}
          >
            {this.state.btnText}
          </button>
          <button
            type="button"
            style={this.meshDisplayCss}
            onClick={this.pointDisplayControl}
          >
            {this.state.pointBtnText}
          </button>
        </div>
      </div>
    );
  }
}
