// import { TokenPayload } from "@/interfaces/token";
// import { parse } from "qs";

/**
 * 异步加载 script
 * @param {string} src script url
 */
export function loadScript(src: string): Promise<Event> {
  return new Promise((resolve, reject) => {
    const head = document.head;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    head.appendChild(script);
  });
}

/**
 * 异步加载 stylesheet
 * @param {string} href stylesheet href
 */
export function loadStyle(href: string): Promise<Event> {
  return new Promise((resolve, reject) => {
    const head = document.head;
    const link: HTMLLinkElement = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    head.appendChild(link);
  });
}

/**
 * 解析 JWT Token
 *
 * @export
 * @param {string} token access token
 * @returns {(TokenPayload | undefined)} payload
 */
// export function decodeJWTToken(token: string): TokenPayload | undefined {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     return JSON.parse(jsonPayload);
//   } catch (error) {}
// }

/**
 * pad 0 to left
 *
 * @export
 * @param {number} num
 * @returns {string}
 */
export function padLeft(num: number): string {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num.toString();
  }
}

/**
 * 格式化日期时间
 *
 * @export
 * @param {number} time 时间戳
 * @param {string} [pattern='YYYY/MM/DD hh:mm:ss'] 格式
 * @returns {string} 格式化时间
 */
export function formatDateTime(
  time: number,
  pattern = "yyyy/MM/DD hh:mm:ss"
): string {
  const date = new Date(time);
  const year = padLeft(date.getFullYear());
  const month = padLeft(date.getMonth() + 1);
  const day = padLeft(date.getDate());
  const hour = padLeft(date.getHours());
  const minute = padLeft(date.getMinutes());
  const second = padLeft(date.getSeconds());
  return pattern
    .replace(/y+/i, year)
    .replace(/M+/, month)
    .replace(/D+/, day)
    .replace(/h+/, hour)
    .replace(/m+/, minute)
    .replace(/s+/, second);
}

/**
 * 格式化日期
 *
 * @export
 * @param {number} time 时间戳
 * @param {string} [pattern='YYYY/MM/DD'] 日期格式
 * @returns {string} 格式化日期
 */
export function formatDate(time: number, pattern = "YYYY/MM/DD"): string {
  return formatDateTime(time, pattern);
}

/**
 * 格式化时间
 *
 * @export
 * @param {number} time 时间戳
 * @param {string} [pattern='hh:mm:ss'] 时间格式
 * @returns {string} 格式化时间
 */
export function formatTime(time: number, pattern = "hh:mm:ss"): string {
  return formatDateTime(time, pattern);
}

interface EntityMap<T> {
  [key: string]: T;
}

/**
 * 数组转化为 Map
 *
 * @export
 * @template T 元素类型
 * @param {T[]} items 待转数组
 * @param {keyof T} [key='id'] uniqueId, 默认为 `id`
 * @returns {EntityMap<T>} Map
 */
export function arrayToEntityMap<T extends any>(
  items: T[],
  key: keyof T = "id"
): EntityMap<T> {
  const entities: EntityMap<T> = {};
  items.forEach((item) => {
    const id = item[key];
    entities[id] = item;
  });

  return entities;
}

// export async function loadComponentSet() {
//   try {
//     const modules = await import("@cisdi/ui-engine-components");
//     const materials = await import("@cisdi/ui-engine-materials");
//     return {
//       ...modules,
//       ...materials
//     };
//   } catch (error) {
//     console.log(error);
//     return {};
//   }
// }

/**
 * 获取 search 参数
 *
 * @export
 * @returns {{[key: string]: string}} 参数
 */
// export function getSearchParams(): { [key: string]: string } {
//   const { search, hash } = location;
//   const searchParamsFromLocation = parse(search, {
//     ignoreQueryPrefix: true
//   });

//   const hashSearch = hash.split("?").pop() as string;

//   const searchParamsFromHash = parse(hashSearch, {
//     ignoreQueryPrefix: true
//   });

//   const searchParams = {
//     ...searchParamsFromLocation,
//     ...searchParamsFromHash
//   };
//   return searchParams;
// }
