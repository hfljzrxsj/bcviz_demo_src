import { type TooltipProps, Tooltip } from "@mui/material";
import classNames from "clsx";
import style from './_index.module.scss';
import type { PosDataObjArr, SetStateType } from "../types";
import { marginSize } from "../utils";

export default function SvgDot (props: {
  readonly drawDotData: PosDataObjArr;
  readonly svgHeight: number;
  readonly xEnd: number;
  readonly yEnd: number;
  readonly setNextDrawDotData: SetStateType<PosDataObjArr>;
  readonly isEditX: boolean;
}) {
  const { drawDotData, svgHeight, xEnd, yEnd, setNextDrawDotData, isEditX } = props;
  return drawDotData.map(({ k, v, x, y }) => {
    const tooltipProps: Omit<TooltipProps, 'children'> = {
      title: `${k}:${v}`,
      arrow: true,
    };
    return <>
      <g>
        <Tooltip
          {...tooltipProps}
        >
          <text
            x={x}
            y={svgHeight}
            className={classNames(style['text'],
              // hoverLineClass,
            )}
          >{k}</text>
        </Tooltip>
        {
          isEditX ?
            <>
              <line x1={x} x2={x} y1={marginSize} y2={yEnd} className={style['hover-y']}></line>
            </> : null
        }
        {/* <input checked={true} id={k} type="checkbox" className={style['checkbox']}></input> */}
        {/* {(true) ? */}
        <Tooltip
          {...tooltipProps}
        >
          <circle
            cx={x}
            cy={y}
            className={
              classNames(style['circle'],
                // hoverLineClass,
              )}
            onDoubleClick={(e) => {
              const bigThanOriginData = drawDotData.filter(({ v: thisV }) => v >= thisV);
              setNextDrawDotData(bigThanOriginData);
            }}
          ></circle></Tooltip>

        {
          isEditX ?
            <>
              <line x1={marginSize} x2={xEnd} y1={y} y2={y} className={style['hover-x']}></line>
            </> : null
        }

        {/* : null} */}
      </g>
    </>;
  });
}