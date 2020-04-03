import { Iuser } from './user';
export default interface Imessage {
  type: 'text' | 'image' | 'code';

  content: string;
  href?: String;
  time: number;
  sender: Iuser;
}
