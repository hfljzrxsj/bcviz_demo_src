import { UVenum } from "@/pages/BCviz/utils";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Dialog, Paper, Tab, TextField } from "@mui/material";
import { useBoolean, useSafeState, useSetState } from "ahooks";
import { UVEnumArr } from "..";
import { UseSafeStateReturnType, UseSetStateReturnType } from "@/pages/BCViz_new/TabPanelInput/TabPanelInput";
import { isPROD } from "@/utils/isEnv";
const enum TabKey {
  'create',
  'history'
}

export default function InitModal (props: {
  readonly useFileName: UseSafeStateReturnType<string>,
  readonly useUVCount: UseSetStateReturnType<Record<UVenum, number>>;
}) {
  const { useFileName, useUVCount } = props;
  const [isOpen, { setFalse }] = useBoolean(true);
  const [tab, setTab] = useSafeState<number>(TabKey.create);
  const [fileName, setFileName] = useFileName;
  const [uvCount, setUvCount] = useUVCount;
  return <Dialog open={isOpen}>
    <Paper elevation={24}>
      <TabContext value={tab}>
        <TabList onChange={(e, v) => setTab(v)} >
          <Tab label="Create New" value={TabKey.create} />
        </TabList>
        <TabPanel value={TabKey.create} >
          <Paper elevation={24}>
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
              return <TextField
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
                error={uvCount[uv] <= 0}
                value={uvCount[uv]}
                onChange={(e) => {
                  setUvCount(({
                    [uv]: Number(e.target.value),
                  }) as (typeof uvCount));
                }
                }
                inputProps={{
                  min: 0,
                  inputMode: 'numeric',
                  pattern: '^(0|[1-9]\d*)$',
                  max: 99,
                }}
              />;
            })
            }
          </Paper>
        </TabPanel>
      </TabContext>
      <Button fullWidth size="large" disabled={
        // !fileName ||
        UVEnumArr.some(uv => uvCount[uv] === 0)
      }
        onClick={() => {
          setFalse();
        }}
      >Confirm</Button>
    </Paper>
  </Dialog>;
}