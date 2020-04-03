import { MutationTree } from 'vuex';
import { UserState } from './types';

export const mutations: MutationTree<UserState> = {
  saveUserInfo(state, userInfo) {
    state = Object.assign(state, userInfo);
  },
  logout(state, userInfo) {
    state = Object.assign(state, userInfo);
  },
};
