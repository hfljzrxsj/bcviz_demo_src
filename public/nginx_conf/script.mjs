#!/usr/bin/env node
//@ts-check
import {
  // exec,
  execFile,
  // spawn,
  // execSync,
  // execFileSync,
  // spawnSync,
} from 'child_process';
import { readFileSync, existsSync, writeFileSync, symlinkSync } from 'fs';
import { stdin, env } from 'process';
import { fileURLToPath } from 'url';
import { dirname, join, parse } from 'path';
import { URLSearchParams } from 'url';
const { log, error } = console;
const initVertexs = ['0'];
/**
 * @param {string} vertexsStr 
 * @returns {ReadonlyArray<string>}
 */
const parseVertexs = (vertexsStr) => {
  try {
    /**@type {ReadonlyArray<[number,number]>} */
    const vertexsArr = JSON.parse(vertexsStr);
    if (!Array.isArray(vertexsArr) || vertexsArr.length === 0) {
      return initVertexs;
    }
    /**@type {ReadonlyArray<[number,number]>} */
    const vertexsArrWithType = vertexsArr;
    return [vertexsArrWithType.length, ...vertexsArrWithType.flat()].map(i => i.toString());
  } catch (e) {
    log(e);
    return initVertexs;
  }
};

// const searchStringParse = (query) => {
//   /**@type {ReadonlyArray<[string,string]>} */
//   //@ts-expect-error
//   const splitArr = query.split('&').map(i => i.split('='));
//   const map = new Map(splitArr);
//   const dataset = map.get('dataset');
//   const BCviz_file = map.get('BCviz_file');
//   const problem_type = map.get('problem_type');
//   const s = map.get('s');
//   const t = map.get('t');
//   const vertexs = map.get('vex_list');
//   if (!(dataset && BCviz_file && problem_type && s && t)) {
//     return [];
//   }
//   const vertexsArr = vertexs ? (problem_type === 'SG' ? [vertexs] : parseVertexs(vertexs)) : initVertexs;
//   return [dataset, BCviz_file, problem_type, s, t, ...vertexsArr];
// };
const datasetKey = 'dataset';
/**
 * @param {URLSearchParams} params 
 * @returns {ReadonlyArray<string>}
 */
const searchStringParse = (params) => {
  // const params = new URLSearchParams(params);
  const dataset = params.get(datasetKey);
  const BCviz_file = params.get('BCviz_file');
  const problem_type = params.get('problem_type');
  const s = params.get('s');
  const t = params.get('t');
  const vertexs = params.get('vex_list');
  if (!(dataset && BCviz_file && problem_type && s && t)) {
    return [];
  }
  const vertexsArr = vertexs
    ? problem_type === 'SG'
      ? [vertexs]
      : parseVertexs(vertexs)
    : initVertexs;
  return [dataset, BCviz_file, problem_type, s, t, ...vertexsArr];
};
/**
 * @param {string} pathname
 */
const exactPathname = (pathname) => pathname.split('/').slice(3).join('/');
/**
 * @param {string} dataset 
 * @param {string} unzipDir_datasets /etc/nginx/sites-available/v1/datasets
 * @param {string} bcviz_demo_datasets /etc/nginx/sites-available/bcviz_demo/datasets
 * @param {string} bcviz_demo /etc/nginx/sites-available/bcviz_demo
 * 
 */
const writeFileAndSymlink = (dataset, unzipDir_datasets, bcviz_demo_datasets, bcviz_demo) =>/** @type {Promise<void>} */ (new Promise((resolve) => {
  const writeFilePath = join(bcviz_demo, dataset);
  if (!existsSync(writeFilePath)) {
    const text = readFileSync(stdin.fd, 'utf8');
    writeFileSync(writeFilePath, text);
  }
  const unzipDir_datasets_file = join(unzipDir_datasets, dataset);
  if (!existsSync(unzipDir_datasets_file)) {
    symlinkSync(writeFilePath, unzipDir_datasets_file);
  }
  const bcviz_demo_datasets_file = join(bcviz_demo_datasets, dataset);
  if (!existsSync(bcviz_demo_datasets_file)) {
    symlinkSync(writeFilePath, bcviz_demo_datasets_file);
  }
  resolve();
}));
// const exactPathname = (pathname) => {
//   const [, , , ...others] = pathname.split('/');
//   return others.join('/');
// };
log("hjx: hjx");
log();
(async () => {
  try {
    const { SCRIPT_NAME, DOCUMENT_URI, QUERY_STRING } = env;
    if (!DOCUMENT_URI || !SCRIPT_NAME || DOCUMENT_URI !== SCRIPT_NAME) {
      return;
    }
    const searchParam = new URLSearchParams(QUERY_STRING);
    switch (exactPathname(DOCUMENT_URI)) {
      case 'MBS': {
        if (!QUERY_STRING) {
          return;
        }
        //curl "http://127.0.0.1/api/BCviz?dataset=example_cohesion.txt&BCviz_file=example.txt&s=1&t=1&problem_type=MEB&vertexs=[[0,1]]
        //exec ./MBS "$graghFileName" "$tableFileName" "$problemType" "$s" "$t" 2>&1
        execFile("./MBS", searchStringParse(searchParam), {
          cwd: "./search-BCviz", // 设置工作目录为 search-BCviz 文件夹
          // timeout: 0,
        }, (err, stdout, stderr) => {
          if (err) {
            const { cmd, code, killed, message, name, signal, stack } = err;
            error('error', cmd, code, killed, message, name, signal, stack);
            return;
          }
          log(stdout);
          if (stderr) {
            error('stderr:', stderr);
          };
        });
        break;
      }
      case 'construct': {
        const dataset = searchParam.get(datasetKey);
        if (!dataset) {
          return;
        }
        /** /etc/nginx/sites-available/v1/script.mjs */
        const __filePath = fileURLToPath(import.meta.url);
        /** /etc/nginx/sites-available/v1 */
        const unzipDir = dirname(__filePath);
        /** /etc/nginx/sites-available */
        const baseDir = dirname(unzipDir);
        /** /etc/nginx/sites-available/bcviz_demo */
        const bcviz_demo = join(baseDir, 'bcviz_demo');
        const datasets = 'datasets';
        /** /etc/nginx/sites-available/v1/datasets */
        const unzipDir_datasets = join(unzipDir, datasets);
        /** /etc/nginx/sites-available/bcviz_demo/datasets */
        const bcviz_demo_datasets = join(bcviz_demo, datasets);
        await writeFileAndSymlink(dataset, unzipDir_datasets, bcviz_demo_datasets, bcviz_demo);
        const s_min = searchParam.get('s_min');
        const t_min = searchParam.get('t_min');
        const { name, ext } = parse(dataset);
        const cohesionFileName = `${name}_cohesion${ext}`;
        const cohesionFilePath = join(unzipDir, 'Index-results', cohesionFileName);
        if (existsSync(cohesionFilePath)) {
          return;
        }
        execFile("./BCviz", [dataset, s_min || '1', t_min || '1'], {
          cwd: "./construct-BCviz", // 设置工作目录为 search-BCviz 文件夹
          // timeout: 0,
        }, (err, stdout, stderr) => {
          if (err) {
            const { cmd, code, killed, message, name, signal, stack } = err;
            error('error', cmd, code, killed, message, name, signal, stack);
            return;
          }
          if (existsSync(cohesionFilePath)) {
            const unzipDir_datasets_file = join(unzipDir_datasets, cohesionFileName);
            if (!existsSync(unzipDir_datasets_file)) {
              symlinkSync(cohesionFilePath, unzipDir_datasets_file);
            }
            const bcviz_file = join(bcviz_demo, cohesionFileName);
            if (!existsSync(bcviz_file)) {
              symlinkSync(cohesionFilePath, bcviz_file);
            }
            const bcviz_demo_datasets_file = join(bcviz_demo_datasets, cohesionFileName);
            if (!existsSync(bcviz_demo_datasets_file)) {
              symlinkSync(cohesionFilePath, bcviz_demo_datasets_file);
            }
          }
          const arr = stdout.trim().split('\n');
          log([arr.slice(0, 4), '...', arr.slice(-3)].join('\n'));
          if (stderr) {
            error('stderr:', stderr);
          };
        });
        break;
      }
      // case 'upload': {
      //   const text = readFileSync(stdin.fd, 'utf8');
      //   const baseDir = dirname(dirname(fileURLToPath(import.meta.url)));  //  /etc/nginx/sites-available
      //   const writeFilePath = join(baseDir,);
      //   break;
      // }
    }
  } catch (e) { error(e); }
})();