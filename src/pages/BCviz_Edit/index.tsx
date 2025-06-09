import { Paper } from "@mui/material";
import BCViz_newStyle from "../BCViz_new/_index.module.scss";
import style from "./_index.module.scss";
import SideCollapse from "../BCViz_new/SideCollapse";
import CommonCharts, { type onEChartsParam, type onEChartsParamFunc } from "../BCViz_new/CommonECharts";
import { useCreation, useHistoryTravel, useMemoizedFn, useMount, usePrevious, useSafeState, useSetState, useUpdateEffect } from "ahooks";
import { UVenum, getCommonValueFromTableData, getDataArrWithPos } from "../BCviz/utils";
import type { OriginDataObjReadonlyArr, OriginGraphData, OriginGraphDataReadonlyArr } from "../BCviz/types";
import InitModal from "./InitModal";
import { type CSSProperties, useMemo } from "react";
import { every, flatMapDepth, isUndefined, some } from "lodash";
import { svgWH } from "../BCViz_new/utils";
import { type LinksEChartsType, getGraphOption } from "../BCViz_new/Echarts";
import { uvHighlightColor } from "../BCViz_new";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import classNames from 'clsx';
import { isDEV } from "@/utils/isEnv";
import { initUVcount, testGraphData } from "./devTestData";
// import md5 from 'md5';
import SideModifyNodeCount from "./SideModifyNodeCount";
import ConfirmModal from "./ConfirmModal";
import Menu from "./Menu";
import ReUndo from "./ReUndo";

// import { } from '@types/md5';
const { freeze, fromEntries } = Object;
const { from } = Array;
const { isSafeInteger } = Number;
const { abs } = Math;
// const { subtle } = crypto;
// const textEncoder = new TextEncoder();
const initFilename = `file-${new Date().toJSON()}`;

export const UVEnumArr = freeze([UVenum.U, UVenum.V]);
export const useGraghDataHistoryTravel = useHistoryTravel<OriginGraphDataReadonlyArr>;
export type UseGraghDataHistoryTravel = ReturnType<typeof useGraghDataHistoryTravel>;
export default function BCviz_Edit () {
  const useFileName = useSafeState<string | undefined>(initFilename);
  const [fileName = initFilename, setFileName] = useFileName;
  const useUVCount = useSetState(initUVcount);
  const [uvCount, setUvCount] = useUVCount;
  const lastUvCount = usePrevious(uvCount);
  const graghDataHistoryTravel = useGraghDataHistoryTravel(isDEV ? testGraphData : ([{
    u: 1,
    v: 1,
  }]));
  const { value: graphData, setValue: setGraghData, reset: resetGraghData } = graghDataHistoryTravel;
  // useUpdateEffect(() => {

  //  }, [uvCount]);

  const tableData = useMemo(() => {
    const tableData: OriginDataObjReadonlyArr = flatMapDepth(uvCount, (count, k) =>
      from(new Array(count)).map((_, ind) => ({ k: (k as UVenum), kInd: ind + 1 })), 1);
    const commonValueFromTableData = getCommonValueFromTableData(tableData, svgWH);
    return getDataArrWithPos(tableData, [], commonValueFromTableData, innerHeight);
  }, [uvCount]);
  useUpdateEffect(() => {
    // 新的数量比原来少
    if (graphData && some(uvCount, (count, uv) => {
      if (isUndefined(count) || isUndefined(lastUvCount)) {
        return false;
      }
      const lastCount = lastUvCount[uv as UVenum];
      return !isUndefined(lastCount) && count < lastCount;
    })) {
      const newGraphData = graphData.filter(edge => every(edge, (v, k) => {
        const count = uvCount[k as UVenum];
        return !isUndefined(count) && v <= count;
      }));
      if (graphData.length > newGraphData.length) {
        resetGraghData(newGraphData);
      }
    }
    // setGraghData(graphData);
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

  const GraphChartsOption = useMemo(() => { // TODO: 可以只变更series，其他在一开始就输入进去
    return getGraphOption({ dataArrWithPos: tableDataInSelect, graphData, emphasisFocus: 'none' });
  }, [tableDataInSelect, graphData]);
  // const [tableData, setTableData] = useSafeState<PosDataObjArr>([]);
  const onClickFn: onEChartsParamFunc = useMemoizedFn((eCElementEvent) => {
    if (!graphData) {
      return;
    }
    const {
      // componentSubType,
      // componentType,
      dataIndex,
      name,
      dataType,
    } = eCElementEvent as CallbackDataParams;

    if (isSafeInteger(dataIndex) && name && dataType === 'node') {
      if (isUndefined(selectDot)) {
        setSelectDot(dataIndex);
      } else if (dataIndex === selectDot) { //  两个点相同
        setSelectDot(undefined);  //  取消高亮
      }
      else {
        const dot1 = tableData[dataIndex];
        const dot2 = tableData[selectDot];
        if (!dot1 || !dot2) {
          return; //  出错了
        }
        const { k: dot1K } = dot1;
        const { k: dot2K } = dot2;
        if (dot1K === dot2K) {  //  两个点在同一侧
          setSelectDot(dataIndex);  //  换高亮点
        } else {
          const dots = [dot1, dot2];
          const findEdge = graphData.find(edge => {
            return dots.every(({ k, kInd }) => edge[k] === kInd);
          });
          if (findEdge) {
            // 删除已有边？
            // setGraghData(without(graphData, findEdge));
          } else {
            const entriesArr: ReadonlyArray<[UVenum, number]> = dots.map(({ k, kInd }) => ([k, kInd]));
            const graghObj = fromEntries(entriesArr) as OriginGraphData;

            setGraghData(graphData.concat(graghObj));
          }
          setSelectDot(undefined);
        }
        // const findLink=graphData
        // if (dot1 && dot2) {
        // setGraghData([...graghData, ({
        //   [dot1.k]: dot1.kInd,
        //   [dot2.k]: dot2.kInd,
        // } as Record<UVenum, number>)]);
        // setGraghData(uniqWith([...graphData, (fromEntries([dataIndex, selectDot].map(ind => {
        //   const dot = tableData[ind];
        //   if (!dot) {
        //     return [];
        //   }
        //   return [dot.k, dot.kInd];
        // })) as Record<UVenum, number>)], isEqual));
        // }
        // setSelectDot(undefined);
      }
    }
  });
  const onClick: onEChartsParam = ['click', 'series', onClickFn];
  const onDblClickFn = useMemoizedFn((eCElementEvent) => {
    if (!graphData) {
      return;
    }
    const {
      // componentSubType,
      // componentType,
      dataIndex,
      name,
      data,
      dataType,
    } = eCElementEvent as CallbackDataParams;
    const dataWithType = data as LinksEChartsType;

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
      const findOneInd = graphData.findIndex((link) => {
        return UVEnumArr.every(uv => link[uv] === willFindLink[uv]);
      });
      if (findOneInd !== -1) {

        setGraghData([
          ...graphData.slice(0, findOneInd),
          ...graphData.slice(findOneInd + 1),
        ]);
      }
    }
  });
  const onDblClick: onEChartsParam = ['dblclick', 'series', onDblClickFn];
  const textBipartiteGraph = useCreation(() => graphData ? (graphData.map(({ u, v }) => `${u} ${v}`).join('\n')) : '', [graphData]);
  // useMount(() => {
  //   console.log('hjx');
  // });
  return <Paper elevation={24} className={BCViz_newStyle['Main'] ?? ''}>
    <InitModal {...{ useFileName, useUVCount, setGraghData: resetGraghData }} />
    <SideCollapse isOpen={false}>
      <SideModifyNodeCount {...{ useUVCount }} />
    </SideCollapse>
    <Paper elevation={24} className={classNames(BCViz_newStyle['Main-Mid'], style['Mid'])} >
      <CommonCharts
        option={GraphChartsOption}
        onParams={[onDblClick, onClick]}
        style={{ '--minHeight': '90vh' } as CSSProperties}
        isPermitShowLoading={false} />
      <ConfirmModal text={textBipartiteGraph}
        fileName={fileName}
      />
    </Paper>
    <ReUndo graghDataHistoryTravel={graghDataHistoryTravel} />
    <Menu />
  </Paper>;
}

/*
1. 历史记录管理（indexedb）

*/