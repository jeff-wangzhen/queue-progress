import { Iuser } from "./user";
import { Queue } from "./queue";
export interface IitemList extends Queue {
  creator: Iuser;
}
export interface queryParamsType {
  position?: string;
  keyword?: string;
  length?: Number;
}
