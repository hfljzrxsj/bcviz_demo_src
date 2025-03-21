import { commonUseRequestParams } from "@/utils/const";
import ResumeComponent from "@/components/ResumeComponent";
import ResumeSame from "@/components/ResumeSame";
import { waitLastEventLoop } from "@/utils";
import { emit } from "@/utils/message";
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import { useRequest, useSafeState, useUpdateEffect } from "ahooks";
import axios from "axios";
// import * as classNames from "classnames";
import { createContext, StrictMode } from "react";
import style from './_index.module.scss';
export type SettingsResponseValue = ReadonlyArray<string> | {
  readonly titles: ReadonlyArray<string>;
  readonly items: ReadonlyArray<string>;
};
type specialData = ReadonlyArray<{
  readonly uses: ReadonlyArray<string>;
  readonly des: Record<string, ReadonlyArray<string>>;
}>;
type SettingsResponse = Record<string, SettingsResponseValue>;
const classNames = (...args: ReadonlyArray<string | undefined>) => args.filter(Boolean).join(' ');
export const specialContext = createContext<specialData>([]);
export const choiceSpecialContext = createContext<ReadonlyArray<string>>([]);
let setInternalFocusTimeId: NodeJS.Timeout = Object();
let lastFocus = true;
export const setLastFocus = (bool: boolean) => {
  lastFocus = bool;
};
export default function Resume () {
  const { data, loading } = useRequest(() =>
    axios.get<SettingsResponse>(`${import.meta.env.VITE_resumeFolder}/settings.json`).then(e => e.data)
    , commonUseRequestParams);
  const { data: specialData } = useRequest(() => axios.get<specialData>(`${import.meta.env.VITE_resumeFolder}/plans.json`).then(e => e.data)
    , commonUseRequestParams);
  const [choices, setChoices] = useSafeState<ReadonlyArray<string>>([]);
  useUpdateEffect(() => {
    if (specialData) {
      setChoices(specialData.map(i => Object.keys(i.des)[0] ?? ''));
    }
  }, [specialData]);
  useUpdateEffect(() => {
    const func = () => {
      if (document.visibilityState === 'visible') {
        emit();
        setLastFocus(true);
      }
    };
    if (specialData) {
      (function setInternalFocus () {
        setInternalFocusTimeId = setTimeout(() => {
          waitLastEventLoop(() => {
            const nowFocus = document.hasFocus();
            if (!lastFocus && nowFocus) {
              waitLastEventLoop(emit);
            }
            lastFocus = nowFocus;
            setInternalFocus();
          });
        }, 1e3);
      })();
      document.addEventListener('visibilitychange', func);
    }
    return () => {
      clearTimeout(setInternalFocusTimeId);
      document.removeEventListener('visibilitychange', func);
    };
  }, [specialData]);
  if (loading || !data || !specialData || !choices.length) {
    return <CircularProgress size="9in" />;
  }

  return <StrictMode>
    <specialContext.Provider value={specialData}>
      <choiceSpecialContext.Provider value={choices}>
        <Paper elevation={24}
          className={classNames(style['Paper'], style['PaperBody'])}
        >
          <Paper elevation={24}
          >
            {
              specialData?.map((i, ind) => <>
                <FormControl fullWidth title={choices[ind]}>
                  <InputLabel title={choices[ind]}>{choices[ind]}</InputLabel>
                  <Select
                    autoFocus
                    key={i.uses.toString()}
                    value={choices[ind]}
                    label={choices[ind]}
                    title={choices[ind]}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value) {
                        const arr = [...choices];
                        arr[ind] = value;
                        setChoices(arr);
                      }
                    }}
                  >
                    {Object.keys(i.des).map(d => <MenuItem value={d} key={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </>
              )
            }
          </Paper>
          {Object.entries(data).map(([k, v]) => <StrictMode>
            <Paper elevation={24} key={k}>
              <ResumeComponent
                k={k}
                v={v}
                path={k}
              /></Paper>
          </StrictMode>)}
          <ResumeSame />
          <Button variant="contained" size="large"
            className={style['toTop'] ?? ''}
            onClick={() => {
              document.body.scrollIntoView({ behavior: 'smooth' });
            }}
          >↑回到顶部↑</Button>
        </Paper>

      </choiceSpecialContext.Provider>
    </specialContext.Provider>
  </StrictMode>;
}