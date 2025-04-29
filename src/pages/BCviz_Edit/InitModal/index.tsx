import { UVenum } from "@/pages/BCviz/utils";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Dialog, Paper, Tab, TextField } from "@mui/material";
import { useBoolean, useSafeState, useSetState } from "ahooks";
import { UVEnumArr } from "..";
import { UseSafeStateReturnType, UseSetStateReturnType } from "@/pages/BCViz_new/TabPanelInput/TabPanelInput";
import { isPROD } from "@/utils/isEnv";
import style from './_index.module.scss';
import { initUVcount } from "../devTestData";
import { isUndefined } from "lodash";
const { isSafeInteger } = Number;
const enum TabKey {
  'create',
  'history'
}
type typeofUvCountInner = typeof initUVcount;

export default function InitModal (props: {
  readonly useFileName: UseSafeStateReturnType<string>,
  readonly useUVCount: UseSetStateReturnType<typeofUvCountInner>;
}) {
  const { useFileName, useUVCount: [, setUvCount] } = props;
  const [isOpen, { setFalse }] = useBoolean(true);
  const [tab, setTab] = useSafeState<number>(TabKey.create);
  const [fileName, setFileName] = useFileName;
  const [uvCountInner, setUvCountInner] = useSetState(initUVcount);
  // const [] = useUVCount;
  return <Dialog open={isOpen}>
    <Paper elevation={24} className={style['Paper'] ?? ""}>
      <TabContext value={tab}>
        <TabList onChange={(e, v) => setTab(v)} >
          <Tab label="Create New" value={TabKey.create}
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
            {UVEnumArr.map(uv => {
              const label = `Please enter count of ${uv}`;
              return (
                // <Paper elevation={24} className={style['input'] ?? ""}>
                <TextField
                  fullWidth
                  key={uv}
                  label={label}
                  title={label}
                  placeholder={label}
                  type="number"
                  required
                  spellCheck
                  autoCapitalize='on'
                  enterKeyHint='next'
                  translate='yes' //控制元素内容是否应被浏览器自动翻译。
                  inputMode="numeric"
                  error={(!uvCountInner[uv])}
                  value={uvCountInner[uv]}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === '' || isUndefined(value)) {
                      setUvCountInner(({
                        [uv]: undefined,
                      }) as typeofUvCountInner);
                    } else {
                      const n1 = parseInt(value);
                      const n2 = Number(value);
                      if (isSafeInteger(n1) && isSafeInteger(n2)) {
                        setUvCountInner(({
                          [uv]: n1,
                        }) as typeofUvCountInner);
                      }
                    }

                  }
                  }
                  inputProps={{
                    min: 0,
                    inputMode: 'numeric',
                    pattern: '^(0|[1-9]\d*)$',
                    max: 99,
                  }}
                  className={style['input'] ?? ''}
                />
              );
            })
            }
          </Paper>
        </TabPanel>
      </TabContext>
      <Button fullWidth size="large" disabled={
        // !fileName ||
        UVEnumArr.some(uv => !uvCountInner[uv])
      }
        variant="contained"

        onClick={() => {
          setUvCount(uvCountInner);
          setFalse();
        }}
      >Confirm</Button>
    </Paper>
  </Dialog>;
}