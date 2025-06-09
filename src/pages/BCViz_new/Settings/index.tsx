import { Button, Dialog, Divider, Paper, Select, FormControl, InputLabel, MenuItem, Tooltip, Fab, IconButton, Switch, FormControlLabel, ToggleButton, Link } from "@mui/material";
import { useBoolean, useLocalStorageState } from "ahooks";
import style from './_index.module.scss';
import classNames from "clsx";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { SetStateType } from "@/pages/BCviz/types";
import { delAllDB } from "@/utils/idb";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { waitLastEventLoop } from "@/utils";
export const enum RenderingEngine {
  'SVG Engine',
  'ECharts Engine'
}
export type keyofRenderingEngine = keyof typeof RenderingEngine;

// const HighlightHSSMode = () => <span className={tanContentClass}>{Modes['Hierarchical Subgraphs Search']}</span>;
const RenderingEngineToJsx = ({ renderingEngine }: {
  readonly renderingEngine: keyofRenderingEngine;
}) => {
  switch (renderingEngine) {
    // case "SVG Engine":
    //   return <>Suitable for small data volumes.<HighlightHSSMode /> is available, but few functions are available, and performance is low.</>;
    // case "ECharts Engine":
    //   return <>Suitable for large data volumes. With many available functions and high performance, but <HighlightHSSMode /> is not available.</>;
    case "SVG Engine":
      return <>It is unstable! Suitable for small data volumes, few functions are available, and performance is low.</>;
    case "ECharts Engine":
      return <>Suitable for large data volumes. With many available functions and high performance.</>;
  }
};
export const useIsEnableSuperGraphLocalStorageState = useLocalStorageState<boolean>;

const SelectRenderingEngineStr = 'Select Rendering Engine';
const What_is_Super_Graph = "What's Super Graph";
const SG_introURL = 'https://encyclopediaofmath.org/wiki/Hypergraph';
export default function Settings (props: {
  readonly setSelectEngine: SetStateType<keyofRenderingEngine>;
  readonly selectEngine: keyofRenderingEngine;
  readonly useIsEnableSuperGraph: ReturnType<typeof useIsEnableSuperGraphLocalStorageState>;
}) {
  const {
    setSelectEngine,
    selectEngine,
    useIsEnableSuperGraph: [isEnableSuperGraph = false, setIsEnableSuperGraph],
  } = props;
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  // const [dbLength, setDbLength] = useSafeState(0);
  // useMount(() => {
  //   indexedDB.databases().then(arr => {
  //     setDbLength(arr.length);
  //   });
  // });
  return (
    <>
      <Fab
        size='large'
        onClick={setTrue}
        title="settings"
        className={style['Fab'] ?? ''}
      >
        <Tooltip title="settings" arrow>
          <IconButton size='large'>
            <SettingsOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>

      </Fab>
      <Dialog
        onClose={setFalse}
        className={style['Dialog'] ?? ''}
        open={isOpen}
      >
        <Paper key='title' elevation={24} className={style['title'] ?? ''}>
          <h3>Settings</h3>
        </Paper>
        <Divider />
        <Paper key='engine' elevation={24}
          className={classNames(style['Paper'])}
        ><FormControl fullWidth >
            <Tooltip arrow title={SelectRenderingEngineStr}
              placement="top"
            ><InputLabel>{SelectRenderingEngineStr}</InputLabel></Tooltip>

            <Select<keyofRenderingEngine>
              fullWidth
              label={SelectRenderingEngineStr}
              defaultValue={'ECharts Engine' as keyofRenderingEngine}
              onChange={e => {
                const value = e.target.value as keyofRenderingEngine;
                if (value === 'SVG Engine') {
                  if (!confirm('SVG is very unstable! Are you sure you want to switch to it?')) {
                    return;
                  }
                }
                setSelectEngine(value);
              }}
              value={selectEngine}
            >
              {
                (['ECharts Engine', 'SVG Engine'] as (ReadonlyArray<keyofRenderingEngine>)).map((engine) =>

                  <MenuItem key={engine} value={engine}
                  // title={RenderingEngine[engine as (keyof RenderingEngine)]}
                  >
                    <Tooltip arrow
                      // draggable
                      placement="right"
                      title={<RenderingEngineToJsx renderingEngine={engine} />}
                    >
                      {/* <Paper elevation={24}> */}
                      <div>
                        {engine}
                      </div>
                      {/* </Paper> */}
                    </Tooltip>
                  </MenuItem>

                )
              }

            </Select>
          </FormControl>
        </Paper>
        <Divider />
        <Paper key='SG' elevation={24} className={classNames(style['Paper'], style['SG'])}>
          <Tooltip title='Need Reload' arrow placement="left">
            <ToggleButton selected={isEnableSuperGraph}
              value=""
              className={classNames(style['SG-ToggleButton'])}
            // onChange={(e) => {
            //   console.log(e);

            //   setIsEnableSuperGraph(!isEnableSuperGraph);
            // }}
            >
              <FormControlLabel control={<Switch defaultChecked checked={isEnableSuperGraph} />}
                label="Enable Super Graph"
                autoFocus
                className={classNames(style['SG-ToggleButton-FormControlLabel'])}
                onChange={(e, v) => {
                  setIsEnableSuperGraph(v);
                  waitLastEventLoop(() => {
                    location.reload();
                  });
                }}
              />
            </ToggleButton></Tooltip>
          <Link href={SG_introURL} underline='hover'
            target="_blank"
          >
            <Fab
              size='large'
              // onClick={() => {
              //   open('https://encyclopediaofmath.org/wiki/Hypergraph');
              // }}
              title={SG_introURL}
            ><Tooltip title={What_is_Super_Graph} arrow placement='right'>
                <IconButton size='large'
                  color='info'
                >
                  <HelpOutlineIcon fontSize='large' color='primary' />
                </IconButton>
              </Tooltip></Fab>
          </Link>

        </Paper>
        <Divider />
        <Paper key='clear' elevation={24}
          className={classNames(style['Paper'])}
        >
          <Button size='large' variant="contained"
            fullWidth
            color="warning"
            // disabled={!dbLength}
            onClick={() => {
              if (confirm('Are you sure you want to clear the cache?')) {
                localStorage.clear();
                delAllDB().then(() => {
                  alert('Clear Success!');
                }, () => {
                  alert('Clear Fail!');
                });
              }
            }}>Clear Cache</Button>
        </Paper>
        <Divider />
        <Paper elevation={24} key='back'
          className={style['Paper'] ?? ''}
        >
          <Button
            size='large' variant="contained"
            fullWidth
            onClick={setFalse}

            startIcon={<ArrowBackIcon fontSize="large" />}
          >Back</Button>
        </Paper>
      </Dialog>
    </>
  );
};
// {
//   (isShowAllSelect) ? <Paper elevation={24} className={style['Select'] ?? ''} >
//     <FormControl fullWidth>
//       <InputLabel
//       >Numebr Of Show Vertices</InputLabel>
//       <Select
//         value={Number(isShowAll)}
//         onChange={(e) => {
//           setIsShowAll(Boolean(e.target.value));
//         }}
//         label="Numebr Of Show Vertices"
//         fullWidth
//       >
//         <MenuItem value={1} key={1}
//         >Show All</MenuItem>
//         <MenuItem value={0} key={0}
//           title={`Top ${showAllCount} in descending order of Cohesion`}
//         >Only Show {showAllCount}</MenuItem>
//       </Select>
//     </FormControl>
//   </Paper> : null;
// }