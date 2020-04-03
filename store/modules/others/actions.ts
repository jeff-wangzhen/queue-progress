import { OtherState } from './types';
import { ActionTree } from 'vuex';
import { RootState } from '../../types';

export const actions: ActionTree<OtherState, RootState> = {
  changeDark({ commit }, isDark): void {
    const darkInfo: OtherState = {
      isDark,
    };
    commit('changeDark', darkInfo);
  },
};
