import { Button, Dialog, Divider, Paper, Select, FormControl, InputLabel, MenuItem, Tooltip, Fab, IconButton } from "@mui/material";
import { useBoolean, useEventTarget } from "ahooks";
import style from './_index.module.scss';
// import clsx from 'clsx';
import classNames from "clsx";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Modes, tanContentClass } from "../utils";
import type { SetStateType } from "@/pages/BCviz/types";
import { delAllDB } from "@/utils/idb";
import { useSafeState, useMount } from 'ahooks';

export const enum RenderingEngine {
  'SVG Engine',
  'ECharts Engine'
}
export type keyofRenderingEngine = keyof typeof RenderingEngine;

const HighlightHSSMode = () => <span className={tanContentClass}>{Modes['Hierarchical Subgraphs Search']}</span>;
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

export default function Settings (props: {
  readonly setSelectEngine: SetStateType<keyofRenderingEngine>;
  readonly selectEngine: keyofRenderingEngine;
}) {
  const {
    setSelectEngine,
    selectEngine,
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
        <Paper key='content' elevation={24}
          className={classNames(style['Paper'])}
        ><FormControl fullWidth >
            <Tooltip arrow title="Select Rendering Engine"
              placement="top"
            ><InputLabel>Select Rendering Engine</InputLabel></Tooltip>

            <Select<keyofRenderingEngine>
              fullWidth
              label="Select Rendering Engine"
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
        <Paper key='content' elevation={24}
          className={classNames(style['Paper'])}
        >
          <Button size='large' variant="contained"
            fullWidth
            color="warning"
            // disabled={!dbLength}
            onClick={() => {
              if (confirm('Are you sure you want to clear the cache?')) {
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