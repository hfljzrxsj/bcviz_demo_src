import {

  Tooltip,
} from "@mui/material";
import { forwardRef, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import style from '../_index.module.scss';
import clsx from 'clsx';
import { clickCircleFn, doubleClickCircleFn, getSVGGClassNames, getTooltipProps } from "../utils";
import { useMemoizedFn } from "ahooks";
import type { GraghSVGProps } from "../types";
import { getDotName } from "@/pages/BCViz_new/utils";

export default forwardRef((props: GraghSVGProps) => {
  const {
    viewBox,
    graghLine,
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
    className={style['gragh-svg']}
  >
    {graghLine?.map(({ pos, highlightLevel, color }, index) => {
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
        k, kInd, v, graghX, graghY, color } = dotData;
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
            key={graghX}
          >
            <circle
              cx={graghX}
              cy={graghY}
              className={style['circle']}
            >
            </circle>
            <text
              x={graghX}
              y={graghY}
              className={style['text']}
            >{title}</text>
          </g>
        </Tooltip>
      </>;
    })}
  </svg>;
});