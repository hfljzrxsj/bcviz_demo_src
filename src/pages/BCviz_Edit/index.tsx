import { Button, Paper } from "@mui/material";
import BCViz_newStyle from "../BCViz_new/_index.module.scss";
import style from "./_index.module.scss";
import SideCollapse from "../BCViz_new/SideCollapse";
import CommonCharts, { onEChartsParam, onEChartsParamFunc } from "../BCViz_new/CommonECharts";
import { useMemoizedFn, useSafeState, useSetState } from "ahooks";
import { UVenum, getCommonValueFromTableData, getDataArrWithPos } from "../BCviz/utils";
import { OriginDataObjReadonlyArr, OriginGraphData, OriginGraphDataReadonlyArr } from "../BCviz/types";
import InitModal from "./InitModal";
import { CSSProperties, useMemo } from "react";
import { flatMapDepth, isEqual, isUndefined, uniqBy, uniqWith, without } from "lodash";
import { idbCommonArgs, svgWH } from "../BCViz_new/utils";
import { Link, getGraphOption } from "../BCViz_new/Echarts";
import { uvHighlightColor } from "../BCViz_new";
import { CallbackDataParams } from "echarts/types/dist/shared";
import classNames from 'clsx';
import { isDEV, isPROD } from "@/utils/isEnv";
import { initUVcount, testGraphData, testTableData } from "./devTestData";
import axios from "axios";
import { waitMiddleEventLoop } from "@/utils";
import { createOrAddIdb } from "@/utils/idb";
import { constructBCviz, uploadFile } from "../BCViz_new/api";
import { useNavigate } from "react-router";
// import md5 from 'md5';
import { str } from 'crc-32';
// import { } from '@types/md5';
const { freeze, fromEntries } = Object;
const { from } = Array;
const { isSafeInteger } = Number;
const { abs } = Math;
const { subtle } = crypto;
const textEncoder = new TextEncoder();

export const UVEnumArr = freeze([UVenum.U, UVenum.V]);
export default function BCviz_Edit () {
  const useFileName = useSafeState<string | undefined>(`file-${new Date().toJSON()}`);
  const [fileName, setFileName] = useFileName;
  const useUVCount = useSetState(initUVcount);
  const [uvCount, setUvCount] = useUVCount;

  const tableData = useMemo(() => {
    const tableData: OriginDataObjReadonlyArr = flatMapDepth(uvCount, (count, k, obj) =>
      from(new Array(count)).map((_, ind) => ({ k: (k as UVenum), kInd: ind + 1 })), 1);
    const commonValueFromTableData = getCommonValueFromTableData(tableData, svgWH);
    return getDataArrWithPos(tableData, [], commonValueFromTableData, innerHeight);
  }, [uvCount]);

  // const [selectDot, setSelectDot] = useSafeState<Omit<OriginDataObj, 'v'>>();
  const [selectDot, setSelectDot] = useSafeState<number>();
  const tableDataInSelect = useMemo(() => {
    if (isUndefined(selectDot)) {
      return tableData;
    }
    // const newTableData = { ...tableData };
    // newTableData[selectDot] = {}
    return ([
      ...tableData.slice(0, selectDot),
      { ...tableData[selectDot], color: uvHighlightColor },
      ...tableData.slice(selectDot + 1),
    ] as (typeof tableData));
    // const { k: kSelect, kInd: kIndSelect } = selectDot;
    // return tableData.map((obj) => {
    //   const { k, kInd } = obj;
    //   if (kInd === kIndSelect && k === kSelect) {
    //     return { ...obj, color: uvHighlightColor };
    //   }
    //   return obj;
    // });
    // const findSelectDot = tableData.findIndex(({ k, kInd }) => {
    //   return k === kSelect && kInd === kIndSelect;
    // });
    // if (findSelectDot === -1) {
    //   return tableData;
    // }
    // tableData[findSelectDot]
  }, [selectDot, tableData]);
  const [graghData, setGraghData] = useSafeState<OriginGraphDataReadonlyArr>(isDEV ? testGraphData : ([{
    u: 1,
    v: 1,
  }]));
  const GraphChartsOption = useMemo(() => { // TODO: 可以只变更series，其他在一开始就输入进去
    return getGraphOption(tableDataInSelect, graghData);
  }, [tableDataInSelect, graghData]);
  // const [tableData, setTableData] = useSafeState<PosDataObjArr>([]);
  const onClickFn: onEChartsParamFunc = useMemoizedFn((eCElementEvent) => {
    const {
      // componentSubType,
      // componentType,
      dataIndex,
      name,
      // seriesType,
      value,
      borderColor,
      color,
      data,
      dataType,
    } = eCElementEvent as CallbackDataParams;
    console.log(eCElementEvent);

    if (isSafeInteger(dataIndex) && name && dataType === 'node') {
      if (isUndefined(selectDot)) {
        setSelectDot(dataIndex);
      }
      else {
        if (dataIndex !== selectDot) {
          // const dot1 = tableData[dataIndex];
          // const dot2 = tableData[selectDot];
          // if (dot1 && dot2) {
          // setGraghData([...graghData, ({
          //   [dot1.k]: dot1.kInd,
          //   [dot2.k]: dot2.kInd,
          // } as Record<UVenum, number>)]);
          setGraghData(uniqWith([...graghData, (fromEntries([dataIndex, selectDot].map(ind => {
            const dot = tableData[ind];
            if (!dot) {
              return [];
            }
            return [dot.k, dot.kInd];
          })) as Record<UVenum, number>)], isEqual));
          // }

        }
        setSelectDot(undefined);
      }
    }
  });
  const onClick: onEChartsParam = ['click', 'series', onClickFn];
  const onDblClickFn = useMemoizedFn((eCElementEvent) => {
    const {
      // componentSubType,
      // componentType,
      dataIndex,
      name,
      // seriesType,
      value,
      borderColor,
      color,
      data,
      dataType,
    } = eCElementEvent as CallbackDataParams;
    const dataWithType = data as Link;

    if (isSafeInteger(dataIndex) && name && dataType === 'edge') {
      const { source, target } = dataWithType;
      const willFindLink: OriginGraphData = fromEntries([source, target].map((str) => {
        if (typeof str === 'string') {
          const k = (str[0] as UVenum);
          const kInd = parseInt(str.slice(1));
          return [k, kInd];
        }
        return [];
      }));
      const findOneInd = graghData.findIndex((link) => {
        return UVEnumArr.every(uv => link[uv] === willFindLink[uv]);
      });
      if (findOneInd !== -1) {
        setGraghData([
          ...graghData.slice(0, findOneInd),
          ...graghData.slice(findOneInd + 1),
        ]);
      }
    }
  });
  const onDblClick: onEChartsParam = ['dblclick', 'series', onDblClickFn];
  const navigate = useNavigate();
  return <Paper elevation={24} className={BCViz_newStyle['Main'] ?? ''}>
    <InitModal {...{ useFileName, useUVCount }} />
    <SideCollapse>


    </SideCollapse>
    <Paper elevation={24} className={classNames(BCViz_newStyle['Main-Mid'], style['Mid'])} >
      <CommonCharts option={GraphChartsOption} onParams={[onDblClick, onClick]} style={{ '--minHeight': '90vh' } as CSSProperties} />
      <Button fullWidth variant="contained" size="large"
        onClick={async () => {
          try {// if (confirm('Create BCviz file?')) {
            const text = graghData.map(({ u, v }) => `${u} ${v}`).join('\n');
            // const hash = await subtle.digest("SHA-1", textEncoder.encode(text)).then(arrayBuffer => {
            //   const hash = from(new Uint32Array(arrayBuffer
            //     // .slice(8)
            //   )).map(i => i.toString(36)).join('');
            //   return hash;
            //   // console.log(hash);
            // });
            const hash: string = abs(str(text)).toString(36);
            const fileNameFEWithExt = `${fileName}.txt`;  // 前端展示文件名
            const fileNameBEWithExt = `${hash}.txt`;  // 后端文件名
            const fileNameBEWithExt_cohesion = `${hash}_cohesion.txt`;
            const datasetsFileFolder = 'datasets/';
            // const fileNameBEWithExt = fileNameBEWithExt;//`${datasetsFileFolder}${fileNameBEWithExt}`;
            const fetchSeeIsExit = await Promise.all([fileNameBEWithExt, fileNameBEWithExt_cohesion].map(fileName => axios.head(fileName, {
              validateStatus (status) {
                return status === 200 || status === 304;
              },
            }))).then(() => true, () => false);
            if (!fetchSeeIsExit) {
              await constructBCviz(text, fileNameBEWithExt);
              await waitMiddleEventLoop();
              // await uploadFile(text, fileNameBEWithExt);
            }
            // if (isPROD) {
            const searchParams = new URLSearchParams({
              dataset: fileNameBEWithExt,
              BCviz_file: fileNameBEWithExt_cohesion,
            });
            navigate({
              pathname: '/',
              search: `?${searchParams.toString()}`
            });

            // 构建符合 HashRouter 结构的 URL
            // const targetUrl = `${window.location.origin}/#/?${searchParams.toString()}`;

            // // 在新标签页打开
            // window.open(targetUrl, '_blank');

            // }
            // const url = new URL('/', location.origin);
            // url.searchParams.set('dataset', fileNameBEWithExt);
            // url.searchParams.set('BCviz_file', `${hash}_cohesion.txt`);
            // open(url, '_blank');
            // if (isPROD) {
            const willResolveData = {
              fileInfo: {
                lastModified: Date.now(),
                name: fileNameBEWithExt,
                size: text.length,
                // type: headers.get('content-type') ?? '',
                // downloadUrl,
              },
              fileData: text,
            };
            createOrAddIdb({
              ...idbCommonArgs, data: willResolveData, IDBValidKey: fileNameBEWithExt
            });
            // }
            // localStorage.setItem(fileNameFEWithExt, fileBEPath);
            // localStorage.setItem(`${fileName}_cohesion.txt`, fileBEPath);
            // await waitMiddleEventLoop();

            // }}

          } catch (e) {
            // alert('something error');
            console.error(e);
          }

        }}
      >Confirm</Button>
    </Paper>
  </Paper>;
}

/*
1. 历史记录管理（indexedb+searchparam）
2. 使用帮助提示
3. 动态增减点（每次减后graphdata都要去掉边）
4. loading动画
5. 一条边都没有时，按钮变灰
6. 即将上传的文本预览，便于修改
7. focus: 'adjacency', 不强调某点

*/