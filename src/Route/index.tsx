import {
  Route, Routes,
} from 'react-router-dom';
import BCViz_new from '@/pages/BCViz_new';
// import BCviz_Edit from '@/pages/BCviz_Edit';
import { Suspense, lazy } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

// import { useSafeState } from 'ahooks';
// import { useEffect } from 'react';

const BCviz_EditLoadable = lazy(() => import('@/pages/BCviz_Edit'));

export const enum Path {
  edit = '/edit'
}

export default function MyRoute () {
  return (
    <Routes>

      <Route
        index
        element={<BCViz_new />}
      />
      <Route
        path={Path.edit}
        element={<Suspense fallback={<Backdrop open><CircularProgress /></Backdrop>}>
          <BCviz_EditLoadable />
        </Suspense>}
      // element={<BCviz_Edit />}
      />
    </Routes>
  );
}