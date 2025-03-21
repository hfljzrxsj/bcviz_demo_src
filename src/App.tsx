import { StrictMode } from 'react';
import { CssBaseline, ScopedCssBaseline, StyledEngineProvider } from '@mui/material';
import MyRoute from './Route';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import {
//   colors,
//   // useTheme,
//   // type Palette,
//   createTheme,
//   type Palette,
//   // type ZIndex,
// } from "@mui/material";
import type { ZIndex } from '@mui/material/styles/zIndex';
import zIndex from '@mui/material/styles/zIndex';
// import { useRequest } from 'ahooks';
// import './mock';

//NonNullable<Parameters<typeof useRequest>[1]>

// export const MediaQueryContext = createContext(false);

export default () => {
  return <StrictMode><StyledEngineProvider injectFirst>
    {/* <ScopedCssBaseline><CssBaseline /> */}
    {/* <Provider store={store}> */}
    {/* <MediaQueryContext.Provider value={matches}> */}
    <HashRouter>
      <MyRoute />
      <ToastContainer style={{ zIndex: zIndex.modal + 1 }} />
    </HashRouter>
    {/* <SnackbarAlert /> */}
    {/* </MediaQueryContext.Provider> */}
    {/* </Provider> */}
    {/* </ScopedCssBaseline> */}
  </StyledEngineProvider>
  </StrictMode>;
};