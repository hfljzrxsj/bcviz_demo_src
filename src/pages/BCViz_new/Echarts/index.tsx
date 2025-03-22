import { useMemo, type ReactNode } from "react";
import type { DataArrWithPos, HSSProps, OriginGraphDataReadonlyArr, PosDataObj, PosDataObjArr, SVGChartsProps, SetStateType, getCommonValueFromTableDataReturnType } from "@/pages/BCviz/types";
import { UVenum, clickToSetSize, doubleClickCircleFnForECharts, getGraphLinkColor, isEditXFunc } from "@/pages/BCviz/utils";
import { TabKey, getDotName, getSymbolSize, tanContentClass } from "../utils";
import CommonCharts, { type AxisPointerComponentOption, type EChartsOption, type GraphSeriesOption, type LineSeriesOption, type MarkAreaComponentOption, type TooltipComponentOption, type onEChartsParam, type onEChartsParamFunc } from "../CommonECharts";
import { freeze } from "immer";
import { clamp, debounce, head, isUndefined, last, map } from "lodash";
import { renderToStaticMarkup } from "react-dom/server";
import { Modes } from "../utils";
import type { InputSTSetState } from "../InputST";
import { toast } from 'react-toastify';
import type { UseSetInputST } from "../TabPanelInput/TabPanelInput";
import type { execTextType } from "../api";
import ChartsTabPanel from "../ChartsPaper";
import { useMemoizedFn, usePrevious, useSafeState, } from 'ahooks';
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
const { isSafeInteger } = Number;

const isUseForce = false;

type tanColorContentJsxParam = Readonly<[string | undefined, ReactNode]>;
export const tanColorContentJsx = ([k, v]: tanColorContentJsxParam) => (<div key={k}>
  <span>{`${k}: `}</span>
  <span className={tanContentClass}>{v?.toString()}</span>
</div>
);

export const getTitle2Jsx = ({ k, kInd, v, neighbor, color }: PosDataObj, mode?: Modes) => {

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
      ([['Vertex Name', `${k + kInd}`],
      ['Maximum Cohesion', `${v}`],
      ['Neighbors', `${neighbor?.map(({ k, kInd }) => `${k + kInd}`).join(', ')}`],
      ['Vertex Degree', `${neighbor?.length}`,],
      ] as ReadonlyArray<tanColorContentJsxParam>).map(tanColorContentJsx)
    }
  </>);
};
export const getTitle2JsxString: (...args: Parameters<typeof getTitle2Jsx>) => string = (...args) => renderToStaticMarkup(getTitle2Jsx(...args));
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
const commonEmphasisOption: (GraphSeriesOption
  & LineSeriesOption)['emphasis'] = ({
    lineStyle: {
      width: 4,
      shadowColor: 'rgba(0,0,0,.3)',
      shadowBlur: 10,
    },
    scale: true,
    label: {
      show: true,
      fontSize: 24,
      fontWeight: 'bolder',
    },
    labelLine: {
      show: true
    },
    itemStyle: {
      shadowColor: 'rgba(0,0,0,.3)',
      shadowBlur: 10,
      // shadowOffsetY: 8
    }
  });
const getGraphOption = (dataArrWithPos: PosDataObjArr | undefined, graphData: OriginGraphDataReadonlyArr | undefined, mode?: Modes, size: execTextType['size'] = undefined): EChartsOption => {
  if (!dataArrWithPos || !graphData) {
    return {};
  }
  const graphLinkColor = getGraphLinkColor(dataArrWithPos, graphData);
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
          formatter (obj, backupStr) {
            const { dataType, dataIndex, data } = obj;
            if (dataType === 'edge') {
              //@ts-expect-error
              return data['source'] + '<br/>' + data['target'];
            }
            // if ('dataIndex' in obj) {
            const posObj = dataArrWithPos[dataIndex];
            if (posObj) {
              return getTitle2JsxString(posObj, mode);
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
          const { k, kInd, graphX, graphY, v, color } = dotData;
          return ({
            name: getDotName(dotData),
            value: v,
            category: k,
            // symbolSize: min(v * 5, 100),
            symbolSize: getSymbolSize(v, color),
            ...(isUseForce ? {} : {
              x: graphX,
              y: graphY
            }),
            ...(color ? {
              itemStyle: {
                color,

              },
            } : null),
            // x: kInd * 60,
            // y: k === UVenum.U ? 0 : length * 50
          }) as NonNullable<GraphSeriesOption['data']>[number];
        }),
        // links: [],
        links: graphData?.map(({ u, v }, ind) => {
          const color = graphLinkColor[ind];
          return {
            source: `u${u}`,
            target: `v${v}`,
            // graphLinkColor[ind]
            ...(color ? {
              lineStyle: {
                color: graphLinkColor[ind],
                width: 4,
              }
            } : null)
          };
        }) as GraphSeriesOption['links'],
        lineStyle: {
          // color: 'source',
          // curveness: 0.3,
          opacity: 1,
          // color: "#000"
        },
        emphasis: {
          focus: 'adjacency',
          ...commonEmphasisOption,
        }
      }
    ],
  } as EChartsOption);
  return option;
};
type LineDataItemOption = NonNullable<LineSeriesOption["data"]>[number];
const getLineItemOptionFromColor = (color: PosDataObj['color']): LineDataItemOption & object => (color ? {
  itemStyle: {
    color,
    shadowColor: 'rgba(0,0,0,.3)',
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
    s: 'Minimum vertex count in U',
    t: 'Minimum vertex count in V'
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
type AllShowEChartsKey = 'line' | 'graph' | 'result';
type AllShowEChartsKeyArr = ReadonlyArray<AllShowEChartsKey>;
const allShowEChartsKeyArr: AllShowEChartsKeyArr = ['line', 'graph', 'result'];
export default function Echarts (props: {
  readonly graphData: OriginGraphDataReadonlyArr;
  readonly resultGraph: OriginGraphDataReadonlyArr | undefined;
  readonly selectMode: Modes;
  readonly useSetInputST: UseSetInputST;
  readonly setTab: SetStateType<TabKey>;
  readonly resultTable: PosDataObjArr | undefined;
  readonly clickEChartDotToAddMultiDots: onEChartsParamFunc;
} & HSSProps & SVGChartsProps) {
  const { dataArrWithPos: dataArrWithPosNotWithColor, graphData, size, resultGraph,
    selectMode, useSetInputST,
    setTab, resultTable,
    setSize, isEditX,
    commonValueFromTableData,
    clickEChartDotToAddMultiDots,
  } = props;
  const { dataArrWithPos, visualMapSection, sections } = useMemo(() => {
    if (isEditX) {
      const { datas, visualMapSection, sections } = doubleClickCircleFnForECharts({ ...props });
      return { dataArrWithPos: datas, visualMapSection, sections };
    }
    return { dataArrWithPos: dataArrWithPosNotWithColor };
  }, [dataArrWithPosNotWithColor]);
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
  const GraphChartsOption = useMemo(() => {
    // setFalse();
    // setTab(TabKey.table);
    if (!dataArrWithPos) {
      return;
    }
    const option = getGraphOption(dataArrWithPos, graphData, selectMode);

    return option;
  }, [dataArrWithPos]);
  // console.log(3, performance.now() - start);

  const isNotGetResult = isUndefined(size);
  const ResultGraphChartsOption = useMemo(() => {
    if (!isNotGetResult && !resultGraph?.length) {
      const label = inputLabels[selectMode];
      console.log(useSetInputST[0], label);

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
  const [allShowECharts, setAllShowECharts] = useSafeState<AllShowEChartsKeyArr>(['line', 'graph']);
  const previousAllShowECharts = usePrevious(allShowECharts);
  const keyToJSX = useMemoizedFn((jsx: JSX.Element, key: AllShowEChartsKey) => {
    return allShowECharts.includes(key) ? jsx : null;
  });
  return <>
    {/* <ChartsTabPanel value={TabKey.all} key={getKey(TabKey.all)}>
      <Paper elevation={24} className={style['AllPanel'] ?? ''}>
        <Paper elevation={24} className={style['AllPanel-ECharts'] ?? ''}>
          {keyToJSX(LineCharts, 'line')}
          {keyToJSX(GraphCharts, 'graph')}
          {isNotGetResult ? null : keyToJSX(ResultCharts, 'result')}
        </Paper>
        <Paper elevation={24} >
          <FormControl
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
                  typeof value === 'string' ? (value.split(',') as AllShowEChartsKeyArr) : value,
                );
              }}
              input={<OutlinedInput label="Chip" />}
              renderValue={(selected) => (
                <>
                  {selected.map((value) => (
                    <Chip key={value} label={value}
                    />
                  ))}
                </>
              )}
            >
              {allShowEChartsKeyArr.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                >
                  <Checkbox checked={allShowECharts.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

      </Paper>
    </ChartsTabPanel> */}
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