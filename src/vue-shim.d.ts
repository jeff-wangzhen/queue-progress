import { Instance } from "./common/js/pocky-request v.2.0.4/index.d";
import { Store } from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    $http: Instance;
    $store: Store<any>;
    CustomBar: number;
    // $isDark: boolean;
    // $emit: (event: string, ...args: any[]) => this;
  }
}
