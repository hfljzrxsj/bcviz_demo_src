import {
  Route, Routes,
} from 'react-router-dom';
import BCViz_new from '@/pages/BCViz_new';
// import { useSafeState } from 'ahooks';
// import { useEffect } from 'react';

// const Test = () => {
//   const [state, setState] = useSafeState('');
//   const [o, setO] = useSafeState('');
//   const dep: Parameters<typeof useEffect>[1] = [state];
//   useEffect(() => {
//     console.log(state, o);

//   }, dep);
//   return <>
//     <input onChange={e => setState(e.target.value)} />
//     <input onChange={e => setO(e.target.value)} />
//   </>;
// };
export default function MyRoute () {
  return (
    <Routes>
      <Route
        index
        element={<BCViz_new />}
      />
      {/* <Route element={<Test />} path='test' /> */}
    </Routes>
  );
}