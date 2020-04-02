import { MutationTree } from "vuex";
import { OtherState } from "./types";

export const mutations: MutationTree<OtherState> = {
  changeDark(state, dark) {
    state = Object.assign(state, dark);
  },
};
