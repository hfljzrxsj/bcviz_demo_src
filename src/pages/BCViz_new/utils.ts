import { getIdb, type IndexedDBGetProps, type IndexedDBProps } from "@/utils/idb";
import { isPROD } from "@/utils/isEnv";
import { clamp, groupBy, head, isPlainObject, isUndefined, mapValues, orderBy, sortBy } from "lodash";
import type { execTextType, UVReturnType } from "./api";
import { tanColorContentJsx } from "./Echarts";
import type { getCommonValueFromTableDataParamers, getCommonValueFromTableDataReturnType, GraphNeighbor, OriginDataObj, OriginDataObjReadonlyArr, OriginDataObjWithIndexArr, OriginGraphDataReadonlyArr, PosDataObj, PosDataObjArr, typeOfGetCommonValueFromTableData } from "../BCviz/types";
import { getCommonValueFromTableData, getDataArrWithPos, getGraphNeighbor, getGroupByDot, getInitGraphNeighbor, getOneDotNeighbor, marginSize, UVenum, uvIndObj, uvLength, type getDataArrWithPosParameters, type getDataArrWithPosType, type VisualMapSectionSingle } from "../BCviz/utils";
import { clickMultiDotColor, showAllCount } from ".";

const { freeze, entries, values } = Object;
const { max } = Math;
export const isUseIdbCache = <T = object> (res: T | undefined): res is T => Boolean((isPROD || true) && res && isPlainObject(res));

export const enum Modes {
  'Maximum Biclique' = 'Maximum Biclique',
  'Maximal Biclique Enumeration' = 'Maximal Biclique Enumeration',
  '(p,q)-biclique Counting' = '(p,q)-biclique Counting',
  'Hierarchical Subgraphs Search' = 'Hierarchical Subgraphs Search',
}
export const ModesShortcut: Record<Modes, string> = freeze(({
  'Maximum Biclique': 'MEB',
  'Maximal Biclique Enumeration': 'MBE',
  '(p,q)-biclique Counting': 'PQB',
  'Hierarchical Subgraphs Search': '',
}));
export const idbCommonArgs: IndexedDBProps = freeze({
  DBname: 'HJX',
  storeName: 'HXJ',
});
export const getFileIdb = <T> (query: NonNullable<IndexedDBGetProps['query']>) => getIdb<T>({
  ...idbCommonArgs,
  query
}).then(res => {
  if (isUseIdbCache(res)) {
    return res;
  }
  throw new Error(res);
});

// MBE、PQB

export const enum TabKey {
  table,
  graph,
  result,
  all,
}
export const TabKeyToName: Partial<Record<TabKey, string>> = freeze({
  [TabKey.table]: "Cohesion",

});
export const getTooltipTitle = (option: execTextType) => {
  return entries(option).map(tanColorContentJsx);
};
export const tanContentClass = 'tanContent';

export const getDotName = (obj: OriginDataObj | string) => {
  if (typeof obj === 'string') {
    return obj;
  }
  const { k, kInd } = obj;
  return `${k}${kInd}`;
};
export const getDataArrWithPosMutilDotsColor = (dataArrWithPos: PosDataObjArr, multiDots?: OriginDataObjReadonlyArr) => {
  if (!multiDots || multiDots.length === 0) {
    return dataArrWithPos;
  }
  const groupByDotMutilDots = getGroupByDot(multiDots);
  const dataArrWithPosMutilDotsColor: PosDataObjArr = dataArrWithPos?.map(item => {
    const { k, kInd } = item;
    const color: PosDataObj['color'] = groupByDotMutilDots[k][kInd] ? clickMultiDotColor : undefined;
    return color ? ({
      ...item,
      color,
    }) as PosDataObj : item;
  });
  return dataArrWithPosMutilDotsColor;
};
export const minRadius = 40;
export const maxRadius = 80;
export const getSymbolSize = (v: number, bool?: unknown) => clamp(bool ? v * 5 : v, minRadius, maxRadius);
function calculateCirclePositions (radii: OriginDataObjReadonlyArr, UV?: UVReturnType): ReadonlyArray<number> {
  if (radii.length === 0) return [];
  const clampedRadii: ReadonlyArray<number> = radii.map(({ v, k, kInd }) => getSymbolSize(v, UV?.[k].includes(kInd)));
  const firstR = head(clampedRadii);
  if (isUndefined(firstR)) {
    return [];
  }
  const positions: Array<number> = [firstR];
  for (let i = 1; i < clampedRadii.length; i++) {
    const prevPosition = positions[i - 1];
    const prevRadius = clampedRadii[i - 1];
    const currentRadius = clampedRadii[i];
    if (isUndefined(prevPosition) || isUndefined(prevRadius) || isUndefined(currentRadius)) {
      return [];
    }
    positions.push(prevPosition + prevRadius + maxRadius + currentRadius);
  }

  return positions;
}
export const getDataArrWithPosForECharts: getDataArrWithPosType = (tableData, graphData, { xRadix, getYPos, svgWidth },
  graphSvgHeght,
) => {
  if (!graphData || !tableData) {
    return [];
  }
  const graphNeighbor: GraphNeighbor = getGraphNeighbor(graphData);
  const realWidth = svgWidth - marginSize * 2;
  const tableDataGroupByK = groupBy(tableData, ({ k }) => k) as unknown as Record<UVenum, OriginDataObjReadonlyArr>;
  const graphGroupDiffY = (graphSvgHeght - marginSize * 2) / (uvLength - 1);
  const tableDataGroupToIndex = mapValues(tableDataGroupByK, (arr) => {
    return new Map(sortBy(arr, ({ kInd }) => kInd).map(({ kInd }, ind) => ([kInd, ind])));
  });
  const graphXs = mapValues(tableDataGroupByK, arr => calculateCirclePositions(arr));
  // console.log((graphXs), tableDataGroupByK);
  const diffY = max(...(values(graphXs).flat())) / 2;
  const dataArrWithPos: PosDataObjArr = tableData?.map((oneData, i) => {
    const { v, k, kInd } = oneData;
    return ({
      ...oneData,
      i,
      graphX: graphXs[k][tableDataGroupToIndex[k].get(kInd) ?? 0],
      graphY: marginSize + uvIndObj[k] * diffY,
      ...getOneDotNeighbor(graphNeighbor?.[k][kInd])
    }) as PosDataObj;
  });
  return dataArrWithPos;
};

export const findTopInOrder = (array: OriginDataObjWithIndexArr): OriginDataObjWithIndexArr => {
  // 1. 将元素与索引绑定（防止重复值干扰）

  // 2. 按值降序排序，取前20个最大的元素
  // const sortedByValue = orderBy(indexedArray, 'value', 'desc');
  const sortedByValue = sortBy(array, ({ v }) => v);
  const topEntries = sortedByValue.slice(showAllCount * -1);

  // 3. 按原顺序排序（通过索引升序）
  const sortedByOriginalOrder = sortBy(topEntries, ({ i }) => i);

  // 4. 提取值
  return sortedByOriginalOrder;
};

export const getTableDataWithIndOrFilter = ((isShowAll: boolean, tableData?: OriginDataObjReadonlyArr,): OriginDataObjWithIndexArr => {
  if (!tableData) {
    return [];
  }
  if (isShowAll) {
    return tableData as OriginDataObjWithIndexArr;
  }
  const tableDataWithInd: OriginDataObjWithIndexArr = tableData.map((item, i) => ({
    ...item,
    i,
  }));
  if (tableData.length <= showAllCount) {
    return tableDataWithInd;
  }
  return findTopInOrder(tableDataWithInd);
});
// export const isNotEmptyArr = (arr: ReadonlyArray<unknown> | undefined) => !isUndefined(arr) && Array.isArray(arr) && arr.length > 0;

export const getDataArrWithPosWithCommonValueFromTableData = (tableData: getDataArrWithPosParameters[0], graghData: getDataArrWithPosParameters[1], {
  svgWidth, svgHeight,
}: Pick<getCommonValueFromTableDataReturnType, 'svgWidth' | 'svgHeight'>) => {
  return getDataArrWithPos(tableData, graghData, getCommonValueFromTableData(tableData, {
    svgWidth, svgHeight,
  }), svgHeight);
};
export const getDataArrWithPosWithCommonValueFromTableDataForECharts = (tableData: getDataArrWithPosParameters[0], graghData: getDataArrWithPosParameters[1], {
  svgWidth, svgHeight,
}: Pick<getCommonValueFromTableDataReturnType, 'svgWidth' | 'svgHeight'>) => {
  return getDataArrWithPosForECharts(tableData, graghData, getCommonValueFromTableData(tableData, {
    svgWidth, svgHeight,
  }), svgHeight);
};
export const svgWH = freeze({
  svgHeight: innerHeight,
  svgWidth: innerWidth
});

export const TabKey2Title: Record<TabKey, string> = freeze({
  [TabKey.table]: 'Maximum Cohesion',
  [TabKey.graph]: "Bipartite Graph",
  [TabKey.result]: "Search Result",
  [TabKey.all]: 'All'
});

export const dataArrWithPosDrawColorWithVisualMapSection = (dataArrWithPos: PosDataObjArr, visualMapSectionSingle?: VisualMapSectionSingle) => {
  if (!visualMapSectionSingle) {
    return dataArrWithPos;
  }
  const { start, end, color } = visualMapSectionSingle;

  return dataArrWithPos.map((data, ind) => (ind >= start && ind <= end) ? ({
    ...data,
    color,
  }) : data);
  // for (let i = start; i <= end; i++) {
  //   const obj = dataArrWithPos[i];
  //   if (obj) {
  //     obj.color = color;
  //   }
  // }

};

export const arrayLengthBigThanNum = (num: number | undefined, compareNum: number) => {
  return !isUndefined(num) && num >= compareNum;
};