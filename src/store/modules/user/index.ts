import { Module } from "vuex";
import { UserState } from "./types";
import { RootState } from "../../types";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";

const state: UserState = {
  firstName: "",
  lastName: "",
  mobile: "",
  id: "qaz",
  name: "name",
  avatar: "https://dummyimage.com/64",
};
const namespaced = true;
export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
export default state;
