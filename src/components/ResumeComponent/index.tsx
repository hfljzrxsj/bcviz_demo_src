import { choiceSpecialContext, setLastFocus, specialContext, type SettingsResponseValue } from "@/pages/Resume";
import { enumActionName, enumSeverity, enumSnackbarAlert, type snackbarAlertAction } from "@/store/SnackBarRuducer";
import { Button, Collapse, Paper, Tooltip } from "@mui/material";
import { useRequest, useSafeState, useUpdateEffect } from "ahooks";
import { StrictMode, useContext, type Dispatch } from "react";
import { useDispatch } from "react-redux";
import style from './_index.module.scss';
import copy from 'copy-text-to-clipboard';
import { waitLastEventLoop } from "@/utils";
import { commonUseRequestParams, MediaQueryContext } from "@/App";
import { del, on, setLastTime } from "@/utils/message";
const last: {
  dom: HTMLButtonElement | null;
  path: string;
  filename: string;
} = {
  dom: null,
  path: '',
  filename: '',
};
const successClass = 'MuiButton-containedSuccess';
const removeClass = (dom: typeof last.dom) => {
  dom?.classList.remove(successClass);
};
const targetChangeStyle = (path: string) => (filename: string) => (target: EventTarget) => {
  if (target instanceof HTMLButtonElement) {
    removeClass(last.dom);
    target.classList.add(successClass);
    last.dom = target;
    last.path = path;
    last.filename = filename;
    document.title = filename;
  }
};
const fetchArr = (sumPath = '', fileType = ["md", "txt"]) => (fileType.map(i => fetch(`${import.meta.env.VITE_resumeFolder}/${sumPath}.${i}`).then(e => e.text()).then(t => {
  if (t.startsWith('<!DOCTYPE html>')) {
    throw new Error('');
  }
  return t;
})));
const visibilitychangeFunc = (path: string, k: string, copyCompose: ReturnType<ReturnType<typeof copyFetch>>) => (v: ReadonlyArray<string>) => {
  const { dom, path: lastPath, filename } = last;
  if (lastPath === path && dom) {
    waitLastEventLoop(() => {
      const { nextElementSibling } = dom;
      const firstItem = v[0];
      if (nextElementSibling instanceof HTMLButtonElement) {
        if (filename === k && firstItem) {
          copyCompose(firstItem)(nextElementSibling);
        } else if (v.includes(filename)) {
          const findFilename = v[v.indexOf(filename) + 1];
          if (findFilename) {
            copyCompose(findFilename)(nextElementSibling);
          }
        }
      } else if (nextElementSibling instanceof HTMLDivElement) {
        const button = nextElementSibling.querySelector('button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium');
        if (button instanceof HTMLButtonElement && firstItem) {
          copyCompose(firstItem)(button);
        }
      }
    });

  }
};

export const copyFetch = (dispatch: Dispatch<snackbarAlertAction>) => (path: string) => (filename: string, { copySelf = false }: {
  readonly copySelf: boolean;
} = {
    copySelf: false,
  }) => (target: EventTarget) => {
    setLastTime(Date.now());
    setLastFocus(true);
    const sumPath = `${path}/${filename}`;
    const successAction = () => targetChangeStyle(path)(filename)(target);
    if (copySelf) {
      copy(filename);
      dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: filename, [enumSnackbarAlert.severity]: enumSeverity.success } });
      successAction();
      return;
    }
    let errorRetry = false;
    (function request () {
      Promise.race(fetchArr(sumPath)).then(t => {
        if (!t) {
          dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: sumPath, [enumSnackbarAlert.severity]: enumSeverity.warning } });
          return;
        }
        copy(t.trimEnd());
        dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: sumPath, [enumSnackbarAlert.severity]: enumSeverity.success } });
        successAction();
      }).catch((e) => {
        console.error(e);
        dispatch({ type: enumActionName.OPENTRUE, payload: { [enumSnackbarAlert.alertText]: sumPath, [enumSnackbarAlert.severity]: enumSeverity.error } });
        if (!errorRetry) {
          request();
        }
        errorRetry = true;
      });
    })();
  };
const isStringArray = (v: SettingsResponseValue): v is ReadonlyArray<string> => Array.isArray(v);
interface Props {
  readonly k: string;
  readonly v: SettingsResponseValue;
  readonly path: string;
  readonly isSpecial?: boolean;
}
export default function ResumeComponent (props: Props) {
  const { k, v, path, isSpecial = false, ...others } = props;
  const [isUnFold, setFold] = useSafeState(true);
  const dispatch = useDispatch<Dispatch<snackbarAlertAction>>();
  const copyCompose = copyFetch(dispatch)(path);
  const choices = useContext(choiceSpecialContext);
  const special = useContext(specialContext);
  const newVArr = isStringArray(v) ? v.filter(i => {
    if (special.some((s, ind) => {
      const { uses, des } = s;
      if (uses.some(u => path === u || path.startsWith(`${u}/`))) {
        for (const o in des) {
          if (o !== choices[ind]) {
            if (des[o]?.includes(i)) {
              return true;
            }
          }
        }
      }
      return false;
    })) {
      return false;
    }
    return true;
  }) : [];
  useUpdateEffect(() => {
    const func = () => {
      visibilitychangeFunc(path, k, copyCompose)(newVArr);
    };
    if (newVArr.length) {
      on(func);
    }
    return () => {
      del(func);
    };
  }, [newVArr]);
  const { data: times } = useRequest(() => isSpecial ? fetch(`${import.meta.env.VITE_resumeFolder}/${path}/times.txt`).then(e => e.text()).then(t => {
    if (t.startsWith('<!DOCTYPE html>')) {
      return '';
    }
    return t;
  }) : Promise.resolve().then(() => ''), commonUseRequestParams);
  const matches = useContext(MediaQueryContext);
  return <StrictMode>
    <Paper elevation={24}
      className={style['Paper'] ?? ''}
      {...others}
    >
      <Tooltip title={times} placement="top"
        arrow
      ><Button size="large" fullWidth variant="contained" onClick={e => {
        let { target } = e;
        while (target instanceof HTMLElement && !(target instanceof HTMLButtonElement)) {
          const { parentElement } = target;
          if (!parentElement) {
            break;
          }
          target = parentElement;
        }
        if (target instanceof HTMLButtonElement) {
          if (isSpecial && !isUnFold) {
            copyCompose(k, { copySelf: true })(target);
          } else if (isUnFold && target === last.dom) {
            removeClass(target);
          }
        }
        setFold(!isUnFold);
      }}
        color={isSpecial ? "info" : "secondary"}
        className={style['CollapseButton'] ?? ''}
      ><span>{isUnFold ? '▲折叠' : '▼展开'}</span> <span>{k}</span> <span>{matches ? times : ''}</span>

        </Button></Tooltip>

      <Collapse in={isUnFold}><Paper elevation={24}>{
        isStringArray(v) ? <StrictMode>
          <Paper elevation={24} className={style['PaperButtons'] ?? ''}>
            {isSpecial && <Button
              variant="outlined"
              onClick={e => copyCompose(k, { copySelf: true })(e.target)}
              title={k}
            >名称</Button>}
            {newVArr.map(i => <Button variant="contained" key={i}
              onClick={e => copyCompose(i)(e.target)}
              title={i}
            >{i}</Button>)
            }
          </Paper>
        </StrictMode> : v.titles.map(i => <ResumeComponent
          k={i}
          key={i}
          v={v.items}
          path={`${k}/${i}`}
          isSpecial
        />)
      }
      </Paper></Collapse>
    </Paper>
  </StrictMode>;
}