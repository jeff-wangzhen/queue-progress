import { UserState } from "./modules/user/types";
import { OtherState } from "./modules/others/types";

export interface RootState {
  user: UserState;
  other?: OtherState;
}
