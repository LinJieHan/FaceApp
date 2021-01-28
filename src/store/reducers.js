import { combineReducers } from "redux";
import types from "./mutation-types";

function image(iImage = null, action) {
  switch (action.type) {
    case types.SET_IMAGE:
      return action.image;
    default:
      return iImage;
  }
}
function texture(iTexture = null, action) {
  switch (action.type) {
    case types.SET_TEXTURE:
      return action.texture;
    default:
      return iTexture;
  }
}
const todoApp = combineReducers({
  image,
  texture,
});

export default todoApp;
