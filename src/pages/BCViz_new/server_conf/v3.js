#!/usr/bin/env node
//@ts-check
//@ts-check
const initVertexs = ['0'];
/**
 * @param {string} vertexsStr 
 * @returns {ReadonlyArray<string>}
 */
const parseVertexs = (vertexsStr) => {
  /**@type {ReadonlyArray<[number,number]>} */
  const vertexsArr = JSON.parse(vertexsStr);
  if (!Array.isArray(vertexsArr) || vertexsArr.length === 0) {
    return initVertexs;
  }
  /**@type {ReadonlyArray<[number,number]>} */
  const vertexsArrWithType = vertexsArr;
  return [vertexsArrWithType.length, ...vertexsArrWithType.flat()].map(i => i.toString());
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
  const vertexs = map.get('vertexs');
  if (!(dataset && BCviz_file && problem_type && s && t)) {
    return [];
  }
  const vertexsArr = vertexs ? parseVertexs(vertexs) : initVertexs;
  return [dataset, BCviz_file, problem_type, s, t, ...vertexsArr];
};

console.log("hjx: hjx");
console.log();
const query = process.env.QUERY_STRING || '';
// console.log(query);
const {
  // exec,
  execFile,
  // spawn,
  // execSync,
  // execFileSync,
  // spawnSync,
} = require('child_process');
//curl "http://127.0.0.1/api/BCviz?dataset=example_cohesion.txt&BCviz_file=example.txt&s=1&t=1&problem_type=MEB&vertexs=[[0,1]]
//exec ./MBS "$graghFileName" "$tableFileName" "$problemType" "$s" "$t" 2>&1
execFile("./MBS", searchStringParse(query), {
  // timeout: 0,
}, (error, stdout, stderr) => {
  if (error) {
    const { cmd, code, killed, message, name, signal, stack } = error;
    console.error('error', cmd, code, killed, message, name, signal, stack);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error('stderr:', stderr);
  };
});