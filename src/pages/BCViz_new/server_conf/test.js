#!/usr/bin/env node
//@ts-check
console.log("hjx: hjx");
console.log();
const query = process.env.QUERY_STRING || '';
// console.log(query);
/** @type {Record<string,string>}*/
const obj = Object.fromEntries(query.split('&').map(i => i.split('=')));
const {
  // exec,
  execFile,
  // spawn,
  // execSync,
  // execFileSync,
  // spawnSync,
} = require('child_process');
//curl "http://127.0.0.1/api/BCviz?tableFileName=example_cohesion.txt&=example.txt&s=1&t=1&problemType=MEB"
//exec ./MBS "$graghFileName" "$tableFileName" "$problemType" "$s" "$t" 2>&1
execFile("./MBS", [obj.graghFileName, obj.tableFileName, obj.problemType, obj.s, obj.t], {
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