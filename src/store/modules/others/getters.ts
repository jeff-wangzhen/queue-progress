import { GetterTree } from "vuex";
import { OtherState } from "./types";
import { RootState } from "../../types";

export const getters: GetterTree<OtherState, RootState> = {
  fullName(state): string {
    return `${state.isDark}`;
  },
};
