import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { user } from './modules/user/index';
import { others } from './modules/others/index';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store: StoreOptions<RootState> = {
  modules: {
    user,
    others,
  },
  strict: debug,
};
export default new Vuex.Store<RootState>(store);
