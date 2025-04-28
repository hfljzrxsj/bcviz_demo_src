/* 
https://developer.huaweicloud.com/space/devportal/desktop
https://ecs.console.aliyun.com/server/i-bp1gir88hyhhc1mzjrm4/detail?regionId=cn-hangzhou
*/
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Paper, Tab, Modal, CircularProgress  // Tabs,
  , Select, MenuItem, FormControl, InputLabel,
  Accordion, AccordionDetails, AccordionSummary,
  Autocomplete,
  Tooltip,
  Skeleton,
  // FormLabel,
  // FormControlLabel, FormGroup
} from "@mui/material";
import { useBoolean, useSafeState, useSetState, useRequest, useLocalStorageState, useMount, useUpdateEffect, useMemoizedFn, useResetState, useEventListener } from "ahooks";
import { useMemo, type ReactNode, createContext } from "react";
import { UVenum, doubleClickCircleFnForECharts, getDataArrWithPos, getGroupByDot, isEditXFunc } from "../BCviz/utils";
import style from './_index.module.scss';
import style_old from '../BCviz/_index.module.scss';
// import { type EChartsOption } from 'echarts';
import type { InputSTSetState } from "./InputST";
import { baseURL, getFromST, type execTextType, getSG } from "./api";
import { commonUseRequestParams } from "@/utils/const";
import clsx from "clsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import SideCollapse from "./SideCollapse";
import Tool from "../BCviz/Tool";
import TabPanelInput, { type UseSetInputST } from "./TabPanelInput/TabPanelInput";
import { isChina } from "./getIntl";
import { isDEV, isPROD } from "@/utils/isEnv";
import { arrayLengthBigThanNum, dataArrWithPosDrawColorWithVisualMapSection, getDataArrWithPosMutilDotsColor, getDataArrWithPosWithCommonValueFromTableData, getTableDataWithIndOrFilter, getTooltipTitle, Modes, ModesShortcut, TabKey2Title, tanContentClass } from "./utils";
import type { HSSProps, OriginDataObjReadonlyArr, OriginDataObjWithIndexArr, OriginGraphDataReadonlyArr, PosDataObj, PosDataObjArr, SVGChartsProps, SetSizeProps, SetStateType } from "../BCviz/types";
import SVGCharts from "./SVGCharts";
import useBCVizFnHooks from "../BCviz/hooks";
import Echarts, { tanColorContentJsx } from "./Echarts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Settings, { type keyofRenderingEngine } from "./Settings";
import { isUndefined, every } from "lodash";
import { TabKey } from "./utils";
import InputSize from "./InputSize";
import AutocompleteRenderInput from "./AutoCompleteRenderInput";
import AutoCompleteRenderOptionMenuItem from "./AutoCompleteRenderOption";
import type { onEChartsParamFunc } from "./CommonECharts";
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import VisualMapSectionAutoComplete from "./VisualMapSectionAutoComplete";
export const uvHighlightColor = 'tan';
export const clickMultiDotColor = 'red';
const { isSafeInteger } = Number;

const { entries, freeze, values, keys, fromEntries } = Object;
const { isArray } = Array;
if (isDEV) {
  const { from } = Array;
  const originalError = console.error;
  console.error = function (message) {
    if (typeof message === 'string' && (message.startsWith('Warning: Each child in a list should have a unique "key" prop.') || message.startsWith('Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'))) {
      return;
    }
    originalError.apply(console, from(arguments));
  };
}
export const enum path {
  old = '/old',
  new = '/new',
};
// export const contentStyle: CSSProperties = freeze({
//   textShadow: '0 0 9q currentColor',
//   fontWeight: 'bold',
//   color: 'Tan',
// });

const ValueToAccordion = ({
  title,
  detail,
}: {
  readonly title: string;
  readonly detail: ReactNode;
}) => {
  if (isUndefined(detail)) {
    return null;
  }
  return <Accordion className={style_old['Accordion'] ?? ''}
    defaultExpanded
    key={title}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      className={style_old['Accordion-Summary'] ?? ''}
    >
      <span className={clsx(tanContentClass, style['Main-Right--Show--Text'])}>{title}</span>
    </AccordionSummary>
    <AccordionDetails className={style_old['Accordion-Details'] ?? ''}>
      <p className={style['Main-Right--Show--Text']}>{detail}</p>
    </AccordionDetails>
  </Accordion>;
};
export const showAllCount = 36;
type BCVizContextType = {
  readonly graphData: OriginGraphDataReadonlyArr;
  readonly resultGraph: OriginGraphDataReadonlyArr | undefined;
  readonly selectMode: Modes;
  readonly useSetInputST: UseSetInputST;
  readonly setTab: SetStateType<TabKey>;
  readonly resultTable: PosDataObjArr | undefined;
  readonly clickEChartDotToAddMultiDots: onEChartsParamFunc;
} & HSSProps & SVGChartsProps;
export const BCVizContext = createContext<BCVizContextType>(
  {} as BCVizContextType
  // {
  // graphData: [],
  // resultGraph: [],
  // selectMode: Modes['Maximum Biclique'], useSetInputST: [{
  //   s: '',
  //   t: '',
  // }, () => { }],
  // setTab: () => { },
  // resultTable: [],
  // clickEChartDotToAddMultiDots: () => { },
  // isEditX: false,
  // size: undefined,
  // setSize: () => { },
  // dataArrWithPos: []
  // }
);
const CustomTab = ({ tabKey, ...props }: Omit<Parameters<typeof Tab>[0], 'label' | 'value' | 'className'> & {
  readonly tabKey: TabKey;
}) => <Tab label={TabKey2Title[tabKey]} value={tabKey} className={style['Tab'] ?? ''}
  {...props}
  />;
export default function BCViz_new () {
  // const ref = useRef<HTMLDivElement>(null);
  useMount(() => {
    const { origin, protocol, hash, host } = location;
    if (!sessionStorage['hjx'] && isPROD && origin !== baseURL && protocol === 'https:' && isChina()) {
      const href = baseURL + hash;
      if (confirm(`后端服务已上线，点击“确认”跳转.${href}`)) {
        location.href = href;
      } else {
        sessionStorage.setItem('hjx', 'hxj');
      }
    }
    // const { current } = ref;
    // if (current) {
    //   const resizeObserver = new ResizeObserver(() => {
    //   });
    //   resizeObserver.observe(current);
    // }
  });
  useEventListener('beforeunload', (event) => {
    if (isPROD && (tableData || graphData)) {
      event.preventDefault();
      const returnMsg = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = returnMsg;
      return returnMsg;
    }
    return;
  });
  const [isModalOpen] = useBoolean(false);
  const { tableData: originTableData, setTableData, graphData, setGraphData,
    svgSize, commonValueFromTableData, svgRef, } = useBCVizFnHooks();

  const { data: superData, runAsync: getSuperData, mutate: mutateSuperData } = useRequest(getSG, {
    ...commonUseRequestParams,
    manual: true,
  });
  const isBiggerThanShowAllCount = originTableData ? originTableData.length > showAllCount : false;
  useUpdateEffect(() => {
    mutate(undefined);
    if (originTableData) {
      if (isBiggerThanShowAllCount) {
        const meaninglessStr = '1';
        getSuperData({
          ...fileNames,
          s: meaninglessStr,
          t: meaninglessStr,
          problem_type: 'SG',
          vex_list: (10).toString(),
        });
      } else {
        mutateSuperData(undefined);
      }
    }
  }, [originTableData]);
  const isShowAllSelect = false;
  // || (originTableData && (originTableData.length > showAllCount));
  useUpdateEffect(() => {
    if (isShowAllSelect) {
      toast(`Dataset is too big! Only display top ${showAllCount} vertices.`);
      setNotShowAll();
    }

  }, [originTableData]);
  const { svgWidth = 0, svgHeight = 0 } = svgSize;
  const [dataset = '', setdataset] = useLocalStorageState<string>('dataset', {
    defaultValue: ''
  });//useSafeState<string>('');
  const [BCviz_file = '', setBCviz_file] = useLocalStorageState<string>('BCviz_file', {
    defaultValue: ''
  });
  const fileNames = { dataset, BCviz_file };
  const useGetFromST = useRequest(getFromST, {
    ...commonUseRequestParams,
    manual: true,
    // cacheKey: 'hjx',
    staleTime: -1,
    cacheTime: -1,
  });
  const { data: dataFromST, loading, mutate } = useGetFromST;
  const useSetInputST = useSetState<InputSTSetState>({
    s: '',
    t: ''
  });
  const [tab, setTab] = useSafeState(TabKey.table);
  const [selectMode, setSelectMode, resetSelectMode] = useResetState(
    // isDEV ? Modes['Hierarchical Subgraphs Search'] :
    Modes['Maximum Biclique']);
  const [selectEngine, setSelectEngine] = useSafeState<keyofRenderingEngine>(
    // isDEV ? 'SVG Engine' :
    'ECharts Engine');

  const isEditX = useMemo(() => isEditXFunc(selectMode), [selectMode]);
  const [selectShowItem, setSelectShowItem] = useSafeState<number>(0);
  const [selectShowItemHSS, setSelectShowItemHSS] = useSafeState<number>(0);
  const useMultiDots = useSafeState<OriginDataObjReadonlyArr | undefined>([]);

  const [multiDots, setMultiDots] = useMultiDots;
  const [isShowAll, { set: setIsShowAll, setTrue: setShowAll, setFalse: setNotShowAll }] = useBoolean(true);

  const tableData: OriginDataObjWithIndexArr = useMemo(() => getTableDataWithIndOrFilter(isShowAll, originTableData,), [originTableData, isShowAll]);
  const { size,
    UV, dataThisMode,
    dataArr,
    selectShowData,
    count, numOfData,
    params,
  } = useMemo(() => {
    const dataThisMode = dataFromST?.[selectMode];
    if (!dataThisMode) {
      return {};
    }
    const { count: numOfData, dataArr, ...params } = dataThisMode;
    const data = dataArr?.[selectShowItem];
    if (!data) {
      return {};
    }
    const { size, count, label, ...UV } = data;
    // const { u, v } = UV;
    // const filterTableData = dataArrWithPos?.filter(({ k, kInd }) => {
    //   return UV[k].includes(kInd);
    // });
    if (
      isEditX
      // || keys(UV).length === 0
    ) {  //是HSS模式
      return { size };
    }
    // const entriesUV = entries(UV);
    // const resultGraph = graphData?.filter((obj) => {
    //   // const filRes1 = entries(obj).every(([k, v]) => UV[k as UVenum]?.includes(v));
    //   // const filRes2 = entriesUV.every(([k, arr]) => arr.includes(obj[k as UVenum]));
    //   const filRes3 = every(obj, (v, k) => {
    //     return UV[k as UVenum]?.includes(v) ?? false;
    //   });
    //   // const filRes4 = every(UV, (arr, k) => {
    //   //   return arr?.includes(obj?.[k as UVenum]) ?? false;
    //   // });
    //   // if (filRes1 !== filRes2 || filRes2 !== filRes3 || filRes3 !== filRes4) {
    //   //   debugger;
    //   // }
    //   return filRes3;
    //   // return u?.includes(obj.u) && v?.includes(obj.v);
    // });

    // const filterTableData = tableData?.filter(({ k, kInd }) => {
    //   return UV[k]?.includes(kInd);
    // });
    // const filterTableDataWithIndOrFilter = getTableDataWithIndOrFilter(isShowAll, filterTableData,);
    // const resultTable = getDataArrWithPos(filterTableDataWithIndOrFilter, resultGraph, getCommonValueFromTableData(filterTableDataWithIndOrFilter, {
    //   svgWidth, svgHeight,
    // }), svgHeight);
    return {
      size,
      // resultGraph, resultTable,
      // u, v,
      UV,
      // label,
      dataThisMode,
      dataArr,
      selectShowData: data,
      count, numOfData,
      params,
    };
  }, [dataFromST, selectMode, selectShowItem, tableData]);
  const dataArrLength = dataArr?.length;
  const isEngineECharts = selectEngine === 'ECharts Engine';
  const isNotGetResult = isUndefined(size);
  const setSize: SetSizeProps['setSize'] = useMemoizedFn((size: execTextType['size']) => {
    mutate({
      ...dataFromST,
      // [Modes['Hierarchical Subgraphs Search']]: {
      //   size,
      // },
      [Modes['Hierarchical Subgraphs Search']]: {
        dataArr: [{
          size
        }]
      },
    });
  });

  useUpdateEffect(() => {
    setTab(
      // isDEV ? TabKey.all :
      TabKey.table);
    resetSelectMode();
  }, [tableData, selectEngine]);
  useUpdateEffect(() => {
    setMultiDots([]);
    // mutate(undefined);
  }, [tableData]);

  const dataArrWithPosWithoutColor = useMemo(() => {
    return getDataArrWithPos(tableData, graphData, commonValueFromTableData, svgHeight);
  }, [tableData, graphData, commonValueFromTableData, svgHeight]);

  const { dataArrWithPos, visualMapSection } = useMemo(() => {
    // setTrue();
    // const getDataArrWithPosParams: Parameters<typeof getDataArrWithPos> = [tableDataWithIndOrFilter, graphData, commonValueFromTableData, svgHeight];

    // const dataArrWithPos = isEngineECharts ? getDataArrWithPosForECharts(...getDataArrWithPosParams) : getDataArrWithPos(...getDataArrWithPosParams);
    const dataArrWithPos = dataArrWithPosWithoutColor;
    if (isEditX) {
      // return doubleClickCircleFn({ isEditX, dataArrWithPos, commonValueFromTableData, size, setSize });
      // return doubleClickCircleFnForECharts({ isEditX, dataArrWithPos, commonValueFromTableData, size }).datas;
      const { datas, visualMapSection } = doubleClickCircleFnForECharts({ isEditX, dataArrWithPos, size, commonValueFromTableData });
      const data = (selectShowItemHSS === 0 || !visualMapSection) ? datas : dataArrWithPosDrawColorWithVisualMapSection(dataArrWithPos, visualMapSection[selectShowItemHSS - 1]);
      return { dataArrWithPos: data, visualMapSection };
    }
    const dataArrWithPosAndUVColor: PosDataObjArr = UV ? dataArrWithPos?.map(item => {
      const { k, kInd } = item;
      const color: PosDataObj['color'] = UV[k]?.includes(kInd) ? uvHighlightColor : undefined;
      return color ? ({
        ...item,
        color,
      }) as PosDataObj : item;
    }) : dataArrWithPos;
    const dataArrWithPosAndMutilDotsColor: PosDataObjArr = getDataArrWithPosMutilDotsColor(dataArrWithPosAndUVColor, multiDots);
    return { dataArrWithPos: dataArrWithPosAndMutilDotsColor };
  }, [
    commonValueFromTableData,
    UV,
    selectMode,
    size,
    multiDots,
    selectShowItemHSS,
  ]);
  const getResult = useMemoizedFn(() => {
    if (isEditX || !UV) {
      const filterTableData = dataArrWithPos.filter(({ color }) => color);
      const groupByDot = getGroupByDot(filterTableData);
      const resultGraph = graphData.
        filter((obj) => {
          return every(obj, (v, k) => {
            return Boolean(groupByDot[k as UVenum][v]);
          });
        });
      return { resultGraph, filterTableData };
    }
    const resultGraph: Readonly<typeof graphData> = graphData.
      filter((obj) => {
        return every(obj, (v, k) => {
          return UV[k as UVenum]?.includes(v) ?? false;
        });
      });
    const filterTableData: Readonly<typeof tableData> = tableData.filter(({ k, kInd }) => {
      return UV[k]?.includes(kInd);
    });
    return { resultGraph, filterTableData };
  });
  const { resultGraph, resultTable, } = useMemo(() => {
    const { resultGraph, filterTableData } = getResult();
    // if (!UV) {
    //   return {};
    // }

    const filterTableDataWithIndOrFilter = getTableDataWithIndOrFilter(isShowAll, filterTableData,);
    // const resultTable = getDataArrWithPos(filterTableDataWithIndOrFilter, resultGraph, getCommonValueFromTableData(filterTableDataWithIndOrFilter, {
    //   svgWidth, svgHeight,
    // }), svgHeight);
    const resultTable = getDataArrWithPosWithCommonValueFromTableData(filterTableDataWithIndOrFilter, resultGraph, {
      svgWidth, svgHeight,
    });
    return {
      resultGraph, resultTable,
    };

  }, [UV, graphData, tableData, isEditX, dataArrWithPos]);
  const setTabToResult = useMemoizedFn(() => {
    if (!isNotGetResult) {
      // setTab(TabKey.result);
    }
  });

  // const NumOfDataSentence = isUndefined(count) ? null : <h4>
  //   The number of ({params?.s},{params?.t})-bicliques is: <span className={tanContentClass}>{numOfData}</span>
  // </h4>;

  // const { focused } = useFormControl() || {};
  const propsTabPanelInput: Omit<Parameters<typeof TabPanelInput>[0], 'modeKey'> = {
    useSetInputST, useGetFromST, fileNames,
    setTabToResult, dataArrWithPos: tableData ?? [], useMultiDots,
  };
  const clickEChartDotToAddMultiDots: onEChartsParamFunc = useMemoizedFn((eCElementEvent) => {
    const {
      // componentSubType,
      componentType,
      dataIndex,
      name,
      // seriesType,
      value,
      // dataType,

    } = eCElementEvent as CallbackDataParams;
    if (isEditX) {
      if (componentType === "markArea") {
        setSelectShowItemHSS(dataIndex + 1);
      }
      return;
    }
    if (isSafeInteger(dataIndex) && name && isSafeInteger(value) && typeof value === 'number') {
      const k_click = name[0];
      const kInd_click = parseInt(name.slice(1));
      // const tableDataGroupByDot = getGroupByDot(tableData);
      if (!tableData) {
        return;
      }
      const originDot = tableData.find(({ k, kInd }) => {
        return k === k_click && kInd === kInd_click;
      });
      if (!originDot) {
        return;
      }
      if (!multiDots || multiDots.length === 0) {
        setMultiDots([originDot]);
        return;
      }
      const isFindDot = multiDots.includes(originDot);
      if (isFindDot) {
        // const a = omit(multiDots, originDot);
        setMultiDots(multiDots.filter(i => i !== originDot));
      } else {
        setMultiDots([...multiDots, originDot]);
      }
    }

  });
  return (
    <>
      {/* <BCVizContext.Provider value={{}}> */}
      <Paper className={style['Main'] ?? ''} elevation={24}
      // ref={ref}
      // onClick={() => {

      // }}
      >
        <Settings {...{ setSelectEngine, selectEngine }} />
        <SideCollapse>
          <Paper elevation={24} className={style['Main-Left'] ?? ''}>
            <Tool {...{
              // setTableData, setGraphData,
              // toggleIsEditX, isEditX
            }}
              //@ts-expect-error
              setDatas={[setGraphData, setTableData]}
              setFileNames={[setdataset, setBCviz_file]}
              className={style['Tool']}
            />
            {(isShowAllSelect) ? <Paper elevation={24} className={style['Select'] ?? ''} >
              <FormControl fullWidth>
                <InputLabel
                >Numebr Of Show Vertices</InputLabel>
                <Select
                  value={Number(isShowAll)}
                  onChange={(e) => {
                    setIsShowAll(Boolean(e.target.value));
                  }}
                  label="Numebr Of Show Vertices"
                  fullWidth
                >
                  <MenuItem value={1} key={1}
                  >Show All</MenuItem>
                  <MenuItem value={0} key={0}
                    title={`Top ${showAllCount} in descending order of Cohesion`}
                  >Only Show {showAllCount}</MenuItem>
                </Select>
              </FormControl>
            </Paper> : null}
            <Paper elevation={24} className={style['Select'] ?? ''}>
              <FormControl fullWidth>
                <InputLabel
                // title={isEngineECharts ? `${Modes['Hierarchical Subgraphs Search']} is available only in SVG Engine` : ''}
                >Select Mode</InputLabel>
                <Select<Modes>
                  value={selectMode}
                  onChange={(e) => {
                    setSelectMode(e.target.value as Modes);
                  }}
                  label="Select Mode"
                  fullWidth
                >
                  {([
                    Modes['Maximum Biclique'],
                    Modes['Maximal Biclique Enumeration'],
                    Modes['(p,q)-biclique Counting'],
                    Modes['Hierarchical Subgraphs Search'],
                  ]).map((v) =>
                    // <>
                    <MenuItem value={v} key={v}
                      title={ModesShortcut[v]}
                    >{v}</MenuItem>
                    // </>
                  )}
                  {/* <MenuItem
                    value={Modes['Hierarchical Subgraphs Search']}
                    key={Modes['Hierarchical Subgraphs Search']}
                    disabled={isEngineECharts}
                  // title={isEngineECharts ? 'Available only in SVG Engine.Please switch to SVG Engine in settings.' : ''}
                  >
                    <div>
                      <Tooltip arrow
                        placement="right"
                        title={isEngineECharts ? 'Available only in SVG Engine.Please switch to SVG Engine in settings.' : ''}
                      >
                        <div>
                    {Modes['Hierarchical Subgraphs Search']}
                    </div></Tooltip>
                    </div>
                  </MenuItem> */}
                </Select>
                {/* <FormHelperText
                    title="Please switch to SVG Engine in settings"
                  >{`${Modes['Hierarchical Subgraphs Search']} is available only in SVG Engine`}</FormHelperText> */}
              </FormControl>
            </Paper>
            <Paper elevation={24} >
              <TabContext value={selectMode}>
                <TabPanelInput
                  {...propsTabPanelInput}
                  modeKey={Modes['Maximum Biclique']}
                />
                <TabPanelInput
                  {...propsTabPanelInput}
                  modeKey={Modes['Maximal Biclique Enumeration']}
                />
                <TabPanelInput
                  {...propsTabPanelInput}
                  modeKey={Modes['(p,q)-biclique Counting']}
                />
                <TabPanel value={Modes['Hierarchical Subgraphs Search']} className={style['TabPanel'] ?? ''}>
                  <Paper elevation={24} className={style['Paper-text'] ?? ''}>
                    <InputSize value={size} setSize={setSize} max={commonValueFromTableData.max} />
                  </Paper>
                </TabPanel>
              </TabContext>
            </Paper>

            {dataArr &&
              (
                (
                  arrayLengthBigThanNum(dataArrLength, 2))) ?
              <Paper elevation={24} className={style['Select'] ?? ''}><Tooltip title={<>Count: <span className={tanContentClass}>{dataArrLength}</span></>} arrow placement="right"><Autocomplete
                autoComplete
                autoCapitalize="words"
                autoFocus
                autoHighlight
                // autoSelect
                blurOnSelect
                clearOnBlur
                clearOnEscape
                fullWidth
                handleHomeEndKeys
                includeInputInList
                openOnFocus
                selectOnFocus
                disableClearable
                disableCloseOnSelect={false}
                disabledItemsFocusable={false}
                disableListWrap={false}
                disablePortal={false}
                filterSelectedOptions={false}
                freeSolo={false}
                options={dataArr}
                // getOptionLabel={ }
                {...selectShowData ? { value: selectShowData } : null}
                onChange={(e, v, r, d) => {
                  if (v) {
                    setSelectShowItem(dataArr.indexOf(v));
                  } else {
                    setSelectShowItem(0);
                  }
                }}
                renderInput={(params) => <AutocompleteRenderInput
                  {...params}
                  label='Choose Rank'
                  placeholder="Choose Rank"
                />}
                renderOption={(props, { label, ...option }, state) => {
                  const { autoFocus,
                    tabIndex,
                    className,
                    style,
                    ...others } = props;
                  return <Tooltip title={getTooltipTitle(option)} arrow placement="right"><AutoCompleteRenderOptionMenuItem {...props} >{label ?? `Rank ${state.index + 1}`}</AutoCompleteRenderOptionMenuItem></Tooltip>;
                }}
              /></Tooltip></Paper>
              : null}
            {(isEditX) ? <VisualMapSectionAutoComplete
              setSelectShowItem={setSelectShowItemHSS}
              selectShowItem={selectShowItemHSS}
              {...{ visualMapSection, dataArrWithPos, }} /> : null}
          </Paper >
        </SideCollapse>
        <Paper className={style['Main-Mid'] ?? ''} elevation={24}>
          <TabContext value={tab}>
            <Paper elevation={24}>
              {/* <AppBar position="static"> */}
              <TabList onChange={(_e, v) => setTab(v)}
                // indicatorColor="secondary"
                // textColor="inherit"
                variant="fullWidth"
              // scrollButtons
              // allowScrollButtonsMobile
              // role="navigation"
              >
                {/* <Tab label="All" value={TabKey.all} className={style['Tab'] ?? ''} /> */}
                <CustomTab tabKey={TabKey.table} />
                <CustomTab tabKey={TabKey.graph} />
                <Tooltip arrow
                  title={params ?
                    <>
                      <fieldset>
                        <legend className={tanContentClass}>
                          {/* <h4> */}
                          Search Params
                          {/* </h4> */}
                        </legend>
                        {entries(params).map(tanColorContentJsx)}
                        {/* <Divider /> */}
                      </fieldset></>
                    : null}
                // placement="right"
                >
                  <CustomTab tabKey={TabKey.result} disabled={isNotGetResult
                    // || isEditX
                  }
                  // className={
                  // clsx({ [style['Tab'] ?? '']: !isNotGetResult })
                  // // style['Tab'] ?? ''
                  // }
                  />
                </Tooltip>
                {isEngineECharts ? <CustomTab tabKey={TabKey.all} /> : null}
              </TabList>
              {/* </AppBar> */}
            </Paper>
            {/* <TabContext value={selectEngine}>
              <TabPanel value={"SVG Engine" as keyofRenderingEngine}>
                
              </TabPanel>
              <TabPanel value={"ECharts Engine" as keyofRenderingEngine}>
                
                
              </TabPanel>
            </TabContext> */}
            {dataArrWithPos.length ? (isEngineECharts ? <Echarts {...{
              dataArrWithPos, graphData, size, resultGraph,
              selectMode, useSetInputST,
              setTab, resultTable, setSize, isEditX,
              commonValueFromTableData, clickEChartDotToAddMultiDots, dataFromST,
              superData, visualMapSection,
            }} /> : <SVGCharts
              {...{
                commonValueFromTableData, graphData, dataArrWithPos, isEditX, svgRef, svgSize,
                // useGetFromST,
                setSize,
                size,
              }}
            />) : <Skeleton
              className={style['Chart'] ?? ''}
              variant="rounded"
              animation="wave" />}
          </TabContext>
        </Paper>
        {isNotGetResult ? null :
          <SideCollapse
            buttonOrder={1}
          // hidden={isNotGetResult}
          // className={clsx({ [style['hidden'] ?? '']: isNotGetResult })}
          >
            <Paper className={style['Main-Right'] ?? ''} elevation={0}>
              {/*  */}
              <Paper elevation={24} className={style['Main-Right--Show'] ?? ''}>
                {isUndefined(numOfData) ? null : <Tooltip arrow placement="left" title={isUndefined(numOfData) ? null : <h4>
                  The number of ({params?.s},{params?.t})-bicliques is: <span className={tanContentClass}>{numOfData}</span>
                </h4>}>
                  <h4 className={clsx(tanContentClass, style['Main-Right--Show--Num'])}><span>{numOfData}</span></h4>
                </Tooltip>}
                <ValueToAccordion
                  title="size"
                  detail={size}
                />
                {/* <Divider /> */}
                {UV ? entries(UV).map(([k, v]) => (
                  v.length ? <Accordion className={style_old['Accordion'] ?? ''}
                    // defaultExpanded
                    key={k}
                    defaultExpanded={v.length <= 23}
                  ><AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={style_old['Accordion-Summary'] ?? ''}
                  ><span className={clsx(tanContentClass, style['Main-Right--Show--Text'])}>{`${k} `}</span></AccordionSummary>
                    <AccordionDetails className={style_old['Accordion-Details'] ?? ''}>
                      {v.map(i => <p className={style['Main-Right--Show--Text'] ?? ''}>{i}</p>)}
                    </AccordionDetails>
                  </Accordion>
                    : null)
                ) : null}
                <ValueToAccordion
                  title="count"
                  detail={count}
                />
              </Paper>
              {/* </Tooltip> */}
            </Paper>
          </SideCollapse>}
      </Paper>
      <Modal open={isModalOpen || loading} className={style['Modal'] ?? ''}><CircularProgress className={style['CircularProgress'] ?? ''} /></Modal>

      {/* </BCVizContext.Provider> */}
    </>);
}
// const { log } = console;
// Promise.resolve(import.meta).then(log);
