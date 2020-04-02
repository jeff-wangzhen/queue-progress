/* eslint-disable no-unused-vars1 */
export interface Queue {
  id?: string;
  title: string;
  description: string;
  createTime?: number;
  startTime?: string;
  maxPeopleCount?: number;
  joinCondition: JoinCondition;
  imgList?: Array<String>;
  showOnIndex?: boolean;
  state?: "stop" | "ok" | "deleted" | "created";
}

export interface JoinCondition {
  type: JoinConditionType;
  questions: Array<Question>;
}
export interface Question {
  id: string;
  type: "text" | "radio" | "checkbox";
  question: string;
  answer: string;
}

export enum JoinConditionType {
  NO = 0,
  EXACT = 1,
  AUDIT = 2,
}

export enum Status {
  NO_MORE = "noMore",
  MORE = "more",
  LOADING = "loding",
}

export interface QueueHistory {
  time: string;
  type: "in" | "out" | "create" | "quit" | "pass" | "continue" | "stop";
  subject: string;
  action: string;
}
