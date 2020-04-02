import { UserState } from "./types";
import { ActionTree } from "vuex";
import { RootState } from "../../types";

export const actions: ActionTree<UserState, RootState> = {
  fetchData({ commit }): void {
    const userInfo: UserState = {
      firstName: "Hello",
      lastName: "World",
      mobile: "1235678911",
      id: "qa",
      name: "name",
      avatar: "https://dummyimage.com/64",
    };
    commit("saveUserInfo", userInfo);
  },
};
