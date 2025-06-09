import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Dialog, Paper, Tab } from "@mui/material";
import { useBoolean, useMemoizedFn, useMount, useSafeState, useSetState, useUpdateEffect } from "ahooks";
import { UVEnumArr, useGraghDataHistoryTravel, type UseGraghDataHistoryTravel } from "..";
import type { UseSafeStateReturnType } from "@/pages/BCViz_new/TabPanelInput/TabPanelInput";
import style from './_index.module.scss';
import { initUVcount } from "../devTestData";
import UVEnumTextfields from "../UVEnumTextFields";
import type { UseUVCount } from "../UVEnumTextFields";
import FileUploadSimple from "@/pages/BCviz/FileUploadSimple";
import { fileUploadSimpleProps, parseGraphData, type WillPatchData } from "@/pages/BCviz/FileUpload";
import type { OriginGraphDataReadonlyArr } from "@/pages/BCviz/types";
import { useMemo } from "react";
import { clone, mapValues } from "lodash";
import { UVenum } from "@/pages/BCviz/utils";
import { isDEV } from "@/utils/isEnv";
import { useSearchParams } from "react-router-dom";
import { getFile } from "@/pages/BCViz_new/api";
import { datasetKey, setSearchParamForDataset } from "../utils";
import { unstable_batchedUpdates } from "react-dom";
import { commonUseSearchParams } from "@/pages/BCviz/const";
const { isArray } = Array;
const enum TabKey {
  'create',
  'history',
  'file'
}
const maxIndex = 99;

function findMaxUV (arr: OriginGraphDataReadonlyArr) {
  const maxUV = clone(arr[0]);
  if (!maxUV) {
    return null;
  }

  for (const obj of arr) {
    for (const key in obj) {
      const uv = key as UVenum;
      const value = obj[uv];
      if (value > maxIndex) {
        return null;
      }
      if (value > maxUV[uv]) {
        maxUV[uv] = value;
      }
    }
  }

  return maxUV;
}
const fileUploadProp = mapValues(fileUploadSimpleProps[0], (value, key) => {
  return isArray(value) ? [value[0], value[3]] : value;
}) as (typeof fileUploadSimpleProps)[number];
export default function InitModal (props: {
  readonly useFileName: UseSafeStateReturnType<string>,
  // readonly setGraghData: SetStateType<OriginGraphDataReadonlyArr>;
  readonly setGraghData: UseGraghDataHistoryTravel['setValue'];
} & UseUVCount) {
  const { useFileName, useUVCount, setGraghData } = props;
  const [, setUvCount] = useUVCount;
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  const [tab, setTab] = useSafeState<number>(
    isDEV ? TabKey.file :
      TabKey.create);
  const [fileName, setFileName] = useFileName;
  const useUVCountInner = useSetState(initUVcount);
  const [uvCountInner, setUvCountInner] = useUVCountInner;

  const [willPatchData, setWillPatchData] = useSafeState<WillPatchData<OriginGraphDataReadonlyArr>>();

  const isButtonDisabled = useMemo(() => {
    switch (tab) {
      case TabKey.create: {
        return UVEnumArr.some(uv => !uvCountInner[uv]);
      }
      case TabKey.file: {
        return !willPatchData;
      }
    }
    return true;
  }, [tab, uvCountInner, willPatchData]);
  const [searchParams, setSearchParams] = useSearchParams();
  const comfirmFile = useMemoizedFn(({ data, fileName }: NonNullable<typeof willPatchData>) => {
    const maxUV = findMaxUV(data);
    if (maxUV) {
      setUvCount(maxUV);
      setFileName(fileName);
      setGraghData(data);
      setSearchParamForDataset(setSearchParams)(fileName);
      setFalse();
    }
  });
  const openDialog = useMemoizedFn(() => unstable_batchedUpdates(() => {
    setSearchParams(new URLSearchParams(), commonUseSearchParams);
    setTrue();
  }));
  useUpdateEffect(() => {
    const fileName = searchParams.get(datasetKey);
    if (!fileName) {
      return openDialog();
    }
    getFile(fileName).then((fetchDataReturn) => {
      if (!fetchDataReturn) {
        return openDialog();
      }
      const { fileData } = fetchDataReturn;
      comfirmFile({
        fileName,
        data: parseGraphData(fileData)
      });
      return setFalse();
    }, (e) => {
      console.error(e);
      return openDialog();
    });
  }, [searchParams]);

  // const [] = useUVCount;
  return <Dialog open={isOpen} className={style['Dialog'] ?? ""}>
    <Paper elevation={24} className={style['Paper'] ?? ""}>
      <TabContext value={tab}>
        <TabList onChange={(e, v) => setTab(v)} >
          <Tab label="Create New" value={TabKey.create}
            className={style['Tab'] ?? ''}
          />
          <Tab label="From File" value={TabKey.file}
            className={style['Tab'] ?? ''}
          />
        </TabList>
        <TabPanel value={TabKey.create} >
          <Paper elevation={24} className={style['TabPanel'] ?? ""}
          // sx={{
          //   '& .MuiTextField-root': { m: 1, width: '25ch' },
          // }}
          >
            {/* <TextField
              fullWidth
              placeholder='Please enter filename'
              label='Please enter filename'
              title='Please enter filename'
              value={fileName}
              required
              onChange={(e) => {
                const { value } = e.target;
                if (!value) {
                  return;
                }
                setFileName(value);
              }}
              type="search"
              spellCheck
              autoCapitalize='on'
              enterKeyHint='next'
              translate='yes' //控制元素内容是否应被浏览器自动翻译。
              // unselectable='on'
              inputMode="search"
              error={!fileName}
            /> */}

            <UVEnumTextfields
              useUVCount={useUVCountInner}
              labelFunc={(uv) => `Please enter count of ${uv}`}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={TabKey.file}>
          {
            fileUploadProp ?
              //@ts-expect-error
              <FileUploadSimple<OriginGraphDataReadonlyArr>
                {...fileUploadProp}

                setWillPatchData={(v) => {
                  if (typeof v === 'object') {
                    const { data } = v;
                    const maxUV = findMaxUV(data);
                    if (maxUV) {
                      setWillPatchData(v);
                    } else {
                      alert('The dataset is too large!');
                    }

                  }
                }}
              /> : null
          }

        </TabPanel>
      </TabContext>
      <Button fullWidth size="large" disabled={
        isButtonDisabled
      }
        variant="contained"
        onClick={() => {
          switch (tab) {
            case TabKey.create: {
              setUvCount(uvCountInner);
              break;
            }
            case TabKey.file: {
              if (willPatchData) {
                comfirmFile(willPatchData);
              }
              break;
            }
          }

          setFalse();
        }}
      >Confirm</Button>
    </Paper>
  </Dialog>;
}