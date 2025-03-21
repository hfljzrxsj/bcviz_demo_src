import {

  Tooltip,
} from "@mui/material";
import { forwardRef, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import style from '../_index.module.scss';
import clsx from 'clsx';
import { clickCircleFn, doubleClickCircleFn, getSVGGClassNames, getTooltipProps } from "../utils";
import { useMemoizedFn } from "ahooks";
import type { GraphSVGProps } from "../types";
import { getDotName } from "@/pages/BCViz_new/utils";

export default forwardRef((props: GraphSVGProps) => {
  const {
    viewBox,
    graphLine,
    drawDotData,
    clickCircle,
    doubleClickCircle,
    // commonValueFromTableData: { valuesArr,
    //   min,
    //   max,
    //   diff,
    //   realHeight,
    //   xRadix,
    //   yRadix,
    //   length,
    //   getYPos,
    //   // svgWidth,
    // },
  } = props;
  // const clickCircle = useMemoizedFn(clickCircleFn(props));
  return <svg
    viewBox={viewBox}
    className={style['graph-svg']}
  >
    {graphLine?.map(({ pos, highlightLevel, color }, index) => {
      return <polyline
        points={pos.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none" stroke="black"
        className={clsx(style['line'], style[highlightLevel])}
        style={{ '--color': color } as CSSProperties}
        key={index}
      ></polyline>;
    })}
    {drawDotData.map((dotData) => {
      const {
        k, kInd, v, graphX, graphY, color } = dotData;
      const title = getDotName(dotData);
      return <>
        <Tooltip
          {...getTooltipProps(dotData)}
        >
          <g
            onDoubleClick={doubleClickCircle({ dotData })}
            onClick={clickCircle(dotData)}
            className={getSVGGClassNames(dotData)}
            style={{ '--color': color } as CSSProperties}
            key={graphX}
          >
            <circle
              cx={graphX}
              cy={graphY}
              className={style['circle']}
            >
            </circle>
            <text
              x={graphX}
              y={graphY}
              className={style['text']}
            >{title}</text>
          </g>
        </Tooltip>
      </>;
    })}
  </svg>;
});