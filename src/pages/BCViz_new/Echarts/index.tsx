import { useMemo, type ReactNode, type CSSProperties, useDeferredValue } from "react";
import type { DataArrWithPos, HSSProps, OriginGraphDataReadonlyArr, OriginGraphDataSuper, OriginGraphDataSuperArr, OriginGraphDataSuperReadonlyArr, PosDataObj, PosDataObjArr, SVGChartsProps, SetStateType, getCommonValueFromTableDataReturnType } from "@/pages/BCviz/types";
import { UVenum, clickToSetSize, doubleClickCircleFnForECharts, getCommonValueFromTableData, getDataArrWithPos, getGraphLinkColor, isEditXFunc, type VisualMapSection } from "@/pages/BCviz/utils";
import { TabKey, TabKey2Title, getDataArrWithPosWithCommonValueFromTableData, getDotName, getFileIdb, getSymbolSize, maxRadius, minRadius, svgWH, tanContentClass } from "../utils";
import CommonCharts, { resizeEvent, type AxisPointerComponentOption, type EChartsOption, type GraphSeriesOption, type LineSeriesOption, type MarkAreaComponentOption, type TooltipComponentOption, type onEChartsParam, type onEChartsParamFunc } from "../CommonECharts";
import { freeze } from "immer";
import { clamp, debounce, head, isUndefined, last, map, negate, uniq, without } from "lodash";
import { renderToStaticMarkup } from "react-dom/server";
import { Modes } from "../utils";
import type { InputSTSetState } from "../InputST";
import { ToastContainer, toast } from 'react-toastify';
import type { UseSetInputST } from "../TabPanelInput/TabPanelInput";
import type { execTextType } from "../api";
import ChartsTabPanel from "../ChartsPaper";
import { useDebounceFn, useLockFn, useMemoizedFn, usePrevious, useSafeState, useUpdateEffect, } from 'ahooks';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { Paper } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select
  // ,{ type SelectChangeEvent }
  from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import style from './_index.module.scss';
import { showAllCount } from "..";
//@ts-expect-error
import echartsGlobalDefault from 'echarts/lib/model/globalDefault';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const echartsColors: ReadonlyArray<string> = echartsGlobalDefault.color;

import type { SuperDataType } from "../mockJs";
import { waitLastEventLoop, waitMiddleEventLoop } from "@/utils";
import FullScreenChart from "../FullScreenChart";
const { isSafeInteger, isNaN, isFinite } = Number;
const { min, max } = Math;
const { isArray, from } = Array;

const isUseForce = false;

type tanColorContentJsxParam = Readonly<[string | undefined, ReactNode]>;
export const tanColorContentJsx = ([k, v]: tanColorContentJsxParam) => (<div key={k}>
  <span>{`${k}: `}</span>
  <span className={tanContentClass}>{v?.toString()}</span>
</div>
);
const silceArrNum = 4;

const silceArr = <T,> (arr: ReadonlyArray<T>, num: number) => {
  if (arr.length > num) {
    return arr.slice(0, num);
  }
  return arr;
};
type RenderArrFuncReturn = ReadonlyArray<tanColorContentJsxParam>;
const renderArrFunc = ({ k, kInd, v, neighbor, color }: PosDataObj) => ([
  ['Vertex Name', `${k + kInd}`],
  ['Maximum Cohesion', `${v}`],
  (isUndefined(neighbor) ? undefined : ['Neighbors', `${silceArr(neighbor, silceArrNum).map(({ k, kInd }) => `${k + kInd}`).join(', ')}${neighbor.length > silceArrNum ? '...' : ''}`]),
  ['Vertex Degree', `${neighbor?.length}`,],
]) as RenderArrFuncReturn;
const renderArrFuncSuper: typeof renderArrFunc = (posDataObj: PosDataObj) => {
  const { k, kInd, v, neighbor, color } = posDataObj;
  return ([renderArrFunc(posDataObj)[0],
  ['Contain Vertices', `${v}`],
  ]) as RenderArrFuncReturn;
};
export const getTitle2Jsx = (posDataObj: PosDataObj, mode?: Modes, renderFunc = renderArrFunc) => {
  const { k, kInd, v, neighbor, color } = posDataObj;
  return (<>
    {
      (color && mode && !isEditXFunc(mode)) ? <>
        <div>
          <span className={tanContentClass}>fetch {mode} result</span>
        </div>
        <br />
      </> : null
    }
    {
      (renderFunc(posDataObj)).filter(Boolean).map(tanColorContentJsx)
    }
  </>);
};

export const getTitle2JsxString: (...args: Parameters<typeof getTitle2Jsx>) => string = (...args) => renderToStaticMarkup(getTitle2Jsx(...args));
// export const getTitle2JsxStringForSuper: (...args: Parameters<typeof getTitle2Jsx>) => string = (...args) => renderToStaticMarkup(getTitle2JsxForSuper(...args));
const commonTooltipOption: TooltipComponentOption = ({
  trigger: 'item',
  axisPointer: {
    type: 'cross', // 十字准线辅助显示数据
  },
  label: {
    show: true // 显示坐标值
  },
});
const commonSeriesOption: GraphSeriesOption | LineSeriesOption = freeze({
  label: {
    show: true,
    // position: 'right',
    // formatter: '{b}'
  },
  roam: true,
});
const commonEChartsOption: EChartsOption = ({
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {},
      restore: {},
      dataView: {
        // optionToContent () {
        //   console.log(arguments);
        //   return '';

        // }
      },
      dataZoom: {},
      magicType: {
        // type: ["line", "bar", "stack"]
      },
      brush: {},
    },
  },
});
const commonAxisPointerOption: AxisPointerComponentOption = freeze({
  // axisLabel: {
  //   show: true,
  // },
  // axisPointer: {
  show: true,
  snap: true,
  // handle: {
  //   show: true,
  // }
  // }
});
const opacityToBlack = (opacity: number) => `rgba(0,0,0,${opacity})`;
const shadowColor5 = opacityToBlack(.5);
const shadowColor3 = opacityToBlack(.3);
const commonEmphasisOption: (GraphSeriesOption
  & LineSeriesOption)['emphasis'] = ({
    lineStyle: {
      // width: 4,
      shadowColor: shadowColor5,
      shadowBlur: 10,
      // color:'red',
    },
    scale: true,
    label: {
      show: true,
      fontSize: 24,
      fontWeight: 'bolder',
      textShadowBlur: 5,
      textShadowColor: shadowColor3,
    },
    labelLine: {
      show: true
    },
    itemStyle: {
      shadowColor: shadowColor3,
      shadowBlur: 10,
      // shadowOffsetY: 8
    },

  });
const getSymbolSizeMaxMin = ({ isBiggerThanShowAllCount, maxV, minV, dataArrWithPos }: {
  readonly isBiggerThanShowAllCount: boolean,
  readonly maxV: number,
  readonly minV: number,
  readonly dataArrWithPos: PosDataObjArr;
}) => {
  if (isBiggerThanShowAllCount) {
    return { symbolSizeMax: maxV, symbolSizeMin: minV };
  }
  const neighborsVertex = dataArrWithPos.map(({ neighbor }) => neighbor?.length) as ReadonlyArray<number>;
  const symbolSizeMin = min(...neighborsVertex);
  const symbolSizeMax = max(...neighborsVertex);
  return { symbolSizeMax, symbolSizeMin };
};
const getLineStyleWidthFunc = (isBiggerThanShowAllCount: boolean, superWidthArr: ReadonlyArray<number>): (e: number) => number => {
  if (isBiggerThanShowAllCount) {
    const arr = superWidthArr as ReadonlyArray<number>;
    const minWidth = min(...arr);
    const maxWidth = max(...arr);
    const maxRadius = 10;
    const minRadius = 1;
    const superWidthBase = (maxRadius - minRadius) / (maxWidth - minWidth);
    const getLineStyleWidth = (width: number) => (width - minWidth) * superWidthBase + minRadius;
    return getLineStyleWidth;
  } else {
    return (e: number) => e;
  }
};
const getGraphOption = (dataArrWithPos: PosDataObjArr | undefined, graphData: OriginGraphDataSuperReadonlyArr | undefined, mode?: Modes, size: execTextType['size'] = undefined, { max: maxV, min: minV } = getCommonValueFromTableData(dataArrWithPos, svgWH), isBiggerThanShowAllCount = false): EChartsOption => {
  if (!dataArrWithPos || !graphData) {
    return {};
  }
  const graphLinkColor = getGraphLinkColor(dataArrWithPos, graphData);
  // console.log(symbolSizeBase, minRadius, maxV, minV);
  // const isBiggerThanShowAllCount = dataArrWithPos.length > showAllCount;
  const { symbolSizeMax, symbolSizeMin } = getSymbolSizeMaxMin({ isBiggerThanShowAllCount, maxV, minV, dataArrWithPos });
  const symbolSizeBase = (maxRadius - minRadius) / (symbolSizeMax - symbolSizeMin);
  const getSymbolSize = (symbolSizeMax === symbolSizeMin || isNaN(symbolSizeBase) || !isFinite(symbolSizeBase)) ? () => minRadius : (v: number) => (v - symbolSizeMin) * symbolSizeBase + minRadius;
  const superWidthArr = uniq(graphData.map(({ superWidth }) => superWidth)) as Parameters<typeof getLineStyleWidthFunc>[1];
  const getLineStyleWidth = getLineStyleWidthFunc(isBiggerThanShowAllCount, superWidthArr);


  const option = ({
    ...commonEChartsOption,
    tooltip: {
      // position: 'top'
    },
    // animationDurationUpdate: 1500,
    // animationEasingUpdate: 'quinticInOut',
    legend: {
      data: [UVenum.U, UVenum.V]
    },
    series: [
      {
        type: 'graph',
        // symbolSize: 30,
        ...commonSeriesOption,
        tooltip: {
          ...commonTooltipOption,
          formatter (obj, backupStr, cb) {
            const { dataType, dataIndex, data, name } = obj;

            if (dataType === 'edge') {
              //@ts-expect-error
              const { source, target, superWidth } = data;
              return [name, superWidth].filter(Boolean).join('<br/>');
            }
            // if ('dataIndex' in obj) {
            const posObj = dataArrWithPos[dataIndex];
            if (posObj) {
              return getTitle2JsxString(posObj, mode, isBiggerThanShowAllCount ? renderArrFuncSuper : renderArrFunc);
            }
            // }
            return backupStr;
          }
        },
        // animation: false,
        ...(isUseForce ? {
          layout: 'force',
          force: {
            // edgeLength: 5,
            // repulsion: 20,
            // gravity: 0.2
          },
        } : null),
        categories: [{
          name: UVenum.U,
          base: UVenum.U
        }, {
          name: UVenum.V,
          base: UVenum.V
        }],
        // circular: {
        //   rotateLabel: true
        // },
        //edgeSymbol: ['circle', 'arrow'],
        //edgeSymbolSize: [4, 10],
        edgeLabel: {
          //fontSize: 20
        },
        data: dataArrWithPos.map((dotData) => {
          const { k, kInd, graphX, graphY, v, color, neighbor } = dotData;
          const symbolSize = getSymbolSize(isBiggerThanShowAllCount ? v : neighbor?.length ?? v);
          return ({
            name: getDotName(dotData),
            value: v,
            category: k,
            ...(isUseForce ? null : {
              symbolSize,
              // getSymbolSize(v, color),
            }),

            ...(isUseForce ? {} : {
              x: graphX,
              y: graphY
            }),
            ...(color ? {
              itemStyle: {
                color,
              },
              label: {
                fontWeight: 'bolder',
                textShadowBlur: 5,
                // textShadowColor: shadowColor5,
              }
            } : null),
            // x: kInd * 60,
            // y: k === UVenum.U ? 0 : length * 50
          }) as NonNullable<GraphSeriesOption['data']>[number];
        }),
        // links: [],
        links: graphData?.map(({ u, v, superWidth }, ind) => {
          const color = graphLinkColor[ind];
          return ({
            source: `u${u}`,
            target: `v${v}`,
            lineStyle: {
              ...(isUndefined(superWidth) ? null : {
                width: getLineStyleWidth(superWidth),
              }),

              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: echartsColors[0] // 0% 处的颜色
                }, {
                  offset: 1, color: echartsColors[1] // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              ...(color ? {
                color: graphLinkColor[ind],
                width: 4,
              } : null)
            },
            // graphLinkColor[ind]
            superWidth,
          } as NonNullable<GraphSeriesOption['links']>[number]);
        }) as GraphSeriesOption['links'],
        lineStyle: {
          // width:1,
          // color: 'source',
          // curveness: 0.3,
          opacity: 1,
          cap: 'round',
          join: 'round',
          shadowColor: shadowColor3,
          shadowBlur: 5,
          // color: "#000"
        },
        itemStyle: {
          shadowColor: shadowColor3,
          shadowBlur: 5,
        },
        emphasis: {
          focus: 'adjacency',
          ...commonEmphasisOption,
        },
        // label: {
        //   show: dataArrWithPos.length < showAllCount,
        // }
      }
    ],
  } as EChartsOption);
  return option;
};
type LineDataItemOption = NonNullable<LineSeriesOption["data"]>[number];
const getLineItemOptionFromColor = (color: PosDataObj['color']): LineDataItemOption & object => (color ? {
  itemStyle: {
    color,
    shadowColor: shadowColor3,
    shadowBlur: 16,
  },
  symbolSize: 16,
  symbol: 'circle',
} : {});
export const inputLabels: Readonly<Partial<Record<Modes, InputSTSetState>>> = freeze({
  [Modes['Maximum Biclique']]: {
    s: 'Minimum vertex count in U',
    t: 'Minimum vertex count in V'
  },
  [Modes['Maximal Biclique Enumeration']]: {
    s: 'Minimum vertex count in U',
    t: 'Minimum vertex count in V'
  },
  [Modes['(p,q)-biclique Counting']]: {
    s: 'Vertex number in U',
    t: 'Vertex number in V'
  },
});
const toastEmpty = debounce(() => {
  toast.warn('result is empty');
});
const getKey = (TabKey: TabKey) => {
  // const a = sha1().update([Echarts.name, TabKey]).digest('hex');
  // const a = `${new Error().stack}${TabKey}`;
  return `${Echarts.name}${TabKey}`;
};
type typeofTabKey2Title = typeof TabKey2Title;
type AllShowEChartsKey = typeofTabKey2Title[keyof typeofTabKey2Title];

type AllShowEChartsKeyArr = ReadonlyArray<TabKey>;
const initAllShowEChartsKeyArr = [TabKey.table, TabKey.graph,];
const allShowEChartsKeyArr: AllShowEChartsKeyArr = [...initAllShowEChartsKeyArr,
TabKey.result
];
const toastId = 'leastOneChart';
const filterUndefined = <T,> (arr: ReadonlyArray<T>) => arr.filter(negate(isUndefined));
const filterToLength = (arr: ReadonlyArray<unknown>) => filterUndefined(arr).length;
export default function Echarts (props: {
  readonly graphData: OriginGraphDataReadonlyArr;
  readonly resultGraph: OriginGraphDataReadonlyArr | undefined;
  readonly selectMode: Modes;
  readonly useSetInputST: UseSetInputST;
  readonly setTab: SetStateType<TabKey>;
  readonly resultTable: PosDataObjArr | undefined;
  readonly clickEChartDotToAddMultiDots: onEChartsParamFunc;
  readonly superData?: SuperDataType | undefined;
  readonly visualMapSection: VisualMapSection | undefined;
} & HSSProps & SVGChartsProps) {
  const { dataArrWithPos, visualMapSection, graphData, size, resultGraph,
    selectMode, useSetInputST,
    setTab, resultTable,
    setSize, isEditX,
    commonValueFromTableData,
    clickEChartDotToAddMultiDots,
    superData,
  } = props;
  const isNotGetResult = isUndefined(size);

  // const { dataArrWithPos, visualMapSection, sections } = useMemo(() => {
  //   if (isEditX) {
  //     const { datas, visualMapSection, sections } = doubleClickCircleFnForECharts({ ...props });
  //     return { dataArrWithPos: datas, visualMapSection, sections };
  //   }
  //   return { dataArrWithPos: dataArrWithPosNotWithColor };
  // }, [dataArrWithPosNotWithColor]);
  const lineChartsOption = useMemo(() => {
    if (!dataArrWithPos) {
      return;
    }
    // const { min, max, valuesArr } = commonValueFromTableData;
    return ({
      ...commonEChartsOption,
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ],
      tooltip: {
        ...commonTooltipOption,
        formatter (obj, backupStr) {
          if ('dataIndex' in obj) {
            const posObj = dataArrWithPos[obj['dataIndex']];
            if (posObj) {
              // return getTitle('<br/>')(posObj);
              return getTitle2JsxString(posObj, selectMode);
            }
          }
          return backupStr;
        }
      },
      xAxis: {
        type: 'category',
        data: dataArrWithPos.map(getDotName),
        axisPointer: commonAxisPointerOption,
      },
      yAxis: {
        type: 'value',
        axisPointer: commonAxisPointerOption,
      },
      series: [
        {
          ...commonSeriesOption,
          data: dataArrWithPos.map(({ v, color }) => ({
            value: v,
            ...getLineItemOptionFromColor(color),
          }) as LineDataItemOption),
          type: 'line',
          emphasis: {
            focus: 'self',
            ...commonEmphasisOption,
          },
          symbolSize: 8,
          // markPoint: {
          //   data: dataArrWithPos.filter(({color})=>color)
          // },
          ...((isEditX && !isNotGetResult && visualMapSection) ? {
            markLine: {
              symbol: ['circle', 'circle'],
              data: [{
                yAxis: size,
                // symbol: 'circle',
              }],
            },
            markArea: ({
              animation: true,
              data: visualMapSection.map(({ start, end, color }, ind) => {
                const startData = dataArrWithPos[start];
                const endData = dataArrWithPos[end];
                const name = `${startData?.k}${startData?.kInd}~${endData?.k}${endData?.kInd}`;
                const itemStyle: MarkAreaComponentOption['itemStyle'] = {
                  color,
                  opacity: .03,
                };
                const label: MarkAreaComponentOption["label"] = {
                  show: true,
                  formatter: name,
                  position: 'insideBottom',
                  color: '#000',
                };
                const emphasis: MarkAreaComponentOption['emphasis'] = {
                  label,
                  itemStyle: {
                    opacity: .05,
                  }
                };
                // const color = visualMapSection[ind]?.color;
                return ([{
                  itemStyle,
                  // name,
                  label,
                  xAxis: start,
                  emphasis,
                }, {
                  itemStyle,
                  // name,
                  label,
                  xAxis: end,
                  emphasis,
                },]) as MarkAreaComponentOption['data'];
              }),
            }),
          } : null),
          // itemStyle: {
          //   color: function (params) {
          //     console.log(params);
          //     return 'red';
          //   }
          // },
          // lineStyle: {
          //   color: () => {
          //     return 'red';
          //   }
          // }
        }
      ],
      axisPointer: commonAxisPointerOption,
      ...((isEditX && visualMapSection) ? {
        visualMap: {
          // min,
          // max,
          // type: 'piecewise',
          pieces: visualMapSection.map(({ start, end, color }) => {
            const startData = dataArrWithPos[start];
            const endData = dataArrWithPos[end];
            return ({
              min: start,
              max: end,
              color,
              label: `${startData?.k}${startData?.kInd}~${endData?.k}${endData?.kInd}`,
            });
          }),
          dimension: 0,
          show: true,
          outOfRange: {
            color: 'Gray',
            colorAlpha: .8,
          },
          inverse: true,
          // categories: visualMapSection.map(({ start, end, color }) => (color)),
          // splitNumber: valuesArr.length,
        }
      } : null),
      // visualMap: {
      //   pieces: [{
      //     min: 0,
      //     max: 0,
      //     color: 'black',
      //   }]
      // }
    } as EChartsOption);
  }, [dataArrWithPos]);
  const GraphChartsOption = (useMemo(() => {
    // setFalse();
    // setTab(TabKey.table);
    if (!dataArrWithPos) {
      return;
    }

    if (superData) {
      const { tableData, graphData } = superData;
      if (tableData && graphData) {
        const commonValueFromTableData = getCommonValueFromTableData(tableData, svgWH);
        const dataArrWithPos = getDataArrWithPos(tableData, graphData, commonValueFromTableData, innerHeight);
        // const dataArrWithPos = getDataArrWithPosWithCommonValueFromTableData(tableData, graphData, svgWH);
        return getGraphOption(dataArrWithPos, graphData, selectMode, undefined, commonValueFromTableData, true);
      }
    }
    const option = getGraphOption(dataArrWithPos, graphData, selectMode, undefined, commonValueFromTableData);

    return option;
  }, [dataArrWithPos, superData]));
  // console.log(3, performance.now() - start);

  const ResultGraphChartsOption = useMemo(() => {
    if (!isNotGetResult && !resultGraph?.length) {
      const label = inputLabels[selectMode];
      return {
        title: {
          text: `${selectMode} result is empty`,
          // subtext: `${entries(useSetInputST[0]).map(([k, v]) => `${k}: ${v}`).join('\n')}`,
          subtext: `${map(useSetInputST[0], (v, k) => `${label?.[(k as keyof InputSTSetState)]}: ${v}`).join('\n')}`,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 30,
            lineHeight: 60
          },
          subtextStyle: {
            fontSize: 20,
            lineHeight: 40
          }
        }
      } as EChartsOption;
      // setTabToResult();
    }
    // setTabToResult();
    return getGraphOption(resultTable, resultGraph);
    // if (isNotGetResult) {
    // toastEmpty();
    // } 
  }, [resultGraph]);

  const clickToSetSizeECharts = useMemoizedFn(clickToSetSize({
    isEditX, setSize, size
  }));
  const onDblClick: onEChartsParam = ['dblclick', 'series', ((eCElementEvent) => {
    const {
      // componentSubType,
      // componentType,
      dataIndex,
      name,
      // seriesType,
      value,
      // dataType,

    } = eCElementEvent as CallbackDataParams;
    if (isSafeInteger(dataIndex) && name && isSafeInteger(value) && typeof value === 'number') {
      clickToSetSizeECharts({ v: value })();
    }
  })];
  const onClick: onEChartsParam = ['click', 'series', clickEChartDotToAddMultiDots];
  const LineCharts = <CommonCharts option={lineChartsOption} onParams={[onDblClick, onClick]} />;
  const GraphCharts = <CommonCharts option={GraphChartsOption} onParams={[onDblClick, onClick]} />;
  const ResultCharts = <CommonCharts option={ResultGraphChartsOption} />;
  const [allShowECharts, setAllShowECharts] = useSafeState<AllShowEChartsKeyArr>(initAllShowEChartsKeyArr);
  const setAllShowEChartsLock = useLockFn((newVals: Parameters<typeof setAllShowECharts>[0]) => {
    // const newVals = args[0];
    if (isArray(newVals)) {
      if (filterToLength(newVals) === 0) {
        toast.warn('Please leave at least one chart.', {
          toastId,
        });
      } else {
        toast.dismiss(toastId);
        setAllShowECharts(newVals);
      }
    }
    return waitMiddleEventLoop();
  });
  const previousAllShowECharts = usePrevious(allShowECharts);
  const filterAllShowECharts = filterUndefined(allShowECharts);
  const isSomeOneInFullScreen = filterAllShowECharts.length === 1;
  const enterFullScreen = useMemoizedFn((tabkey: TabKey) => () => {
    setAllShowECharts([tabkey]);
  });
  const exitFullScreen = useMemoizedFn(() => {
    if (previousAllShowECharts) {
      setAllShowECharts(previousAllShowECharts);
    }
  });
  const keyToJSX = useMemoizedFn((jsx: JSX.Element, key: TabKey) => {
    const isInFullScreen = isSomeOneInFullScreen && head(filterAllShowECharts) === key;
    return true ?
      <FullScreenChart
        isInFullScreen={isInFullScreen}
        isShow={allShowECharts.includes(key)}
        onClick={isInFullScreen ? exitFullScreen : enterFullScreen(key)}
      >{jsx}</FullScreenChart>

      : null;
  });
  useUpdateEffect(() => {
    waitLastEventLoop(() => {
      dispatchEvent(resizeEvent);
    });
  }, [allShowECharts]);

  return <>
    <ChartsTabPanel value={TabKey.all} key={getKey(TabKey.all)}>
      <div elevation={0} className={style['AllPanel'] ?? ''}>
        <div elevation={0} className={style['AllPanel-ECharts'] ?? ''} style={{ '--minHeight': '71vh' } as CSSProperties}>
          {keyToJSX(LineCharts, TabKey.table)}
          {keyToJSX(GraphCharts, TabKey.graph)}
          {isNotGetResult ? null : keyToJSX(ResultCharts, TabKey.result)}
        </div>
        <Paper elevation={24} className={style['ToggleButtonGroupWrapper'] ?? ''}>
          <ToggleButtonGroup size="large"
            value={allShowECharts}
            onChange={(e, newVals) => {
              // if (isArray(newVals)) {
              setAllShowEChartsLock(newVals);
              // }
            }}
            className={style['AllPanel-ToggleButtonGroup'] ?? ''}
          >
            {
              allShowEChartsKeyArr.map(tabkey => {
                const isDisabled = tabkey === TabKey.result && isNotGetResult;
                return <ToggleButton value={tabkey} disabled={isDisabled}
                  className={style['AllPanel-ToggleButtonGroup-ToggleButton'] ?? ''}
                  size="large"
                >
                  {/* <fieldset>
                    <legend>{TabKey2Title[tabkey]}</legend>
                     */}
                  <FormControlLabel control={
                    <Checkbox checked={allShowECharts.includes(tabkey)} disabled={isDisabled} size="large"
                    // onChange={e => {
                    //   const { checked } = e.target;
                    //   if (checked) {
                    //     // console.log(uniq([...allShowECharts, tabkey]), allShowECharts);
                    //     // setAllShowECharts(from(new Set([...allShowECharts, tabkey])));
                    //     setAllShowECharts(uniq([...allShowECharts, tabkey]));
                    //   } else {
                    //     console.log(without(allShowECharts, tabkey), allShowECharts);
                    //     setAllShowECharts(without(allShowECharts, tabkey));
                    //   }
                    // }}
                    />
                  }

                    label={TabKey2Title[tabkey]}
                  />
                  {/* </fieldset> */}
                </ToggleButton>;
              })
            }
          </ToggleButtonGroup>
          {/* <FormControl
            fullWidth
          >
            <InputLabel>HJX</InputLabel>
            <Select
              multiple
              fullWidth
              autoWidth
              value={allShowECharts}
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setAllShowECharts(
                  typeof value === 'string' ? (value.split(',').map(Number) as AllShowEChartsKeyArr) : value,
                );
                waitLastEventLoop(() => {
                  dispatchEvent(resizeEvent);
                });
              }}
              input={<OutlinedInput label="Chip" />}
              renderValue={(selected) => (
                <>
                  {selected.map((value) => (
                    <Chip key={value} label={TabKey2Title[value]}
                    />
                  ))}
                </>
              )}
            >
              {allShowEChartsKeyArr.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  disabled={name === TabKey.result && isNotGetResult}
                >
                  <Checkbox checked={allShowECharts.includes(name)} />
                  <ListItemText primary={TabKey2Title[name]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Paper>

      </div>
    </ChartsTabPanel>
    <ChartsTabPanel value={TabKey.table} key={getKey(TabKey.table)}>
      {LineCharts}
    </ChartsTabPanel>
    <ChartsTabPanel value={TabKey.graph} key={getKey(TabKey.graph)}>
      {GraphCharts}
    </ChartsTabPanel>
    <ChartsTabPanel value={TabKey.result} key={getKey(TabKey.result)}>
      {ResultCharts}
    </ChartsTabPanel></>;
}