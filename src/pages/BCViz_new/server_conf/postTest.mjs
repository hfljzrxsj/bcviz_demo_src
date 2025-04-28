#!/usr/bin/env node
//@ts-check
import { readFileSync } from 'fs';
const { log, error } = console;

const { stdin, env, } = process;
log("hjx: hjx");
log();
log(process.cwd());
log(JSON.stringify(env));
// 同步读取（适用于简单场景）
log(readFileSync(stdin.fd, 'utf8'));
// 异步读取（推荐）
let postData = '';
stdin.setEncoding('utf8');
stdin.on('data', chunk => postData += chunk);
stdin.on('readable', () => {
  /**@type {ReturnType<import('stream').Stream.Readable['read']>}*/
  let chunk;
  while ((chunk = stdin.read()) !== null) {
    postData += chunk;
  }
});
stdin.on('end', () => {
  try {
    log(postData);
  } catch (e) {
    log(e);
  }
});
process.on('uncaughtException', (err) => {
  error(err);
  process.exitCode = 500;
});


/*
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://yoursite/cgi-bin/script.js
CONTENT_LENGTH=15 CONTENT_TYPE=text/plain REQUEST_METHOD=POST node script.js
fastcgi_read_timeout 300;
fastcgi_send_timeout 300;
*/