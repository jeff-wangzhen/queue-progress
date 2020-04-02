import { MutationTree } from "vuex";
import { UserState } from "./types";

export const mutations: MutationTree<UserState> = {
  changeMobile(state, mobile: string) {
    state.mobile = mobile;
  },
  saveUserInfo(state, userInfo) {
    state = Object.assign(state, userInfo);
  },
};
