import React from "react";
import store from "store";
import actions from "store/actions";

type State = {
  file: string;
};
type Props = {
  updateObj: Function;
};
export default class ImageUploadButton extends React.Component<Props, State> {
  buttonCss: {};

  constructor(props: any) {
    super(props);
    this.state = { file: "" };
    this.buttonCss = {
      position: "relative",
      top: "0",
      left: "0",
      zindex: "100",
    };
  }

  _handleObjChange(e: any) {
    e.preventDefault();
    if (e.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.readAsText(file);
    reader.onloadend = (e) => {
      const text = e.target.result;
      this.props.updateObj(text);
    };
  }
  render() {
    return (
      <div className="ObjUpload" style={this.buttonCss}>
        <form>
          <input
            accept=".obj,.glb"
            className="fileInput"
            type="file"
            onChange={(e) => this._handleObjChange(e)}
          />
        </form>
      </div>
    );
  }
}
