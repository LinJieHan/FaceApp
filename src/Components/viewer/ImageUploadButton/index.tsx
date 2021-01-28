import React from "react";
import store from "store";
import actions from "store/actions";
import * as THREE from "three";

type State = {
  file: string;
  imagePreviewUrl: string | ArrayBuffer | null;
};
type Props = {
  updateImage: Function;
};
export default class ImageUploadButton extends React.Component<Props, State> {
  buttonCss: {};

  constructor(props: any) {
    super(props);
    this.state = { file: "", imagePreviewUrl: "" };
    this.buttonCss = {
      position: "relative",
      top: "0",
      left: "0",
      zindex: "100",
    };
  }

  _handleImageChange(e: any) {
    e.preventDefault();
    if (e.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    const file = e.target.files[0];
    const textureLoader = new THREE.TextureLoader();

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
      if (reader.result !== null) {
        const image = new Image();
        const base64Image: string = reader.result.toString();
        image.onload = () => {
          const texture = textureLoader.load(base64Image);
          const info = { width: 0, height: 0, src: "" };
          info.width = image.width;
          info.height = image.height;
          info.src = base64Image;
          store.dispatch(actions.setTexture(texture));
          store.dispatch(actions.setImage(image));
          this.props.updateImage(image.width, image.height, image);
        };
        image.src = base64Image;
      }
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="ImageUpload" style={this.buttonCss}>
        <form>
          <input
            accept="image/*"
            className="fileInput"
            type="file"
            onChange={(e) => this._handleImageChange(e)}
          />
        </form>
      </div>
    );
  }
}
