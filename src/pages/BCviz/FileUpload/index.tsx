import { UV, UVenum } from "../utils";
import { Button, Dialog, Divider, Link as Link_MUI, Paper, Tooltip } from "@mui/material";
import { useMount, useBoolean, useUpdateEffect, useMemoizedFn, useDynamicList } from "ahooks";
import style from './_index.module.scss';
import { type SetStateType } from "../types";
import { type SetState } from 'ahooks/lib/createUseStorageState';
// import clsx from 'clsx';
import FileUploadSimple, { fetchData } from "../FileUploadSimple";
import classNames from "clsx";
import { unstable_batchedUpdates } from "react-dom";
import type { OriginDataObj, OriginDataObjReadonlyArr, OriginGraphDataReadonlyArr, OriginGraphDataArr, OriginGraphDataSuperArr, OriginGraphDataSuperReadonlyArr } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { uniq } from "lodash";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// import type { NullValue } from "vite/node_modules/rollup";
// import type { NullValue } from "rollup";
import { ToastContainer } from "react-toastify";
import { TabKey, TabKey2Title } from "@/pages/BCViz_new/utils";
import { Path } from "@/Route";
const { error } = console;
// import {
//   usePopupState,
//   bindTrigger,
//   bindDialog
// } from 'material-ui-popup-state/hooks';
const { from, isArray } = Array;
const { freeze } = Object;
const { isSafeInteger } = Number;

// const initFileInfo = ({
//   lastModified: 0,
//   name: '',
//   size: 0,
//   type: '',
//   downloadUrl: '',
// });

export type UVtype = typeof UV;
export type UVtypeKey = keyof UVtype;
// 0 1 6
export type parseData<T> = (str: string) => T;
export const parseTableData = ((str) => {
  const arr = str.trim().split('\n');
  const result: OriginDataObj[] = [];
  for (const i of arr) {
    const [uv, ind, val] = i.trim().split(/[ \t]/) as [UVtypeKey, string, string];
    const kInd = parseInt(ind);
    const v = parseInt(val);
    if (!isSafeInteger(kInd) || !isSafeInteger(v)) {
      return [];
    }
    result.push({
      k: UV[uv],
      kInd,
      v,
    });
  }
  return result;
}) as parseData<OriginDataObjReadonlyArr>;
const parseGraphDataSingle = (i: string, result: OriginGraphDataArr) => {
  const [uStr, vStr] = i.trim().split(/[ \t]/) as [string, string];
  const u = parseInt(uStr);
  const v = parseInt(vStr);
  if (!isSafeInteger(u) || !isSafeInteger(v)) {
    return;
  }
  result.push({
    [UVenum.U]: u,
    [UVenum.V]: v,
  });
};
const parseGraphDataSuperSingle = (i: string, result: OriginGraphDataSuperArr) => {
  const [uStr, vStr, superWidthStr] = i.trim().split(/[ \t]/) as [string, string, string];
  const u = parseInt(uStr);
  const v = parseInt(vStr);
  const superWidth = parseInt(superWidthStr);
  if (!isSafeInteger(u) || !isSafeInteger(v)) {
    return;
  }
  result.push({
    [UVenum.U]: u,
    [UVenum.V]: v,
    superWidth,
  });
};
const parseGraphData: parseData<OriginGraphDataReadonlyArr> = ((str, parseFunc = parseGraphDataSingle) => {
  const arr = str.trim().split('\n');
  const result: OriginGraphDataSuperArr = [];
  for (const i of arr) {
    parseFunc(i, result);
  }
  return result;
}) as parseData<OriginGraphDataReadonlyArr>;
export const parseGraphDataSuper: parseData<OriginGraphDataSuperReadonlyArr> = ((str, parseFunc = parseGraphDataSuperSingle) => {
  const arr = str.trim().split('\n');
  const result: OriginGraphDataArr = [];
  for (const i of arr) {
    parseFunc(i, result);
  }
  return result;
}) as parseData<OriginGraphDataSuperReadonlyArr>;
// export type FileInfoType = Partial<typeof initFileInfo>;
type JSON_OBJ = Record<string, number | string>;
export type JSON_ARR = ReadonlyArray<JSON_OBJ>;
export interface WillPatchData<T = JSON_ARR> {
  readonly fileName: string;
  readonly data: ReadonlyArray<T>;
}
type WillPatchDataArr<T = JSON_ARR> = ReadonlyArray<WillPatchData<T>>;
export interface FileUploadProps {
  // readonly setTableData: SetStateType<OriginDataObjArr | undefined>;
  // readonly setGraphData: SetStateType<OriginGraphDataArr | undefined>;
  readonly setDatas: ReadonlyArray<SetStateType<JSON_ARR>>;
  readonly setFileNames: ReadonlyArray<(value?: SetState<string> | undefined) => void>;
}
type FileNameKeys = ['dataset', 'BCviz_file'];
const fileNameKeys: FileNameKeys = (['dataset', 'BCviz_file',]);
const fileUploadSimpleProps = freeze([
  {
    title: TabKey2Title[TabKey.graph],
    parseData: parseGraphData,
    defaultTxt: ['example.txt', 'writer.txt', 'marvel.txt', 'paper.txt']
  },
  {
    title: TabKey2Title[TabKey.table],
    parseData: parseTableData,
    defaultTxt: ['example_cohesion.txt', 'writer_cohesion.txt', 'marvel_cohesion.txt', 'paper_cohesion.txt']
  }
]);
const throwError = (str = 'searchParams is not enough') => {
  error(str);
  throw new Error(str);
};

export default function FileUpload (props: FileUploadProps) {
  const {
    // setTableData, setGraphData,
    setDatas, setFileNames } = props;
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  // const popupState = usePopupState({ variant: 'dialog' });
  // const [url, setUrl] = useSafeState('');
  // const [willPatchData, setWillPatchData, resetWillPatchData] = useResetState<WillPatchDataArr>(from(new Array(setDatas?.length)));
  const { list: willPatchData, resetList, replace } = useDynamicList<WillPatchData>();
  const setWillPatchData = useMemoizedFn((ind: number) => (e: WillPatchData) => replace(ind, e));
  const resetWillPatchData = useMemoizedFn(() => resetList([]));
  const [searchParams, setSearchParams] = useSearchParams();
  const { arrEntries, arrKeys } = useMemo(() => {
    const arrEntries = from(searchParams.entries());
    const arrKeys = arrEntries.map(([k]) => k) as FileNameKeys;
    return { arrEntries, arrKeys };
  }, [searchParams]);
  const isCanUseSearchParams = useMemo(() => {
    const { length } = setDatas;
    if (searchParams.size < length) {
      return false;
    }
    if (uniq(arrKeys).filter((key) => fileNameKeys.includes(key)).length !== length) {
      return false;
    }

    return true;
  }, [searchParams]);
  const searchParamsError = useMemoizedFn(() => {
    setTrue();
    setSearchParams();
  });
  // const [willPatchTableData, setWillPatchTableData] = useSafeState<OriginDataObjArr>();
  // const [willPatchGraphData, setWillPatchGraphData] = useSafeState<OriginGraphDataArr>();
  // const [lastTableData, setLastTableData] = useLocalStorageState('lastTableData');
  // const [lastGraphData, setLastGraphData] = useLocalStorageState('lastGraphData');
  // const isHasStorage = isDEV && isArray(lastTableData) && isArray(lastGraphData);
  useMount(() => {
    if (!isCanUseSearchParams) {
      searchParamsError();
      return;
    }
    const arrFileNames = arrEntries.map(([, v]) => v);
    Promise.all(arrFileNames.map((fileName) => (fetchData(fileName)))).then(arrRes => {
      // if (!fileNameKeys.every(fileNameKey => arrKeys.includes(fileNameKey))) {
      //   return throwError();
      // }
      fileNameKeys.map((key, ind) => {
        // debugger;
        const findIndex = arrKeys.indexOf(key);
        const fileData = arrRes[findIndex]?.fileData;
        const fileName = arrFileNames[findIndex];
        if (!fileData || !fileName) {
          return throwError();
        }
        const parseData = fileUploadSimpleProps[ind]?.parseData(fileData);
        if (!parseData?.length) {
          return throwError('parse error');
        }
        return { parseData, fileName };
        // if (findIndex === -1) {
        //   throw new Error('searchParams is not enough');
        // }
        // if (findIndex >= 0 && findIndex <= length - 1) {
        // setDatas[findIndex](fileUploadSimpleProps[findIndex]?.parseData(resArr[ind]?.fileData));
        // }
      }).forEach(({ parseData, fileName }, ind) => {
        const setData = setDatas[ind];
        const setFileName = setFileNames[ind];
        if (!setFileName || !setData) {
          return throwError();
        }
        //@ts-expect-error
        setData(parseData);
        setFileName(fileName);
      });
    }).catch((e) => {
      error(e);
      searchParamsError();
    });
    // if (isHasStorage) {
    //   setDatas[0]?.(lastGraphData);
    //   setDatas[1]?.(lastTableData);
    // } else {
    //   setTrue();
    // }
  });
  useUpdateEffect(() => {
    if (!isOpen) {
      resetWillPatchData();
    }
  }, [isOpen]);
  const isShouldSetData = willPatchData.length === setDatas.length && from(willPatchData).every(Boolean);
  // const fetchData = useCallback((url: string) => {
  //   fetch(url).then(async res => {
  //     const { headers } = res;
  //     const data = await res.text();
  //     if (typeof data === 'string') {
  //       try {
  //         const parseData = parseTableData(data);
  //         const downloadUrl = getDownloadUrl(new Blob([data]));
  //         setFileInfo({
  //           lastModified: Date.parse(headers.get('last-modified') ?? ''),
  //           name: url,
  //           size: parseInt(headers.get('content-length') ?? ''),
  //           type: headers.get('content-type') ?? '',
  //           downloadUrl,
  //         });
  //         setWillPatchData(parseData);
  //       } catch {
  //         alert('输入格式不正确');
  //         return;
  //       }
  //     }
  //     return res;
  //   });
  // }, []);
  // const bindDialogAction = bindDialog(popupState);
  return (
    <>
      <Button size='large' variant="contained"
        onClick={setTrue}
        // {...bindTrigger(popupState)}
        fullWidth
      >
        { //Open New Bipartite Graph
        }
        New Graph
      </Button>
      <Dialog
        // open={isOpen}
        onClose={(e) => {
          if (isCanUseSearchParams) {
            setFalse();
          }
          // if ((lastTableData || willPatchTableData) && (lastGraphData || willPatchGraphData)) {
          //   // bindDialogAction.onClose(e);
          // }
        }}
        className={style['Dialog'] ?? ''}
        open={isOpen}
      // open={bindDialogAction.open}
      // {...bindDialog(popupState)}
      >
        <Paper key='title' elevation={24} className={style['title'] ?? ''}>
          <h3>New Graph</h3>
        </Paper>
        <Paper elevation={24}>
          <Paper key='upload' elevation={24}
            className={classNames(style['Paper'], style['FileUploadTeam'])}
          >{
              (fileUploadSimpleProps).map((item, ind) => (

                <FileUploadSimple
                  //@ts-expect-error
                  setWillPatchData={setWillPatchData(ind)}
                  // setWillPatchData={(e) => {
                  //   return setWillPatchData([...willPatchData.slice(0, ind), e, ...willPatchData.slice(ind + 1)] as WillPatchDataArr);
                  // }}
                  {...item}
                  key={ind}
                />
              ))
            }
            {/* <FileUploadSimple title='请上传二部图数据' parseData={parseGraphData} setWillPatchData={setWillPatchGraphData}
            defaultTxt={['./BCviz/example.txt', './BCviz/writer.txt', './BCviz/marvel.txt']}
            key={1}
          />
          <FileUploadSimple
            title='请上传稠密度数据'
            parseData={parseTableData}
            setWillPatchData={setWillPatchTableData}
            defaultTxt={['./BCviz/example_cohesion.txt', './BCviz/writer_cohesion.txt', './BCviz/marvel_cohesion.txt']}
            key={0}
          /> */}
          </Paper>
          {/* 
            <*/}
        </Paper>

        <Divider />
        <Paper elevation={24} key='confirm'
          className={style['Paper'] ?? ''}
        >
          <Button
            size='large' variant="contained"
            fullWidth
            disabled={!isShouldSetData}
            onClick={() => unstable_batchedUpdates(() => {
              if (isShouldSetData) {
                const [dataset, BCviz_file] = willPatchData.map(({ fileName }) => fileName);
                if (!dataset || !BCviz_file) {
                  return;
                }
                willPatchData.forEach(({ fileName, data }, ind) => {
                  //@ts-expect-error
                  setDatas[ind]?.(data);
                  setFileNames[ind]?.(fileName);
                });
                setSearchParams(
                  // new URLSearchParams
                  ({ dataset, BCviz_file, }), {
                  replace: true,//该参数用于指定导航时是否替换当前历史记录条目，而不是在历史记录中添加新的条目。默认值为 false，即导航时会在历史记录中添加新的条目，用户可以通过浏览器的后退按钮返回上一个页面；当设置为 true 时，当前的历史记录条目会被替换，用户无法通过后退按钮回到被替换的页面。
                  // state: any,//该参数允许你在导航时传递任意数据到目标页面。传递的数据可以在目标页面通过 useLocation 钩子获取到。这在需要在不同页面之间传递数据，而又不想通过 URL 参数传递时非常有用。
                  preventScrollReset: false,//该参数用于控制导航后页面滚动位置是否重置。默认情况下，导航到新页面时，页面会滚动到顶部；当设置为 true 时，页面滚动位置将保持不变。
                  // relative: RelativeRoutingType,//该参数用于指定相对导航的类型。RelativeRoutingType 是一个枚举类型，有以下几种可能的值：'route'：表示相对于当前路由进行导航。'path'：表示相对于当前路径进行导航。

                  flushSync: false,//该参数用于控制导航是否同步执行。默认情况下，导航是异步执行的；当设置为 true 时，导航会同步执行，这意味着在导航完成之前，后续代码不会继续执行(下面的代码会在导航完成后执行)。
                  viewTransition: true,//该参数用于控制是否启用视图过渡效果。当设置为 true 时，在导航过程中会启用浏览器的视图过渡 API（如果浏览器支持），可以实现平滑的页面过渡动画效果。
                });

                // setTableData(willPatchTableData);
                // setGraphData(willPatchGraphData);
                // popupState.close();
                setFalse();
                // if (isDEV) {
                //   setLastGraphData(willPatchData[0]?.data);
                //   setLastTableData(willPatchData[1]?.data);
                // }
              }
            })}
          >Comfirm</Button>
          <div
            // elevation={24}
            className={style['LinkToEdit'] ?? ''}
          ><Link to={{
            pathname: Path.edit,
          }}
          >
              <Tooltip title='go to a new page' arrow>
                <Button
                  // fullWidth
                  size="large"
                  variant="text"
                  endIcon={<ArrowBackIcon fontSize="large" className={style['backIcon'] ?? ''} />}
                >
                  <Link_MUI underline="hover"
                  >
                    Create custom Bipartite Graph</Link_MUI>
                </Button>
              </Tooltip></Link></div>
        </Paper>
        {/* <ToastContainer /> */}
      </Dialog>
    </>
  );
};

// export { type NullValue };

// 控制台：https://lavm-console.jdcloud.com/lavm/detail/cn-north-1/lavm-l1f5f2rdrk

/* 马上要做的：
1. 如果是超图，Tab标题、ECharts左上角title应该标注超图
2. 自定义绘制图：历史记录、动态增减点、ECharts体验优化（连线优化、hover点强调、去掉loading）、帮助提示（返回上一页）
3. 上传文件时，如果不是示例文件，且后端无hash，先上传后端

  */
// 在别的Modes也要显示size 的直线
// 拖放文件
// useTransition（startTransition）、useDeferredValue改造，src\pages\BCviz\FileUploadSimple\index.tsx上传文件解析错误也要toast）
// react-toast -> Alert/Notification
// 设置：主题色、设置语言（react-intl）、全屏，使用SpeedDial来快速全屏
// 打开文件弹窗可关闭（关闭按钮），打开新图两处改fieldset
// 根据location.search来载入设置
// 图表全屏监听longpress（ahooks）
// 监听enter确认
// 主界面也要显示当前文件信息和预览下载文件
// 打开文件示例一次性加载2个
// 点击顶点弹出toast介绍顶点详细信息
// useSetInputST交给TabPanelInput自己管理
// Tooltip移到example时，从indexedb拿文件信息（onOpen时拿）
// 把BCviz_new所有值全部迁移到useContext
// 没结果时，展示在ECharts里的信息需要展示全部
// manifest缓存文件（src\pages\BCViz_new\server_conf\manifest.appcache.md）
// 解析TXT文件、解析查询结果、解析超图->webworker（src\pages\BCViz_new\webWorker.md）


// 失败：
// 二部图的点坐标重新设计，把getDataArrWithPos和UV合并起来
// 选择多点时，AutoComplete列表太多，需要虚拟dom库（react-window）（src\pages\Test\File.tsx）



/*
两步操作
Autocomplete
Select
Menu/Popover

一步操作
Pagination
RadioGroup
Stepper
Tabs
ToggleButtonGroup

Avatar
*/

interface Vertex {
  bipartite: 'U' | 'V'; // 顶点是属于U或V数据集
  index: number;  // 顶点所在数据集的序号
  cohesion: number;  // 索引稠密度
  neighbor: Vertex[]; // 邻居
  graphX: number; // 横坐标
  graphY: number; // 纵坐标
  color?: string; // 顶点颜色，在后续查询结果中需要着重强调时使用
}