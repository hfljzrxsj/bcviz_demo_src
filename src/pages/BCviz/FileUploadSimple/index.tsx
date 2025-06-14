import { Paper, Button, Divider, Chip, TextField } from "@mui/material";
import classNames from "clsx";
import { unstable_batchedUpdates } from "react-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import style from './_index.module.scss';
import { useMemoizedFn, useSafeState, useSetState, useUnmount } from "ahooks";
import { waitLastEventLoop } from "@/utils";
import FileInfo from "../FileInfo";
import type { JSON_ARR, WillPatchData, parseData } from "../FileUpload";
import type { SetStateType } from "../types";
import FileUploadExample from "../FileUploadExample";
import { createOrAddIdb, type IndexedDBProps } from "@/utils/idb";
import { toast } from 'react-toastify';
import { getFile } from "@/pages/BCViz_new/api";
const { revokeObjectURL, createObjectURL } = URL;
const { freeze } = Object;
const { error } = console;
const initFileInfo = ({
  lastModified: 0,
  name: '',
  size: 0,
  type: '',
  downloadUrl: '',
});
export type FileInfoType = Partial<typeof initFileInfo>;
const revokeDownloadUrl = (downloadUrl: string | undefined) => {
  if (downloadUrl) {
    revokeObjectURL(downloadUrl);
  }
};

const unloadRevokeDownloadUrl = (downloadUrl: string) => (ele: Window | Document | Element | ChildNode | DocumentType | null | undefined) => {
  if (ele) {
    const bindFunc = revokeDownloadUrl.bind(null, downloadUrl);
    ele.addEventListener('beforeunload', bindFunc);
    ele.addEventListener('unload', bindFunc);
  }
  // else {
  //   console.log(ele);
  // }
};
export const getDownloadUrl = (file: Parameters<typeof createObjectURL>[0]) => {
  const downloadUrl = createObjectURL(file);
  waitLastEventLoop(() => {
    const composeUnloadRevokeDownloadUrl = unloadRevokeDownloadUrl(downloadUrl);
    composeUnloadRevokeDownloadUrl(window ?? self ?? globalThis ?? this);
    composeUnloadRevokeDownloadUrl(document);
    const { documentElement,
      body,
      head,
      scrollingElement,
      firstElementChild,
      lastElementChild,
      activeElement,

      firstChild,
      lastChild,

      // currentScript,
      // parentElement,
      // fullscreenElement,
      // pointerLockElement,
      // pictureInPictureElement,

      doctype,
      defaultView,

    } = document;

    composeUnloadRevokeDownloadUrl(head);
    composeUnloadRevokeDownloadUrl(body);
    // composeUnloadRevokeDownloadUrl(currentScript);
    composeUnloadRevokeDownloadUrl(documentElement);
    composeUnloadRevokeDownloadUrl(activeElement);
    composeUnloadRevokeDownloadUrl(firstElementChild);
    composeUnloadRevokeDownloadUrl(lastElementChild);
    // composeUnloadRevokeDownloadUrl(parentElement);
    composeUnloadRevokeDownloadUrl(scrollingElement);
    // composeUnloadRevokeDownloadUrl(fullscreenElement);
    // composeUnloadRevokeDownloadUrl(pointerLockElement);
    // composeUnloadRevokeDownloadUrl(pictureInPictureElement);
    composeUnloadRevokeDownloadUrl(lastChild);
    composeUnloadRevokeDownloadUrl(doctype);
    composeUnloadRevokeDownloadUrl(defaultView);
    composeUnloadRevokeDownloadUrl(firstChild);
  });
  return downloadUrl;
};
export type defaultTxt = ReadonlyArray<string>;
export const idbCommonArgs: IndexedDBProps = freeze({
  DBname: 'HJX',
  storeName: 'HXJ',
});
export interface fetchDataReturn {
  readonly fileInfo: FileInfoType;
  readonly fileData: string;
}
export const withDownloadUrl = (data: fetchDataReturn): fetchDataReturn => {
  return ({
    ...data,
    fileInfo: {
      ...data.fileInfo,
      downloadUrl: getDownloadUrl(new Blob([data.fileData]))
    }
  });
};
const UploadFileStr = 'Upload File';
const some_error_occur = 'some error occur';
const Please_input_URL = 'Please input URL';
export default function FileUploadSimple<T extends JSON_ARR> (props: {
  readonly parseData: parseData<T>;
  readonly setWillPatchData: SetStateType<WillPatchData<T>>;  // SetStateType<WillPatchData<T>>
  readonly defaultTxt: defaultTxt;
  readonly title: string;
}) {
  const { parseData, setWillPatchData, defaultTxt, title } = props;
  const [url, setUrl] = useSafeState('');
  const [fileInfo, setFileInfo] = useSetState<FileInfoType>(initFileInfo);
  useUnmount(() => {
    revokeDownloadUrl(fileInfo.downloadUrl);
  });
  const setWillPatchDataWithName = useMemoizedFn((data: T, name: string) => {
    setWillPatchData({
      fileName: name.match(/[^\/]+$/)?.[0] ?? name,
      data,
    });
  });
  const fetchDataFunc = useMemoizedFn((url: string) => {
    return getFile(url).then((res) => {
      if (res) {
        const { fileInfo, fileData } = res;
        const parseFileData = parseData(fileData);
        if (parseFileData.length === 0) {
          toast.error('The file format is incorrect!');
          return;
        }
        setFileInfo(fileInfo);
        setWillPatchDataWithName(parseFileData, url);
      }
    }, error).catch(error);
  });

  return <>
    <Paper elevation={24}>
      <h4 className={style['title']}>{title}</h4>
      <Paper elevation={24}
        className={classNames(style['Paper'], style['Input'])}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          fullWidth
          title={UploadFileStr}
        >
          {UploadFileStr}
          <input
            type="file"
            className={style['input-file']}
            onChange={(event) => unstable_batchedUpdates(() => {
              const file = event.target.files?.[0];
              if (!file) {
                alert(some_error_occur);
                return;
              }
              const fileReader = new FileReader();
              fileReader.readAsText(file);  // readAsDataURL
              fileReader.onload = (e) => {
                const result = e.target?.result || fileReader.result;
                if (typeof result === 'string') {
                  try {
                    // setWillPatchData(JSON.parse(result));
                    const { name, lastModified, size, type } = file;
                    setWillPatchDataWithName(parseData(result), name);
                    const downloadUrl = getDownloadUrl(file);
                    setFileInfo({
                      ...fileInfo,
                      name, lastModified, size, type,
                      downloadUrl,
                    });
                    const willResolveData = {
                      fileInfo: {
                        ...fileInfo,
                        name, lastModified, size, type,
                        downloadUrl,
                      },
                      fileData: result,
                    };

                    createOrAddIdb({
                      ...idbCommonArgs,
                      IDBValidKey: name,
                      data: willResolveData,
                    });
                  } catch (e) {
                    alert(some_error_occur);
                  }
                }
              };
            })}
            accept='.txt'
          />
        </Button>
        <Divider
          orientation="vertical"
          variant="fullWidth"
          flexItem
        >
          <Chip label="OR" />
        </Divider>
        <Paper elevation={24}
          className={style['TextField'] ?? ''}
        >
          <Paper elevation={24} className={style['TextField-Paper'] ?? ''}>
            <TextField
              label={Please_input_URL}
              onChange={e => {
                setUrl(e.target.value);
              }}
              value={url}
              // autoFocus
              fullWidth
              // focused
              placeholder={Please_input_URL}
              title={Please_input_URL}
              className={style['TextField-Paper-input'] ?? ''}
            />
            <Button
              size='large' variant="contained"
              disabled={!url}
              onClick={() => {
                return fetchDataFunc(url);
                // axios.get<string>(url, {
                //   responseType: 'text'
                // }).then(res => {
                //   const { headers, data } = res;
                //   console.log(data);
                //   if (typeof data === 'string') {
                //     try {
                //       const parseData = JSON.parse(data);
                //       setFileInfo({
                //         lastModified: Date.parse(headers['last-modified'] ?? ''),
                //         name: url,
                //         size: parseInt(headers['content-length'] ?? ''),
                //         type: headers['content-type'] ?? '',
                //         downloadUrl: URL.createObjectURL(new Blob([data])),
                //       });
                //       setWillPatchData(parseData);
                //     } catch {
                //       alert('输入格式不正确');
                //       return;
                //     }
                //   }
                //   return res;
                // });
              }}
            >Fetch</Button>
          </Paper>
          <FileUploadExample {...{ defaultTxt }}
            chooseExample={(url) => {
              setUrl(() => {
                fetchDataFunc(url);
                return url;
              });
            }}
          />
        </Paper>
      </Paper>
      <FileInfo fileInfo={fileInfo} />
    </Paper>
  </>
    ;
}