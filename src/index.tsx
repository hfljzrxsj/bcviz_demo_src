// import { StrictMode } from 'react';
import './index.scss';
// import { render } from 'react-dom';
import App from './App';
// import { useWorker } from "@koale/useworker";
// console.log(useWorker.toString());

// import './utils/Date';
// import { register } from './serviceWorkerRegistration';
// import './mock';
// import 'virtual:svg-cions-register';
import { createRoot } from 'react-dom/client';
// import U200b from './pages/Test/U200b';
// import IdbTestPages from './pages/Test/IdbTestPages';
// import reportWebVitals from './reportWebVitals';
const container = document.body;
// const container = document.createElement('div');

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
createRoot(container).
  render(
    // <StrictMode>
    <>
      <App />
    </>
    // </StrictMode>
    // , document.body
  );
// register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// render(
//   <WebSQL />
//   // <BasicSelect />
//   , document.body
// );