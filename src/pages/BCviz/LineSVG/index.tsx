import type { LineSVGProps, Pos } from "../types";
import {
  Tooltip,
} from "@mui/material";
import { useMemo, type CSSProperties, forwardRef } from "react";
import style from '../_index.module.scss';
import clsx from 'clsx';
import { getNumFromData, getSVGGClassNames, getTooltipProps, halfMarginSize, marginSize } from "../utils";
import HoverXLine from "../HoverXLine";
import { head, sortBy, uniq } from "lodash";
import { getDotName } from "@/pages/BCViz_new/utils";


export default forwardRef<SVGSVGElement, LineSVGProps>((props: LineSVGProps) => {
  const {
    viewBox,
    drawDotData,
    clickCircle,
    doubleClickCircle,
    svgRef,
    isEditX,
    commonValueFromTableData: { valuesArr,
      // min,
      // max,
      // diff,
      // realHeight,
      // yRadix,
      xRadix,
      length,
      getYPos,
      svgHeight,
      // svgWidth,
    },
    svgSize,
    size,
    // ...others
  } = props;
  // log;
  const {
    xEnd = 0,
    yEnd = 0
  } = svgSize;
  const tableYAxisData = useMemo(() => {
    return sortBy(uniq(valuesArr)).map(i => ({ v: i, yPos: getYPos(i) }));
  }, [drawDotData]);
  const drawLineData = useMemo(() => {
    let startData = head(drawDotData);
    type drawLineData = Array<readonly [Pos, Pos]>;
    if (!startData) {
      return [];
    }
    let startVal = getNumFromData(startData);
    const drawLineData: drawLineData = [];
    for (let i = 1; i < length; i++) {
      let curData = drawDotData[i];
      if (!curData) {
        break;
      }
      let curVal = getNumFromData(curData);
      let sub = curVal - startVal;
      // const mid: PosData[] = [startData];
      const { x = 0, y = 0 } = startData;
      const startPos: Pos = [x, y];
      for (; i < length; i++) {
        // mid.push(curData);
        const nextData = drawDotData[i + 1];
        if (nextData) {
          const nextVal = getNumFromData(nextData);
          const diff = nextVal - curVal;
          if (diff === sub) {
            curData = nextData;
            curVal = nextVal;
            continue;
          }
        }
        const { x = 0, y = 0 } = curData;
        const endPos: Pos = [x, y];
        drawLineData.push([startPos, endPos]);
        break;
      }
      // teamArr.push(mid);
      startData = curData;
      startVal = curVal;
    }
    // const teamArrWithPos: DrawData = teamArr.map((dataArr) => dataArr.map(([k, v, i]) => ([
    //   k,
    //   v,
    //   i,
    //   marginSize + i * xRadix,  //x
    //   marginSize + (max - v) * yRadix,  //y
    // ])));
    return drawLineData;
    //   .map((dataArr) => ({
    //   start: dataArr[0],
    //   mid: dataArr,
    //   end:
    // }));

  }, [drawDotData]);

  return <svg
    viewBox={viewBox}
    ref={svgRef}
    className={style["svg"]}
    style={{ '--stroke-dasharray': xRadix } as CSSProperties}
  // {...others}
  >
    <line x1={marginSize} y1={yEnd} x2={xEnd} y2={yEnd} className={style['coordinate-axis-x']}></line>  {/* x轴 */}
    <line x1={marginSize} y1={marginSize} x2={marginSize} y2={yEnd} className={style['coordinate-axis-y']}></line>  {/* y轴 */}
    {tableYAxisData.map(({ v, yPos }) => (
      //   <Tooltip arrow title={isEditX ? (v === initClickLineVal ? '单击取消高亮直线' : '单击高亮/取消高亮直线') : ''}
      //   followCursor
      // >
      <g
        className={style['g']}
        onClick={doubleClickCircle({ v })}
      >
        <text
          x={halfMarginSize}
          y={yPos}
          className={style['axis-text']}
        >{v}</text>

        <HoverXLine {...{ xEnd, isEditX, }}
          // onClick={doubleClickCircle(v)}
          className={clsx({
            [style['hover-click-line'] ?? '']: v === size
          })}
          dotData={{ v, y: yPos }}
        />
      </g>
      // </Tooltip>
    ))}
    {
      drawLineData.map(([[x1, y1], [x2, y2]]) => <>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          className={style['line']}
        />
      </>)
    }
    {
      drawDotData.map((dotData) => {
        const { k, v, kInd, x, y, color } = dotData;
        const tooltipProps = getTooltipProps(dotData);
        return <>
          <g
            className={getSVGGClassNames(dotData)}
            onClick={clickCircle(dotData)}
            onDoubleClick={doubleClickCircle({ dotData })}
            style={{ '--color': color } as CSSProperties}
          >
            <Tooltip
              {...tooltipProps}
            >
              <text
                x={x}
                y={svgHeight}
                className={style['text']}
              >{getDotName(dotData)}</text>
            </Tooltip>
            {
              isEditX ? //TODO: 用html的hidden属性替代？
                <>
                  <line x1={x} x2={x} y1={
                    // marginSize
                    y
                  } y2={
                    yEnd
                  } className={style['hover-y']}></line>
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
                className={style['circle']}
              ></circle></Tooltip>
            <HoverXLine {...{ xEnd, dotData, isEditX, }}
              onClick={doubleClickCircle({ dotData })}
              className={clsx({
                [style['hover-x--no-show'] ?? '']: v === size
              })}
            />
          </g>
        </>;
      })
    }
  </svg>;
});