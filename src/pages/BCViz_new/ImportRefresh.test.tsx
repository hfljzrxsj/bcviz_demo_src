import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Paper, Tab, Modal, CircularProgress  // Tabs,
  , Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import { useBoolean, useSafeState, useSetState, useRequest, useMemoizedFn, useLocalStorageState, useMount } from "ahooks";
import { useMemo, type CSSProperties } from "react";
import { getCommonValueFromTableData, getDataArrWithPos, UVenum, type OriginDataObjArr, type OriginGraphDataReadonlyArr, type PosDataObj, type PosDataObjArr } from "../BCviz/utils";
import style from './_index.module.scss';
// import { type EChartsOption } from 'echarts';
import CommonCharts, { type EChartsOption } from "./CommonECharts";
import type { InputSTSetState } from "./InputST";
import { baseURL, getFromST } from "./api";
import { commonUseRequestParams } from "@/utils/const";
import clsx from "clsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import SideCollapse from "./SideCollapse";
import Tool from "../BCviz/Tool";
import TabPanelInput from "./TabPanelInput/TabPanelInput";
import { renderToStaticMarkup } from "react-dom/server";
import { debounce, map } from "lodash";
import { isChina } from "./getIntl";
import { isDEV } from "@/utils/isEnv";
import { Modes } from "./utils";

import { useEffect } from "react";

export default () => {
  useEffect(() => {
    console.log(TabContext, TabList, TabPanel);
    console.log(
      Paper, Tab, Modal, CircularProgress
      , Select, MenuItem, FormControl, InputLabel,
    );
    console.log(useBoolean, useSafeState, useSetState, useRequest, useMemoizedFn, useLocalStorageState, useMount);
    console.log(useMemo,);
    console.log(getCommonValueFromTableData, getDataArrWithPos,);
    console.log(style);
    console.log(CommonCharts,);
    console.log(UVenum);
    console.log(baseURL, getFromST);
    console.log(commonUseRequestParams);
    console.log(clsx);
    console.log(ToastContainer, toast);
    console.log(SideCollapse);
    console.log(Tool);
    console.log(TabPanelInput);
    console.log(renderToStaticMarkup);
    console.log(debounce, map);
    console.log(isChina);
    console.log(isDEV);
    console.log(Modes);
  }, []);
  return <>
    1111
  </>;
};