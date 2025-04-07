import axios from "axios";
import { createOrAddIdb } from "@/utils/idb";
import { idbCommonArgs } from "../BCviz/FileUploadSimple";
import { Modes, ModesShortcut, getFileIdb } from "./utils";
import { UVenum } from "../BCviz/utils";
import { parseStringToObjArray } from "./parsePQB";
import type { InputSTSetState } from "./InputST";
import { waitOnLoadEventLoop } from "@/utils";
import { isDEV } from "@/utils/isEnv";
const { error } = console;
const { isSafeInteger } = Number;
export const baseURL = 'http://47.99.129.94';
waitOnLoadEventLoop(() => {
  const { origin, protocol, port, hostname, } = location;
  if (origin === baseURL
    || isDEV
    // || port === '4173'
  ) {
    return;
  }
  if (
    // protocol === 'http:' &&
    // (hostname === 'localhost' || hostname === '127.0.0.1') &&
    true
  ) {
    const testAPI = '/api/test';
    axios.get(testAPI, {
      validateStatus: status => {
        return status === 204;
      }
    }).catch(res => {
      // const { status, headers, } = res;
      // if (status !== 204) {
      axios.get(`${baseURL}${testAPI}`).then(res => {
        const { status, headers, } = res;
        if (status === 204) {
          const { defaults } = axios;
          defaults.baseURL = baseURL;
          return;
        }
      }).catch(error);
      // }
    });
    // defaults.baseURL = baseURL;
    return;
  }
  // const debugURL = localStorage.getItem('debugURL');
  // const { defaults } = axios;
  // if (!debugURL) {
  //   defaults.baseURL = baseURL;
  //   return;
  // }
  // try {
  //   const url = new URL(debugURL);
  //   defaults.baseURL = url.origin;
  //   return;
  // } catch {
  //   error('debugURL is not a valid URL');
  //   defaults.baseURL = `${protocol}//${baseURL}`;
  // }
});
// axios.defaults.baseURL = baseURL;
const regToArr = (input: string, reg: RegExp): ReadonlyArray<number> => {
  const match = reg.exec(input);
  const str = match?.[1]?.trim();
  return str ? str.split(/\s+/).map(i => {
    const num = parseInt(i);
    if (isSafeInteger(num)) {
      return num; //旧api要加一
    }
    return 0;
  }) : [];
  //const u:  =
};
// export type UVType=
export type UVReturnType = Record<UVenum, ReadonlyArray<number>>;;
export type execTextType = {
  readonly size: number | undefined;
  readonly count?: number;
  readonly label?: string;
} & (Partial<UVReturnType>);
const execTextFromMaximumBiclique = (input: string): execTextType => {
  const sizePattern = /size=(\d+)/;
  const sizeMatch = sizePattern.exec(input);
  const sizeStr = sizeMatch?.[1];
  const size: number = sizeStr ? parseInt(sizeStr, 10) : 0;
  const u = regToArr(input, /U:\s+([\d\s]+)/);
  const v = regToArr(input, /V:\s+([\d\s]+)/);
  return { size, u, v, label: `Rank ${1}` };
};
export interface getFromSTReturn {
  readonly count?: number;
  // readonly size?: number;
  readonly dataArr: ReadonlyArray<execTextType>;
}
type getFromSTReturnWithParams = getFromSTReturn & Partial<GetFromSTParams>;
export type Datas = Partial<Record<Modes, getFromSTReturnWithParams>>;

// const execTextFromApiOld = (input: string): Partial<Record<Modes, MEBType>> => ({
//   [Modes['Maximum Biclique']]: execTextFromMaximumBiclique(input),
// });
const execTextFromApi = (input: string): Partial<Record<Modes, getFromSTReturn>> => ({
  [Modes['Maximum Biclique']]: {
    dataArr: [execTextFromMaximumBiclique(input)]
  },
  [Modes['Maximal Biclique Enumeration']]: parseStringToObjArray(input),
  [Modes['(p,q)-biclique Counting']]: parseStringToObjArray(input),
});
// interface getFromSTReturn extends Record<Modes, object> {
//   'Maximum Biclique': MEBType;
//   // 'Maximal Biclique Enumeration': 'Maximal Biclique Enumeration',
//   // '(p,q)-biclique Counting': '(p,q)-biclique Counting',
//   // 'Hierarchical Subgraphs Search': 'Hierarchical Subgraphs Search';
// }

export interface FileNames {
  readonly dataset: string;
  readonly BCviz_file: string;
}
// Record<string, string> &
type GetFromSTParams = FileNames
  & InputSTSetState & {
    problem_type: (typeof ModesShortcut)[Modes];
  };
// export const getFromSTOld = async (mode: Modes,
//   oldData: Datas | undefined,
//   //Required<Parameters<typeof axios.get>>[1]['params'] &
//   params: GetFromSTParams
// ) => {
//   // if (isDEV) {
//   //   await new Promise(resolve => {
//   //     // setTimeout(() => {
//   //     waitLastEventLoop(resolve);
//   //     // }, 2e3);
//   //   });
//   //   return {
//   //     ...oldData,
//   //     [mode]: mockText(),
//   //   };
//   // }
//   const url = `/api/BCviz/${mode.trim().replace(/\s/g, '')}`;
//   // const key = sha1().update(`${url}?${new URLSearchParams(params)}`, 'hex').digest('hex');
//   const key = `${url}?${new URLSearchParams(params)}`;
//   const data = await getFileIdb<getFromSTReturn>(key).catch(() => axios.get<string>(url, {
//     responseType: 'text',
//     params,
//   }).then(e => {
//     const { data } = e;
//     const willResolveData = execTextFromApiOld(data)[mode];
//     createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
//     return willResolveData;
//   }, (reason) => {
//     error(reason);
//     throw new Error(reason);
//   })).catch((reason) => {
//     error(reason);
//     throw new Error(reason);
//   });
//   // const data = await getIdb<StoreType>({
//   //   ...idbCommonArgs,
//   //   query: key
//   // }).then(res => {
//   //   if (isUseIdbCache(res)) {
//   //     return res;
//   //   }
//   //   return axios.get<string>(url, {
//   //     responseType: 'text',
//   //     params,
//   //   }).then(e => {
//   //     const { data } = e;
//   //     const willResolveData = execTextFromApi(data)[mode];
//   //     createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
//   //     return willResolveData;
//   //   });
//   // }, error).catch(error);
//   return ({
//     ...oldData,
//     ...(data ? { [mode]: data, } : {}),
//   });
// };
//| Required<Parameters<typeof axios.get>>[1]['params'] & Record<string, string | number>
export const getFromST = async (mode: Modes, oldData: Datas | undefined, params: GetFromSTParams) => {
  // if (isDEV) {
  //   await new Promise(resolve => {
  //     // setTimeout(() => {
  //     waitLastEventLoop(resolve);
  //     // }, 2e3);
  //   });
  //   return {
  //     ...oldData,
  //     [mode]: mockText(),
  //   };
  // }
  const url = `/api/BCviz/v3`;
  // const key = sha1().update(`${url}?${new URLSearchParams(params)}`, 'hex').digest('hex');
  const key = `${url}?${new URLSearchParams({
    ...params,
    problem: ModesShortcut[mode],
  })}`;
  const data = await getFileIdb<execTextType>(key).catch(() => axios.get<string>(url, {
    responseType: 'text',
    params,
  }).then(e => {
    const { data } = e;
    const willResolveData = {
      ...execTextFromApi(data)[mode],
      ...params,
    };
    createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
    return willResolveData;
  }, (reason) => {
    error(reason);
    throw new Error(reason);
  })).catch((reason) => {
    error(reason);
    throw new Error(reason);
  });
  // const data = await getIdb<StoreType>({
  //   ...idbCommonArgs,
  //   query: key
  // }).then(res => {
  //   if (isUseIdbCache(res)) {
  //     return res;
  //   }
  //   return axios.get<string>(url, {
  //     responseType: 'text',
  //     params,
  //   }).then(e => {
  //     const { data } = e;
  //     const willResolveData = execTextFromApi(data)[mode];
  //     createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
  //     return willResolveData;
  //   });
  // }, error).catch(error);
  return ({
    ...oldData,
    ...(data ? { [mode]: data, } : null),
  });
}
/*
Query功能再加一个选择项，(p,q)-biclique enumeration，然后他的s,t参数改成
p: vertex number in U (U的顶点数), q: vertex number in V (V的顶点数)
*/
