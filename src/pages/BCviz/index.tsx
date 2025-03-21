// https://brilliant-hamster-b238e7.netlify.app
// https://app.netlify.com/sites/brilliant-hamster-b238e7/deploys
import {
  Accordion, AccordionDetails, AccordionSummary,
  Paper,
} from "@mui/material";
import { useBoolean, useSafeState, useUpdateEffect, useMemoizedFn } from "ahooks";
import { useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";
import style from './_index.module.scss';
import TableCell from "./TableCell";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Tool from "./Tool";
import { getDataArrWithPos, getGraphLineWithHighlightLevel, clickToSetSize, doubleClickCircleFn } from "./utils";
import { isDEV } from "@/utils/isEnv";
import GraphSVG from "./GraphSVG";
import type { ClickCircleProps, CommonSVGProps, PosDataObjArr } from "./types";
import LineSVG from "./LineSVG";
import useBCVizFnHooks, { useCircleFn } from "./hooks";




// export type OriginData = ReadonlyBasicArray<[string, number]>;
// type PosData = Readonly<[string, number, number, number, number]>;


// type PosArr = ReadonlyArray<PosData>;
// key value index x y

export default function BCViz () {
  // const theme = useTheme();
  // console.log(theme, colors);

  const [size, setSize] = useSafeState<number>();
  const [drawDotData, setDrawDotData] = useSafeState<PosDataObjArr>([]);
  const { tableData, setTableData, graphData, setGraphData,
    svgRef, svgSize, commonValueFromTableData } = useBCVizFnHooks();
  const { svgWidth, svgHeight } = svgSize;
  const [isEditX, {
    toggle: toggleIsEditX,
  }] = useBoolean(isDEV);
  const graphSvgHeght = svgHeight / (isDEV ? 1 : 2);
  // const dataArrWithPos=useMemo(()=>{},[tableData])
  const circleFnProps: ClickCircleProps = {
    commonValueFromTableData, isEditX, dataArrWithPos: drawDotData, graphData,
    // setDrawDotData,
    svgRef, svgSize, setSize, size
  };
  useUpdateEffect(() => unstable_batchedUpdates(() => {
    if (!tableData || !svgWidth || !svgHeight) {
      return;
    }
    const dataArrWithPos = getDataArrWithPos(tableData, graphData, commonValueFromTableData, graphSvgHeght);
    if (!dataArrWithPos) {
      return;
    }
    setDrawDotData(dataArrWithPos);
  }), [tableData]);
  useUpdateEffect(() => {
    setDrawDotData(doubleClickCircleFn(circleFnProps));
  }, [size]);

  // 二部图的线
  const graphLine = useMemo(() => getGraphLineWithHighlightLevel({ drawDotData, graphData }), [drawDotData]);

  const { clickCircle } = useCircleFn(circleFnProps);
  const doubleClickCircle = useMemoizedFn(clickToSetSize({ isEditX, setSize, size, drawDotData }));
  const commonSVGProps: CommonSVGProps = { ...circleFnProps, drawDotData, clickCircle, doubleClickCircle, graphLine, svgRef, svgSize };


  return <>
    <Paper elevation={24} className={style['Main'] ?? ''}>
      <Accordion className={style['Accordion'] ?? ''}
      // defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={style['Accordion-Summary'] ?? ''}
        >
          Toolbar
        </AccordionSummary>
        <AccordionDetails className={style['Accordion-Details'] ?? ''}>
          <Tool {...{
            setTableData, setGraphData, toggleIsEditX, isEditX
          }}
            //@ts-expect-error
            setDatas={[setGraphData, setTableData]}
            setFileNames={[]}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion className={style['Accordion'] ?? ''}
        defaultExpanded={isDEV}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={style['Accordion-Summary'] ?? ''}
        >
          Graph
        </AccordionSummary>
        <AccordionDetails className={style['Accordion-Details'] ?? ''}>
          <Paper elevation={24}
          // className={style['Paper'] ?? ''}
          >
            <GraphSVG {
              ...commonSVGProps
            }
              viewBox={[0, 0, svgWidth, graphSvgHeght].join(' ')}
            />
            {/* <svg
              viewBox={[0, 0, svgWidth, graphSvgHeght].join(' ')}
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
                const title = `${k}${kInd}`;
                return <>
                  <Tooltip
                    {...getTooltipProps(dotData)}
                  >
                    <g
                      onDoubleClick={doubleClickCircle({ dotData })}
                      onClick={clickCircle(dotData)}
                      className={getSVGGClassNames(dotData)}
                      style={{ '--color': color } as CSSProperties}
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
            </svg> */}
          </Paper>
        </AccordionDetails>
      </Accordion>
      <Accordion className={style['Accordion'] ?? ''}
        defaultExpanded={isDEV}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={style['Accordion-Summary'] ?? ''}
        >
          Table Of Maximum Cohesion
        </AccordionSummary>
        <AccordionDetails className={style['Accordion-Details'] ?? ''}>
          <Paper elevation={24} className={style['Table'] ?? ''}>
            {drawDotData?.length ? <Paper elevation={24} className={style['table'] ?? ''}>
              <TableCell texts={['i', 'VO[i]', 'VC[i]']} />
              {drawDotData?.map((dotData, ind) => {
                const { k, v, kInd } = dotData;
                return <>
                  <TableCell
                    texts={[ind + 1, k + kInd, v]}
                    {...{ dotData }}
                    onDoubleClick={doubleClickCircle({ dotData })}
                    onClick={clickCircle(dotData)}
                  />
                </>;
              })}
            </Paper> : null}
          </Paper>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion className={style['Accordion'] ?? ''} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={style['Accordion-Summary'] ?? ''}
        >
          折线图
        </AccordionSummary>
        <AccordionDetails className={classNames(style['Accordion-Details'], style['Accordion-Details--SVG'])}> */}
      <Paper elevation={24} className={style['SVG'] ?? ''}>
        <LineSVG {
          ...commonSVGProps
        }
          viewBox={[0, 0, svgWidth, graphSvgHeght].join(' ')}
        />
      </Paper>
      {/* </AccordionDetails>
      </Accordion> */}
    </Paper>
    {/* <ToastContainer /> */}
  </>;
}