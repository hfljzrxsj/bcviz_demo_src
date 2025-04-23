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
/**
 * @param {string} query 
 * @returns {ReadonlyArray<string>}
 */
const searchStringParse = (query) => {
  /**@type {ReadonlyArray<[string,string]>} */
  //@ts-expect-error
  const splitArr = query.split('&').map(i => i.split('='));
  const map = new Map(splitArr);
  const dataset = map.get('dataset');
  const BCviz_file = map.get('BCviz_file');
  const problem_type = map.get('problem_type');
  const s = map.get('s');
  const t = map.get('t');
  const vertexs = map.get('vex_list');
  if (!(dataset && BCviz_file && problem_type && s && t)) {
    return [];
  }
  const vertexsArr = vertexs ? (problem_type === 'SG' ? [vertexs] : parseVertexs(vertexs)) : initVertexs;
  return [dataset, BCviz_file, problem_type, s, t, ...vertexsArr];
};
log("hjx: hjx");
log();
const query = process.env.QUERY_STRING || '';
// log(query);
//curl "http://127.0.0.1/api/BCviz?dataset=example_cohesion.txt&BCviz_file=example.txt&s=1&t=1&problem_type=MEB&vertexs=[[0,1]]
//exec ./MBS "$graghFileName" "$tableFileName" "$problemType" "$s" "$t" 2>&1
execFile("./MBS", searchStringParse(query), {
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