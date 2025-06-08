import { Button, Dialog, Paper, TextField } from "@mui/material";
import { useBoolean, useMemoizedFn, useRequest, useSafeState, useSetState } from "ahooks";
import style from './_index.module.scss';
import { headFileExist, uploadFile, constructBCviz, getFile } from "@/pages/BCViz_new/api";
import { idbCommonArgs } from "@/pages/BCviz/FileUploadSimple";
import { waitMiddleEventLoop } from "@/utils";
import { createOrAddIdb } from "@/utils/idb";
import { str } from "crc-32";
import { useNavigate } from "react-router";
import { every, isUndefined, map, some } from "lodash";
import { setSearchParamForDataset, setStateOnChange } from "../utils";
import { TextFieldProps_Number } from "@/pages/BCViz_new/const";
import { commonUseRequestParams } from "@/utils/const";
import Loading from "../Loading";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { unstable_batchedUpdates } from "react-dom";
const { abs } = Math;

const getFileNameBEWithExt = (hash: string) => `${hash}.txt`;
const getWillResolveData = ({ fileNameBEWithExt, text }: {
  readonly fileNameBEWithExt: string;
  readonly text: string;
}) => {
  return {
    fileInfo: {
      lastModified: Date.now(),
      name: fileNameBEWithExt,
      size: text.length,
      // type: headers.get('content-type') ?? '',
      // downloadUrl,
    },
    fileData: text,
  };
};
export default function ConfirmModal (props: {
  readonly text: string;
  readonly fileName: string;
}) {
  const { text, fileName } = props;
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  const navigate = useNavigate();
  const [st_min, setSTmin] = useSetState({
    s_min: 1,
    t_min: 1
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [hash, setHash] = useSafeState('');
  const confirmFn = useMemoizedFn(async () => {
    try {

      const fileNameFEWithExt = `${fileName}.txt`;  // 前端展示文件名
      const fileNameBEWithExt = getFileNameBEWithExt(hash);  // 后端文件名
      const fileNameBEWithExt_cohesion = `${hash}_cohesion${every(st_min, min => min === 1) ?
        '' : [st_min.s_min, st_min.t_min].map(s => `_${s}`).join('')
        }.txt`;
      const datasetsFileFolder = 'datasets/';
      // const fileNameBEWithExt = fileNameBEWithExt;//`${datasetsFileFolder}${fileNameBEWithExt}`;
      const [fetchSeeIsDatasetExist, fetchSeeIsBCvizFileExist] = await Promise.all([fileNameBEWithExt, fileNameBEWithExt_cohesion].map(headFileExist));
      // .then((res) => res.every(Boolean), () => false);

      // if (!fetchSeeIsExit) {
      // const fetchSeeIsDatasetExist = await headFileExist(fileNameBEWithExt);
      if (!fetchSeeIsDatasetExist) {
        await uploadFile(text, fileNameBEWithExt);
      }
      await waitMiddleEventLoop();
      // const fetchSeeIsBCvizFileExist = await headFileExist(fileNameBEWithExt_cohesion);
      if (!fetchSeeIsBCvizFileExist) {
        await constructBCviz({
          dataset: fileNameBEWithExt,
          ...st_min,
        });
        // }
        // await constructBCviz_old(text, fileNameBEWithExt);
        await waitMiddleEventLoop();
        // await uploadFile(text, fileNameBEWithExt);
      }
      // if (isPROD) {

      const BCviz_file = await getFile(fileNameBEWithExt_cohesion).then(res => {
        return res?.fileData;
      });
      if (!BCviz_file) {
        toast.error(`construct ${fileNameBEWithExt_cohesion} is empty!`);
        return;
      }

      const searchParams = new URLSearchParams({
        dataset: fileNameBEWithExt,
        BCviz_file: fileNameBEWithExt_cohesion,
      });
      navigate({
        pathname: '/',
        search: `?${searchParams.toString()}`
      });

      // 构建符合 HashRouter 结构的 URL
      // const targetUrl = `${window.location.origin}/#/?${searchParams.toString()}`;

      // // 在新标签页打开
      // window.open(targetUrl, '_blank');

      // }
      // const url = new URL('/', location.origin);
      // url.searchParams.set('dataset', fileNameBEWithExt);
      // url.searchParams.set('BCviz_file', `${hash}_cohesion.txt`);
      // open(url, '_blank');
      // if (isPROD) {
      const willResolveData = getWillResolveData({ fileNameBEWithExt, text });
      createOrAddIdb({
        ...idbCommonArgs, data: willResolveData, IDBValidKey: fileNameBEWithExt
      });
      // }
      // localStorage.setItem(fileNameFEWithExt, fileBEPath);
      // localStorage.setItem(`${fileName}_cohesion.txt`, fileBEPath);
      // await waitMiddleEventLoop();

      // }}

    } catch (e) {
      // alert('something error');
      console.error(e);
    }
  });
  const { run, loading } = useRequest(confirmFn, {
    ...commonUseRequestParams,
    manual: true,
  });
  return <><Dialog open={isOpen} onClose={() => {
    setFalse();
  }}>

    <Paper elevation={24} className={style['Paper'] ?? ""}>
      <TextField
        multiline
        maxRows={9}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        label='Text of bipartite graph'
        title='Readonly TextArea'
        required
        // spellCheck
        // autoCapitalize='on'
        // enterKeyHint='next'
        translate='yes' //控制元素内容是否应被浏览器自动翻译。
        value={text}
      />
      {map(st_min, (min, key) => {
        // const label =``
        return <>
          <TextField
            fullWidth
            placeholder={key}
            label={key}
            {...TextFieldProps_Number}
            title={key}
            value={min}
            onChange={setStateOnChange(setSTmin, key)}
            required
            spellCheck
            autoCapitalize='on'
            enterKeyHint='next'
            translate='yes' //控制元素内容是否应被浏览器自动翻译。
            unselectable='off'
          />

        </>;
      })}
      <Button fullWidth variant="contained" size="large"
        disabled={some(st_min, isUndefined)}
        onClick={run}
      >Confirm</Button>
    </Paper>

  </Dialog>
    <Loading open={loading} />
    <Button fullWidth variant="contained" size="large"
      onClick={() => unstable_batchedUpdates(() => {
        const hash: string = abs(str(text)).toString(36);
        setHash(hash);
        const fileNameBEWithExt = getFileNameBEWithExt(hash);
        setSearchParamForDataset(setSearchParams)(fileNameBEWithExt);
        setTrue();
        createOrAddIdb({
          ...idbCommonArgs, data: getWillResolveData({ fileNameBEWithExt, text }), IDBValidKey: fileNameBEWithExt
        });
      })}
      disabled={!text}

    >Next Step</Button>
  </>;
}