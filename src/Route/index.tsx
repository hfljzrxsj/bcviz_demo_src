import {
  Route, Routes,
} from 'react-router-dom';
import BCViz_new from '@/pages/BCViz_new';

export default function MyRoute () {
  return (
    <Routes>
      <Route
        index
        element={<BCViz_new />}
      />
    </Routes>
  );
}