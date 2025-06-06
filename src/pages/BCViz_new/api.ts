import axios from "axios";
import { Modes, ModesShortcut, getFileIdb } from "./utils";
import { UVenum } from "../BCviz/utils";
import { parseStringToObjArray } from "./parsePQB";
import type { InputSTSetState } from "./InputST";
import { waitOnLoadEventLoop } from "@/utils";
import { parseGraphDataSuper, parseTableData } from "../BCviz/FileUpload";
import { isUndefined, omitBy } from "lodash";
import type { OriginDataObjReadonlyArr, OriginGraphDataSuperReadonlyArr } from "../BCviz/types";
import { createOrAddIdb } from "@/utils/idb";
import { type fetchDataReturn, withDownloadUrl, getDownloadUrl, idbCommonArgs } from "../BCviz/FileUploadSimple";
const { error } = console;
const { isSafeInteger } = Number;
const { freeze } = Object;
export const baseURL = localStorage.getItem('baseURL') ?? 'http://117.72.219.9';
export const isLocalhost = () => {
  const { origin, protocol, port, hostname, } = location;
  return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1');
};
const isChangeBaseURL = isLocalhost() && localStorage.getItem('hjx');
if (isChangeBaseURL) {
  const { defaults } = axios;
  defaults.baseURL = baseURL;
}

const validateStatus204 = (status: number) => {
  return status === 204;
};
waitOnLoadEventLoop(() => {
  const { origin, protocol, port, hostname, } = location;
  if (origin === baseURL
    || isChangeBaseURL
    // || port === '4173'
  ) {
    return;
  }
  if (
    protocol === 'http:'
    // && (hostname === 'localhost' || hostname === '127.0.0.1') &&
  ) {
    const testAPI = '/api/test';
    axios.get(testAPI, {
      validateStatus: validateStatus204
    }).catch(res => {
      // const { status, headers, } = res;
      // if (status !== 204) {
      axios.get(new URL(testAPI, baseURL).toString()).then(res => {
        const { status, headers, } = res;
        if (validateStatus204(status)) {
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
  [Modes['Maximum Edge Biclique']]: {
    dataArr: [execTextFromMaximumBiclique(input)]
  },
  [Modes['Maximal Biclique Enumeration']]: parseStringToObjArray(input),
  [Modes['(p,q)-biclique Counting']]: parseStringToObjArray(input),
  // '':''
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
type GetFromSTParams = FileNames
  & InputSTSetState & {
    readonly problem_type: (typeof ModesShortcut)[Modes];
    readonly vex_list?: string;
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
// export const isRecordString2 = (v: GetFromSTParams): v is Record<string, string> => true;

const getApiVersionPrefix = (pathname: string) => `/api/v1/${pathname}`;

export const getSearchBCviz = async <T,> (params: GetFromSTParams) => {
  const url = getApiVersionPrefix('MBS');
  // const key = sha1().update(`${url}?${new URLSearchParams(params)}`, 'hex').digest('hex');
  const paramsRecordString2: Record<string, string> = omitBy(params, isUndefined);
  const key = `${url}?${new URLSearchParams(paramsRecordString2)}`;
  const data = await getFileIdb<T>(key).catch(() => axios.get<string>(url, {
    responseType: 'text',
    params,
  }).then(e => {
    const { data } = e;
    return data;
  }, (reason) => {
    error(reason);
    throw new Error(reason);
  })).catch((reason) => {
    error(reason);
    throw new Error(reason);
  });
  return { data, key };
};
export const getFromST = async (mode: Modes, oldData: Datas | undefined, params: GetFromSTParams) => {
  const data = await getSearchBCviz<execTextType>(params).then(({ data, key }) => {
    if (typeof data === 'string') {
      const willResolveData = {
        ...execTextFromApi(data)[mode],
        ...params,
      };
      createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
      return willResolveData;
    }
    return data;
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
};
interface SuperDataType {
  readonly tableData: OriginDataObjReadonlyArr;
  readonly graphData: OriginGraphDataSuperReadonlyArr;
};
export const getSG = (params: GetFromSTParams) => {
  const data = getSearchBCviz<SuperDataType>(params).then(({ data, key }) => {
    if (typeof data === 'string') {
      const arr = data.trim().split('\n');
      const superVertexStart = arr.indexOf('super vertex:');
      const superEdgeStart = arr.indexOf('super edge:');
      const tableDataStr = arr.slice(superVertexStart + 1, superEdgeStart - 1).join('\n');
      const graghDataStr = arr.slice(superEdgeStart + 1).join('\n');
      const willResolveData: SuperDataType = {
        tableData: parseTableData(tableDataStr),
        graphData: parseGraphDataSuper(graghDataStr)
      };
      createOrAddIdb({ ...idbCommonArgs, data: willResolveData, IDBValidKey: key });
      return willResolveData;
    }
    return data;
  });
  return data;
};
export const uploadFile = (data: string, dataset: string) => {
  return axios.post(getApiVersionPrefix('upload'), data, {
    params: {
      dataset
    }
  });
};
export const uploadBCviz = (data: string, dataset: string) => {
  return axios.post(getApiVersionPrefix('upload'), data, {
    params: {
      dataset
    }
  });
};
// {
//   readonly dataset: string;
// }
export const constructBCviz = (params: Record<string, string | number>) => {
  return axios.get(getApiVersionPrefix('construct'), {
    params,
  });
};
export const constructBCviz_old = (data: string, dataset: string) => {
  return axios.post(getApiVersionPrefix('construct'), data, {
    params: {
      dataset,
      s_min: 1,
      t_min: 1
    }
  });
};
export const getFile = (url: string) => getFileIdb<fetchDataReturn>(url).then(withDownloadUrl).catch(() => axios.get<string>(url, {
  responseType: 'text'
}).then(async (res) => {
  const headers = new Headers(res.headers as Record<string, string>);
  // const data = await res.text();
  const { data } = res;
  // if (typeof data === 'string') {
  // try {
  const downloadUrl = getDownloadUrl(new Blob([data]));
  const willResolveData: fetchDataReturn = freeze({
    fileInfo: {
      lastModified: Date.parse(headers.get('last-modified') ?? ''),
      name: url,
      size: parseInt(headers.get('content-length') ?? ''),
      type: headers.get('content-type') ?? '',
      downloadUrl,
    },
    fileData: data,
  });
  createOrAddIdb({
    ...idbCommonArgs,
    IDBValidKey: url,
    data: willResolveData,
  });
  return willResolveData;
  // } catch {
  //   alert('some error occur');
  //   return;
  // }
  // }
  // return;
}, error)).catch(error);
export const headFileExist = (fileName: string) => axios.head(fileName, {
  validateStatus (status) {
    return status === 200 || status === 304;
  },
}).then(() => true, () => false);

// export const checkEqualExist = (filename, length) => axios.get(filename);