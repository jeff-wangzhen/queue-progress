import { GetterTree } from "vuex";
import { UserState } from "./types";
import { RootState } from "../../types";

export const getters: GetterTree<UserState, RootState> = {
  fullName(state): string {
    return `${state.firstName} ${state.lastName}`;
  },
};
