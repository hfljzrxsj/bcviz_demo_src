import { groupBy, mapValues, sortBy, isUndefined, keyBy, uniq, head, camelCase, last, map, isNil, reduce, first, without, forEach, negate } from 'lodash';
import getBit from './bit';
import { colors_ } from './colors';
import {
  type TooltipProps,
} from "@mui/material";
import type { OriginDataObj, OriginDataObjReadonlyArr, OriginGraphDataReadonlyArr, PosDataObj, dotNeighbor, indexNeighbor, typeOfGetCommonValueFromTableData, kInd, GraphNeighbor as GraphNeighbor, drawLineData, PosDataObjArr, pos, getCommonValueFromTableDataReturnType, LineSVGProps, CommonSVGProps, ClickCircleProps, SizeProps, SizeAndSetProps, getCommonValueFromTableDataParamers } from './types';
import classNames from "clsx";
import style from './_index.module.scss';
import { getTitle2Jsx } from '../BCViz_new/Echarts';
import debounce_mui from '@mui/utils/debounce';
import { debounce as debounce_algolia } from "@algolia/autocomplete-shared";
import { debounce as debounce_lodash } from 'lodash';
import { Modes } from '../BCViz_new/utils';
import { clickMultiDotColor, uvHighlightColor } from '../BCViz_new';
const { values, freeze, keys } = Object;

// export const getTitle = (split: Parameters<Array<string>['join']>[0]) => ({ k, kInd, v, neighbor }: PosDataObj) => [`vertex name: ${k + kInd}`,
// `maximum cohesion: ${v}`,
// `neighbors: ${neighbor?.map(({ k, kInd }) => `${k + kInd}`).join(', ')}`,
// ` Number of neighbors : ${neighbor?.length}`,].join(split);
export const enum UVenum {
  U = 'u',
  V = 'v',
}
export const UV = freeze({
  '0': UVenum.U,
  '1': UVenum.V,
});

export const marginSize = 32;
export const halfMarginSize = marginSize / 2;
export const getCommonValueFromTableData = (tableData: OriginDataObjReadonlyArr | undefined, {
  svgWidth,
  svgHeight,
}: {
  readonly svgWidth: number,
  readonly svgHeight: number,
}) => {
  const valuesArr = tableData?.map(({ v }) => v) ?? [];
  const min = Math.min(...valuesArr);
  const max = Math.max(...valuesArr);
  const diff = max - min;
  // const dataArr: [string, number, number][] = data.map((i, ind) => ([...i, ind]));
  const { length } = valuesArr;
  const realWidth = svgWidth - marginSize * 2;
  const realHeight = svgHeight - marginSize * 2;
  const xRadix = realWidth / (length - 1);
  const yRadix = realHeight / diff;
  const getYPos = (v: number) => marginSize + (max - v) * yRadix;
  return { valuesArr, min, max, diff, realHeight, xRadix, yRadix, length, getYPos, svgWidth, svgHeight };
};

export const uvIndObj = freeze({
  [UVenum.U]: 0,
  [UVenum.V]: 1,
});
export const uvLength = Object.keys(uvIndObj).length;
export const getOneDotNeighbor = (neighbor: dotNeighbor | undefined) => {
  if (!neighbor) {
    return {};
  }
  return {
    neighbor,
    // neighborCount: neighbor.length,
  };
};
const pushInNeighbor = (neighbor: indexNeighbor, kInd: kInd, k: UVenum, v: kInd) => (neighbor[kInd] || (neighbor[kInd] = [])).push({ k, kInd: v });
export const getInitGraphNeighbor = (): Record<UVenum, {}> => ({ [UVenum.U]: {}, [UVenum.V]: {} });
export const getGraphNeighbor = (graphData: OriginGraphDataReadonlyArr) => {
  const graphNeighbor: GraphNeighbor = getInitGraphNeighbor();
  const neighborU = graphNeighbor[UVenum.U];
  const neighborV = graphNeighbor[UVenum.V];
  for (const item of graphData) {
    const { u, v } = item;
    if (neighborU && neighborV && !isUndefined(u) && !isUndefined(v)) {
      pushInNeighbor(neighborU, u, UVenum.V, v);
      pushInNeighbor(neighborV, v, UVenum.U, u);
    }
  }
  return graphNeighbor;
};
export const getDataArrWithPos = (tableData: getCommonValueFromTableDataParamers[0], graphData: OriginGraphDataReadonlyArr | undefined, { xRadix, getYPos, svgWidth, max, min }: getCommonValueFromTableDataReturnType,
  graphSvgHeght: number,
) => {
  if (!graphData || !tableData) {
    return [];
  }

  // let start = performance.now();
  // const graphNeighbor_ = graphData.reduce((pre, cur) => {
  //   return reduce(cur, (preInner, curInner, key, cur) => {
  //     const uvKey = key as UVenum;
  //     const k = first(without(keys(cur), uvKey)) as UVenum;
  //     if (isUndefined(k)) {
  //       return preInner;
  //     }
  //     const preUVIndItem = preInner[uvKey];
  //     return {
  //       ...preInner,
  //       [uvKey]: {
  //         ...preUVIndItem,
  //         [curInner]: [
  //           ...(preUVIndItem?.[curInner] ?? []),
  //           // first(entries(pick(cur, pull(keys(cur), uvKey))).map(([k, kInd]) => ({  //也可以写成找到第一个符合的对象，再转换
  //           //   k, kInd,
  //           // }))),
  //           { k, kInd: cur[k] },
  //         ]
  //       }
  //     };
  //   }, pre);
  // }, {} as graphNeighbor);
  // console.log(performance.now() - start);

  // start = performance.now();
  const graphNeighbor: GraphNeighbor = getGraphNeighbor(graphData);
  // console.log(performance.now() - start);

  // console.log(JSON.stringify(graphNeighbor) === JSON.stringify(graphNeighbor_));

  const realWidth = svgWidth - marginSize * 2;
  const tableDataGroupByK = groupBy(tableData, ({ k }) => k) as unknown as Record<UVenum, OriginDataObjReadonlyArr>;
  const graphGroupDiffX = mapValues(tableDataGroupByK, ((v) => {
    return realWidth / (v.length - 1);
  })) as Record<UVenum, number>;//{u:6,v:6}
  const graphGroupDiffY = (graphSvgHeght - marginSize * 2) / (uvLength - 1);
  // console.log(.2, performance.now() - start);
  // const graphDiff=Object.fromEntries(Object.entries(graphGroupCount))

  // let start = performance.now();
  // const tableDataGroupByKSort = mapValues(tableDataGroupByK, (arr) => {
  //   return sortBy(arr, ({ kInd }) => kInd);
  // }) as (typeof tableDataGroupByK);
  // const dataArrWithPos_: PosDataObjArr = tableData?.map((oneData, i) => {
  //   const { v, k, kInd } = oneData;
  //   return ({
  //     ...oneData,
  //     i,
  //     x: marginSize + i * xRadix,  //x
  //     y: getYPos(v),  //y
  //     // graphX: marginSize + (kInd - 1) * graphGroupDiffX[k],
  //     graphX: marginSize + (tableDataGroupByKSort[k]?.indexOf(oneData)) * graphGroupDiffX[k],
  //     graphY: marginSize + uvIndObj[k] * graphGroupDiffY,
  //     ...getNeighbor(graphNeighbor?.[k][kInd])
  //   }) as PosDataObj;
  // });
  // console.log(performance.now() - start);

  // start = performance.now();
  const tableDataGroupToIndex = mapValues(tableDataGroupByK, (arr) => {
    return new Map(sortBy(arr, ({ kInd }) => kInd).map(({ kInd }, ind) => ([kInd, ind])));
  });
  // console.log(.2, performance.now() - start);

  // const graphDiff=Object.fromEntries(Object.entries(graphGroupCount))
  const dataArrWithPos: PosDataObjArr = tableData?.map((oneData, i) => {
    const { v, k, kInd } = oneData;
    return ({
      ...oneData,
      i,
      x: marginSize + i * xRadix,  //x
      y: getYPos(v),  //y
      // graphX: marginSize + (kInd - 1) * graphGroupDiffX[k],
      graphX: marginSize + (tableDataGroupToIndex[k].get(kInd) ?? 0) * graphGroupDiffX[k],
      graphY: marginSize + uvIndObj[k] * graphGroupDiffY,
      ...getOneDotNeighbor(graphNeighbor?.[k][kInd])
    }) as PosDataObj;
  });
  // console.log(performance.now() - start);
  // console.log(JSON.stringify(dataArrWithPos) === JSON.stringify(dataArrWithPos_));


  // forEach(tableDataGroupByK, (arr, key, tableDataGroupByK) => {
  //   const tableDataArrByKSort = sortBy(arr, ({ kInd }) => kInd);
  //   tableDataArrByKSort.forEach((oneData, i) => {
  //     const { v, k, kInd } = oneData;

  //     return ({
  //       ...oneData,
  //       i,
  //       x: marginSize + i * xRadix,  //x
  //       y: getYPos(v),  //y
  //       // graphX: marginSize + (kInd - 1) * graphGroupDiffX[k],
  //       // graphX: marginSize + (tableDataArrByKSort[k]?.indexOf(oneData)) * graphGroupDiffX[k],
  //       graphY: marginSize + uvIndObj[k] * graphGroupDiffY,
  //       ...getNeighbor(graphNeighbor?.[k][kInd])
  //     });
  //   });
  // });

  return dataArrWithPos;
};
export type getDataArrWithPosType = typeof getDataArrWithPos;
export type getDataArrWithPosParameters = Parameters<getDataArrWithPosType>;
export type getDataArrWithPosReturnType = ReturnType<getDataArrWithPosType>;
const highlightLevelArr = freeze(['more-highlight', 'highlight', 'no-highlight']);
const baseHighlightLevel = last(highlightLevelArr) ?? '';
const highlightLevelKeyArr = highlightLevelArr.map(i => camelCase(`is-${i}`)) as ReadonlyArray<keyof PosDataObj>;
const { length: highlightLevelArrLength } = highlightLevelArr;
export const getHighlightLevelNum = (obj: PosDataObj) => {
  const find = highlightLevelKeyArr.findIndex(i => obj[i] === true);
  return 1 << (find + 1);
};
export const initHighlightLevelNum = (1 << highlightLevelArrLength) - 1;
export const getHighlightLevel = (num: number) => {
  for (let i = 1; i < highlightLevelArrLength; i++) {
    if (getBit(num, i) === 1) {
      return highlightLevelArr[i - 1] ?? baseHighlightLevel;
    }
  }
  return baseHighlightLevel;
};
export const getHighlightLevelFromObj = (obj?: PosDataObj) => {
  // if (!obj) {
  //   return baseHighlightLevel;
  // }
  const find = highlightLevelKeyArr.findIndex(i => obj?.[i] === true);
  return highlightLevelArr[find] ?? baseHighlightLevel;
};
const getColor = (colors: ReadonlyArray<string | undefined>) => {
  if (colors.includes(clickMultiDotColor)
    && colors.includes(uvHighlightColor)
  ) {
    return uvHighlightColor;
  }
  if (colors.length !== 1) {
    return undefined;
  }
  const firstColor = head(colors);
  if (!firstColor) {
    return undefined;
  }
  return firstColor;
};
type GroupByDot = Record<UVenum, Record<OriginDataObj['kInd'], PosDataObj>>;
export const getGroupByDot = (drawDotData?: OriginDataObjReadonlyArr): GroupByDot => {
  const initGraphNeighbor = getInitGraphNeighbor();
  if ((isUndefined(drawDotData) || drawDotData.length === 0)) {
    return initGraphNeighbor;
  }
  return {
    ...initGraphNeighbor,
    ...mapValues(groupBy({
      ...drawDotData
    }, ({ k }) => k), (arr) => (keyBy(arr, ({ kInd }) => kInd)))
  } as GroupByDot;
};
// 二部图的线的颜色
export const getGraphLinkColor = (
  drawDotData?: PosDataObjArr,
  graphData?: OriginGraphDataReadonlyArr,
  groupByDot = getGroupByDot(drawDotData),
) => {
  if (!drawDotData || !graphData) {
    return [];
  }
  return graphData?.map((graph) => {
    const colors = uniq(map(graph, (v, k) => groupByDot[k as UVenum]?.[v]?.color));
    return getColor(colors);
  });
};
export const getGraphLineWithHighlightLevel = ({ drawDotData, graphData }: {
  readonly drawDotData: PosDataObjArr;
  readonly graphData?: OriginGraphDataReadonlyArr | undefined;
}) => {
  const groupByDot = mapValues(groupBy(drawDotData, ({ k }) => k), (arr) => (
    // mapValues(
    keyBy(arr, ({ kInd }) => kInd)
    // ([first]) => first,
    // )
  )) as Record<UVenum, Record<OriginDataObj['kInd'], PosDataObj>>;
  return graphData?.map((graph) => {

    const graphToDataObjArr = values(mapValues(graph, (v, k) => groupByDot[k as UVenum]?.[v]));
    const tempObj = graphToDataObjArr.reduce((pre, cur, ind, arr) => {
      const { pos, highlightLevelNum } = pre;
      if (!cur) {
        return pre;
      }
      const { graphX, graphY, color } = cur;
      return {
        pos: [...pos, [graphX, graphY]] as pos,
        highlightLevelNum: highlightLevelNum & getHighlightLevelNum(cur),
        // color: (arr[0]?.color === arr[1]?.color ? color : '') ?? "",
      };
    }, { pos: [], highlightLevelNum: initHighlightLevelNum, color: '' } as {
      readonly pos: pos;
      readonly highlightLevelNum: number;
      // readonly color: string;
    });
    const { highlightLevelNum } = tempObj;
    const colors = uniq(graphToDataObjArr.map((item) => {
      if (!item?.color) {
        return '';
      }
      return item.color;
    }));
    return {
      ...tempObj,
      highlightLevel: getHighlightLevel(highlightLevelNum),
      ...(colors.length === 1 ? { color: head(colors) } : null),
      // color: (arr ? color : '') ?? "",
    };
  });
};
// export const initClickLineVal = undefined;
// export let clickLineVal: StoreType['size'] = initClickLineVal;

export const getNumFromData = (data: PosDataObj) => data.v;
const colorLength = colors_.length;
export const doubleClickCircleFn = ({
  isEditX,
  dataArrWithPos: drawDotData,
  commonValueFromTableData: {
    length
  },
  // dotData,
  size,
  // setSize,
}: ClickCircleProps
  // & {
  // readonly dotData?: PosDataObj;
  // }
): PosDataObjArr => {

  // if (dotData) {
  // toast(getTooltipTitle(dotData));
  // }
  // if (isNil(v)) {
  //   return drawDotData;
  // }
  if (!isEditX) {
    // clickLineVal = initClickLineVal;
    // setSize?.(initClickLineVal);
    // return (drawDotData.map(i => {
    //   return {
    //     ...i,
    //     color: '',
    //     isHighlight: isCancel ? false : (i.v >= v),
    //   };
    // }));
    return drawDotData;
  }
  const isCancel = isNil(size);
  if (isCancel) {
    // clickLineVal = initClickLineVal;
    // setSize?.(initClickLineVal);
    return (drawDotData.map(i => {
      return {
        ...i,
        color: '',
        isHighlight: isCancel ? false : (i.v >= size),
      };
    }));
  }

  // clickLineVal = size;
  // setSize?.(v);
  const willSetDrawDotData: PosDataObj[] = [];
  let colorInd = 0;
  let startData = head(drawDotData);
  if (!startData) {
    return drawDotData;
  }
  let startVal = getNumFromData(startData);
  const drawLineData: drawLineData = [];
  for (let i = 1; i <= length; i++) {
    const drawDotDataGroupByV = [startData];
    // while (i < length) {
    // }
    for (; i < length; i++) {
      const curData = drawDotData[i];
      if (!curData) {
        break;
      }
      const curVal = getNumFromData(curData);
      if (curVal >= size || curVal >= startVal) {
        drawDotDataGroupByV.push(curData);
        startData = curData;
        startVal = curVal;
      } else {
        startData = curData;
        startVal = curVal;
        break;
      }
      // curData = drawDotData[++i];
      // curVal = getNumFromData(curData);
    }
    const color = colors_[(colorInd) % colorLength] ?? '';
    willSetDrawDotData.push(...drawDotDataGroupByV.map(data => color ? ({
      ...data,
      color,
    }) as PosDataObj : data));
    colorInd++;
  }

  return (willSetDrawDotData.map(i => {
    return (i.v >= size) ? {
      ...i,
      isHighlight: true,
    } : i;
  }));
  // return v;
};
type PosDataObjArrNotReadonly = PosDataObj[];
type DrawDotDataSection = PosDataObjArr[];
export interface VisualMapSectionSingle {
  readonly start: number;
  readonly end: number;
  readonly color: (typeof colors_)[number];
}
export type VisualMapSection = ReadonlyArray<VisualMapSectionSingle>;
export const doubleClickCircleFnForECharts = (props: ClickCircleProps
) => {
  const {
    isEditX,
    dataArrWithPos: drawDotData,
    commonValueFromTableData: {
      length
    },
    size,
    colors = colors_,
  } = props;
  if (!isEditX) {
    return { datas: drawDotData, sections: [] };
  }
  const isCancel = isNil(size);
  if (isCancel) {
    return { datas: drawDotData, sections: [] };
  }
  const willSetDrawDotData: PosDataObjArrNotReadonly = [];
  let colorInd = 0;
  const drawDotDataSections: DrawDotDataSection = [];  //分成区间
  const visualMapSection: VisualMapSectionSingle[] = [];
  // example2 size=6
  const drawDotDataGroupByV: PosDataObjArrNotReadonly = [];
  const drawDotDataSection: number[] = [];
  for (let i = 0; i < length; i++) {
    const curData = drawDotData[i];
    if (!curData) {
      break;
    }
    const curVal = getNumFromData(curData);
    const nextData = drawDotData[i + 1];
    const datasPushFunc = () => {
      drawDotDataGroupByV.push(curData);
      drawDotDataSection.push(i);
    };
    const doubleClickCircleFnForEChartsSubFunc = () => {
      if (curVal >= size) {
        datasPushFunc();
        const color = colors[colorInd % colorLength] ?? '';
        drawDotDataSections.push(drawDotDataGroupByV);
        visualMapSection.push({
          start: head(drawDotDataSection) ?? 0,
          end: last(drawDotDataSection) ?? 0,
          color,
          // datas:drawDotDataGroupByV,
        });
        willSetDrawDotData.push(...drawDotDataGroupByV.map(i => color ? ({
          ...i,
          color,
        }) : i));
        drawDotDataGroupByV.length = 0;
        drawDotDataSection.length = 0;
        colorInd++;
        return 1;
      } else {
        willSetDrawDotData.push(curData);
        return 0;
      }
    };
    if (!nextData) {  //v8
      doubleClickCircleFnForEChartsSubFunc();
      break;
    }
    const nextVal = getNumFromData(nextData);
    if (nextVal >= size) { //u1,v3
      datasPushFunc();
    } else {  //v1
      doubleClickCircleFnForEChartsSubFunc();
    }
  }
  return { datas: willSetDrawDotData, sections: drawDotDataSections, visualMapSection: (visualMapSection as VisualMapSection), };
};
export const clickCircleFn = (({ isEditX }: ClickCircleProps) => (data: PosDataObj) => () => {
  if (!isEditX) {
    return;
  }
  // toast(getTooltipTitle(data));
  // const { i, isMoreHighlight } = data;
  // setDrawDotData([
  //   ...drawDotData.slice(0, i),
  //   {
  //     ...data,
  //     isMoreHighlight: !isMoreHighlight,
  //   },
  //   ...drawDotData.slice(i + 1),
  // ]);
});
// const getTooltipTitle = getTitle('\t\r\n');
export const getTooltipProps = (obj: PosDataObj): Omit<TooltipProps, 'children'> => ({
  title: getTitle2Jsx(obj),
  arrow: true,
});
const getSvgSizeEitherDom = ({ clientWidth, clientHeight }: {
  readonly clientWidth: number,
  readonly clientHeight: number;
}) => {
  const xEnd = clientWidth - marginSize;
  const yEnd = clientHeight - marginSize;
  return { svgWidth: clientWidth, svgHeight: clientHeight, xEnd, yEnd };
};

export const getSvgSize = (svgRef: LineSVGProps['svgRef']) => () => {
  const { current: svgDom } = svgRef;
  if (!svgDom) {
    return getSvgSizeEitherDom({ clientWidth: innerWidth, clientHeight: innerHeight });
  };
  return getSvgSizeEitherDom(svgDom);
};
export const getSVGGClassNames = (obj: PosDataObj) => classNames(style['g'],
  style[getHighlightLevelFromObj(obj)],
);
export const clickToSetSize = ({ isEditX, setSize, size,
  // drawDotData,
}: SizeAndSetProps): CommonSVGProps['doubleClickCircle'] => (({ dotData, v = dotData?.v }) => () => {
  if (isEditX) {
    setSize?.(v === size ? undefined : v);
  }
  // return drawDotData;
});
export const debounce = <T extends Parameters<typeof debounce_lodash>[0]> (fn: T) => debounce_mui(debounce_lodash(debounce_algolia(fn, 0)));;

export const isEditXFunc = (mode: Modes) => {
  return mode === Modes['Hierarchical Subgraphs Search'];
};