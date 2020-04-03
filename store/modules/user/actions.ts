import { UserState } from './types';
import { ActionTree } from 'vuex';
import { RootState } from '../../types';

export const actions: ActionTree<UserState, RootState> = {
  setUser({ commit }): void {
    //console.log(6, commit);
    commit('saveUserInfo', commit);
  },
};
