import types from "./mutation-types";

const actions = {
  setImage(image) {
    return { type: types.SET_IMAGE, image };
  },
  setTexture(texture) {
    return { type: types.SET_TEXTURE, texture }
  }
};

export default actions;