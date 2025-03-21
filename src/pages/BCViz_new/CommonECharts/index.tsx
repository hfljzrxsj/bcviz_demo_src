import {
  Paper,
  // Button, Dialog, Divider, Select, FormControl, InputLabel, MenuItem, Tooltip, Fab, IconButton
} from '@mui/material';
import { memo, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import isEqual from 'react-fast-compare';
import style from '../_index.module.scss';
// import { type EChartsOption } from 'echarts';
import { init, getInstanceByDom, use } from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart, GraphChart } from 'echarts/charts';
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  AxisPointerComponent,
  SingleAxisComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  GraphSeriesOption,
  LineSeriesOption,

} from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  AxisPointerComponentOption,
  SingleAxisComponentOption,
  DataZoomComponentOption,
  VisualMapComponentOption,
  MarkAreaComponentOption,
  MarkLineComponentOption,
} from 'echarts/components';
import type {
  ComposeOption,
} from 'echarts/core';
import { waitLastEventLoop } from '@/utils';
import { clickToSetSize, debounce } from '@/pages/BCviz/utils';
// import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
// import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
// // import { } from 'zrender';
import {
  useUnmount, useDeepCompareEffect,
  // , useFullscreen, useUpdateEffect, useDebounceFn, useUpdate, useMount
} from 'ahooks';
// import styleFab from './_index.module.scss';
// import axios from 'axios';
// 注册必须的组件
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  LineChart, GraphChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ToolboxComponent,
  AxisPointerComponent,
  SingleAxisComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
]);
const { isSafeInteger } = Number;
export type EChartsOption = ComposeOption<
  | GraphSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | ToolboxComponentOption
  | AxisPointerComponentOption
  | SingleAxisComponentOption
  | DataZoomComponentOption
  | VisualMapComponentOption
  | MarkAreaComponentOption
  | MarkLineComponentOption
> | undefined;
//I:\html\html\react\smit_package.json\node_modules\ahooks\es
const resizeEventTarget = window ?? self ?? globalThis ?? global ?? this ?? new EventTarget();
const { addEventListener, removeEventListener } = resizeEventTarget;
export const { dispatchEvent, } = resizeEventTarget;
const resize = 'resize';
export const resizeEvent = new Event(resize);
// type EChartsOnFunc = Parameters<NonNullable<ReturnType<(typeof getInstanceByDom | typeof init)>>['on']>[2];
export type onEChartsParam = Parameters<NonNullable<ReturnType<(typeof getInstanceByDom | typeof init)>>['on']>;
export type onEChartsParamFunc = onEChartsParam[2];
export default memo((props: {
  readonly option: EChartsOption;
  readonly onParams?: ReadonlyArray<onEChartsParam>;
  // readonly clickToSetSize: ReturnType<typeof clickToSetSize>;
}) => {
  const { option, onParams = [], } = props;
  // const update = useUpdate();
  const ref = useRef<HTMLDivElement>(null);
  // const { current } = ref;
  // const chart = useMemo(() => {

  // }, [ref.current]);
  // useUnmount(() => {
  //   chart?.dispose();
  // });
  // const chart = useMemo(() => {
  //   const { current } = ref;
  //   if (!current) {
  //     // waitLastEventLoop(update);
  //     return;
  //   }
  //   return init(current) ?? getInstanceByDom(current);
  // }, [ref.current]);
  // const { run: doResize } = useDebounceFn(() => {
  //   if (chart) {
  //     chart.resize();
  //   }
  //   return;
  // });
  // useUpdateEffect(() => {
  //   if (!chart || !current) {
  //     return;
  //   }
  //   const resizeObserver = new ResizeObserver(doResize);
  //   resizeObserver.observe(current);
  //   addEventListener(resize, doResize);
  //   return () => {
  //     chart.clear();
  //     chart.dispose();
  //     resizeObserver.disconnect();
  //     doResize.cancel?.();
  //     removeEventListener(resize, doResize);
  //   };
  // }, [chart]);
  // useUpdateEffect(() => {
  //   if (!chart || !option) {
  //     return;
  //   }
  //   chart.showLoading();
  //   waitLastEventLoop(() => {
  //     chart.setOption(option, true, true);
  //     chart.hideLoading();
  //   });
  // }, [option]);

  useDeepCompareEffect(() => {
    // setTimeout(() => {
    const { current } = ref;
    if (!current || !option) {
      return;
    }
    const chart = getInstanceByDom(current) ?? init(current);
    chart.showLoading();
    waitLastEventLoop(() => {
      chart.setOption(option, true, true);
      onParams.map(param => chart.on(...param));
      // chart.on('dblclick', (eCElementEvent) => {
      //   const { componentSubType, componentType, dataIndex, name, seriesType, value } = eCElementEvent;
      //   if (componentType === "series" && isSafeInteger(dataIndex) && name && isSafeInteger(value) && typeof value === 'number') {
      //     // clickToSetSize({ v: value })();
      //   }
      // });
      // chart.on('dbclick', (eCElementEvent) => {
      //   console.log(eCElementEvent);
      // });
      chart.hideLoading();
    });
    const closureResize = debounce(chart.resize);
    const doResize = () => closureResize();
    const resizeObserver = new ResizeObserver(doResize);
    resizeObserver.observe(current);
    addEventListener(resize, doResize);
    // }, 1e3);
    return () => {
      onParams.map(([event, , handle]) => chart.off(event, handle));
      // chart.clear();
      // chart.dispose();
      resizeObserver.disconnect();
      closureResize.cancel?.();
      closureResize.clear?.();
      removeEventListener(resize, doResize);
    };
  }, [option]);
  useUnmount(() => {
    const { current } = ref;
    if (!current) {
      return;
    }
    const chart = getInstanceByDom(current);
    if (!chart) {
      return;
    }
    chart.clear();
    chart.dispose();
  });

  // const fullscreenRef = useRef<HTMLDivElement>(null);
  // const [isFullscreen, { toggleFullscreen, isEnabled }] = useFullscreen(fullscreenRef.current);
  return <>
    {/* <Paper elevation={24} className={style['Chart'] ?? ''}
      ref={fullscreenRef}
    >
      <Fab
        size='large'
        onClick={() => {
          toggleFullscreen();
          const { current } = fullscreenRef;
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            current?.requestFullscreen();
          }
          console.log(isEnabled, isFullscreen, fullscreenRef.current);
          // fullscreenRef.
        }}
        title="toggle Fullscreen"
        className={styleFab['Fab'] ?? ''}
      >
        <Tooltip title="toggle Fullscreen" arrow>
          <IconButton size='large'>
            {
              isFullscreen ? <FullscreenExitRoundedIcon fontSize="large" /> : <FullscreenRoundedIcon fontSize="large" />
            }
          </IconButton>
        </Tooltip>

      </Fab> */}
    <Paper elevation={24} ref={ref} className={style['Chart'] ?? ''}

    >

    </Paper>
    {/* </Paper> */}
  </>;
}, isEqual);
export type {
  TooltipComponentOption, GraphSeriesOption,
  LineSeriesOption, AxisPointerComponentOption, MarkAreaComponentOption,
};
