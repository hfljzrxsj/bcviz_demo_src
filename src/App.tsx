import { StrictMode } from 'react';
import { CssBaseline, ScopedCssBaseline, StyledEngineProvider } from '@mui/material';
import MyRoute from './Route';
import { HashRouter } from 'react-router-dom';
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
    </HashRouter>
    {/* <SnackbarAlert /> */}
    {/* </MediaQueryContext.Provider> */}
    {/* </Provider> */}
    {/* </ScopedCssBaseline> */}
  </StyledEngineProvider>
  </StrictMode>;
};