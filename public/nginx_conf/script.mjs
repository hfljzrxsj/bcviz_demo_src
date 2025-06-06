#!/usr/bin/env node
//@ts-check
import {
  // exec,
  execFile,
  // spawn,
  // execSync,
  // execFileSync,
  // spawnSync,
} from 'node:child_process';
import { readFileSync, existsSync, writeFileSync, symlinkSync } from 'node:fs';
import { stdin, env } from 'node:process';
import { fileURLToPath, URLSearchParams } from 'node:url';
import { dirname, join, parse } from 'node:path';
// import { createHash } from 'node:crypto';
const { log, error } = console;
// const defaultTxt = ['example.txt', 'writer.txt', 'marvel.txt', 'paper.txt', 'example_cohesion.txt', 'writer_cohesion.txt', 'marvel_cohesion.txt', 'paper_cohesion.txt'];
const initVertexs = ['0'];
const initST_min = '1';
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
// 校验文件名是否合法
/**
 * @param {string|null} filename
 * @returns {filename is string}
 */
function validateFilename (filename) {
  if (typeof filename !== 'string' || filename.trim() === '') {
    throw new Error('Filename is required');
  }
  // 禁止路径分隔符
  if (filename.includes('/') || filename.includes('\\')) {
    throw new Error('Filename cannot contain path separators');
  }
  // 禁止特殊目录名称
  if (filename === '.' || filename === '..') {
    throw new Error('Filename cannot be "." or ".."');
  }
  // 可选：检查Windows保留名称（如CON、NUL等）
  // const reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'LPT1']; // 完整列表需补全
  // if (reserved.includes(filename.toUpperCase())) {
  //   throw new Error('Filename is a reserved system name');
  // }
  return true;
}
//  * @param {string} bcviz_demo_datasets /etc/nginx/sites-available/bcviz_demo/datasets

/**
 * @param {string} dataset 
 * @param {string} unzipDir_datasets /etc/nginx/sites-available/v1/datasets
 * @param {string} bcviz_demo /etc/nginx/sites-available/bcviz_demo
 * 
 */
const writeFileAndSymlink = (dataset, unzipDir_datasets, bcviz_demo) =>/** @type {Promise<void>} */ (new Promise((resolve) => {
  const writeFilePath = join(bcviz_demo, dataset);
  if (!existsSync(writeFilePath)) {
    const text = readFileSync(stdin.fd, 'utf8');
    writeFileSync(writeFilePath, text);
  }
  const unzipDir_datasets_file = join(unzipDir_datasets, dataset);
  if (!existsSync(unzipDir_datasets_file)) {
    symlinkSync(writeFilePath, unzipDir_datasets_file);
  }
  // const bcviz_demo_datasets_file = join(bcviz_demo_datasets, dataset);
  // if (!existsSync(bcviz_demo_datasets_file)) {
  //   symlinkSync(writeFilePath, bcviz_demo_datasets_file);
  // }
  resolve();
}));
// const exactPathname = (pathname) => {
//   const [, , , ...others] = pathname.split('/');
//   return others.join('/');
// };

// --test--
// console.log("Status: 403 Forbidden");
// console.log("Status: 404 Not Found");
// console.log("Status: 500 Internal Error");
// --test--

log("hjx: hjx");
log();
(async () => {
  try {
    const { SCRIPT_NAME, DOCUMENT_URI, QUERY_STRING } = env;
    if (!DOCUMENT_URI || !SCRIPT_NAME || DOCUMENT_URI !== SCRIPT_NAME) {
      return;
    }
    const searchParam = new URLSearchParams(QUERY_STRING);

    const dataset = searchParam.get(datasetKey);
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
    // const bcviz_demo_datasets = join(bcviz_demo, datasets);


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
      // case 'checkEqualExist': {
      //   const filename = searchParam.get('filename');
      //   const length = searchParam.get('length');
      //   if (!filename
      //     || !length
      //     || !validateFilename(filename)) {
      //     return;
      //   }
      //   // 如果文件名是示例文件
      //   if (defaultTxt.includes(filename)) {
      //     return;
      //   }
      //   const filePath = join(bcviz_demo, filename);
      //   // 文件路径存在
      //   if (existsSync(filePath)) {
      //     const fileContent = readFileSync(filePath, 'utf8');
      //     // const existFileMD5 = createHash('md5').update(fileContent).digest('hex');
      //     // 两个文件长度相同
      //     if (parseInt(length) === fileContent.length) {
      //       return;
      //     }
      //   }
      //   log('1');
      //   break;
      // }
      case 'upload': {
        if (!validateFilename(dataset)) {
          return;
        }
        await writeFileAndSymlink(dataset, unzipDir_datasets, bcviz_demo);
        break;
      }
      case 'construct': {
        if (!validateFilename(dataset)) {
          return;
        }
        // start to construct
        const s_min = searchParam.get('s_min') || initST_min;
        const t_min = searchParam.get('t_min') || initST_min;
        const { name, ext } = parse(dataset);
        const cohesionFileName = `${name}_cohesion${(s_min === initST_min && t_min === initST_min)
          ? ''
          : [s_min, t_min].map(s => `_${s}`).join('')}${ext}`;
        const cohesionFilePath = join(unzipDir, 'Index-results', cohesionFileName);
        if (existsSync(cohesionFilePath)) {
          return;
        }
        execFile("./BCviz", [dataset, s_min, t_min], {
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
            // const bcviz_demo_datasets_file = join(bcviz_demo_datasets, cohesionFileName);
            // if (!existsSync(bcviz_demo_datasets_file)) {
            //   symlinkSync(cohesionFilePath, bcviz_demo_datasets_file);
            // }
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
  } catch (e) {
    error(e);
    process.exit();
  }
})();