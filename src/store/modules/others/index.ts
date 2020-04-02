import { Module } from "vuex";
import { OtherState } from "./types";
import { RootState } from "../../types";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";

const state: OtherState = {
  isDark: false,
};
const namespaced = true;
export const others: Module<OtherState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
export default state;
