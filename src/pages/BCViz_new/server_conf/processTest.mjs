//@ts-check
const { log, error } = console;

const { stdout,
  stderr,
  stdin,
  argv,
  argv0,
  execArgv,
  execPath,
  debugPort,
  env,
  exitCode,
  sourceMapsEnabled,
  version,
  versions,
  config,
  pid,
  ppid,
  title,
  arch,
  platform,
  mainModule,
  memoryUsage,
  permission,
  release,
  features,
  hrtime,
  connected,
  allowedNodeEnvironmentFlags,
  report,
  throwDeprecation,
  traceDeprecation, } = process;
const { getMaxListeners,
  cwd,
  getActiveResourcesInfo,
  hasUncaughtExceptionCaptureCallback,
  constrainedMemory,
  availableMemory,
  umask,
  uptime,
  disconnect,
  resourceUsage,
  getgid,
  getuid,
  geteuid,
  getegid,
  getgroups, } = process;
const { isArray } = Array;
// const set = new Set();
// const f = (/** @type {NodeJS.Process} */ win) => {
//   for (const k in process) {
//     if (set.has(k)) {
//       continue;
//     }
//     set.add(k);
//     const v = process[k];

//     // if (k === 'title') {
//     //   console.log(process['title']);
//     // }
//     try {
//       if (typeof v === 'object') {
//         if (isArray(v)) {
//           log(k, v);
//         } else {
//           f(v);
//         }
//       } else if (typeof v === 'function') {
//         if (v.length === 0) {
//           console.log(k, v());
//         }
//       } else {
//         console.log(k, v);
//       }
//     } catch (e) {
//       error(e, k, v);
//     }

//   }
// };
// f(process);

// f.length
[stdout,
  stderr,
  stdin,
  argv,
  argv0,
  execArgv,
  execPath,
  debugPort,
  env,
  exitCode,
  sourceMapsEnabled,
  version,
  versions,
  config,
  pid,
  ppid,
  title,
  arch,
  platform,
  mainModule,
  memoryUsage,
  permission,
  release,
  features,
  hrtime,
  connected,
  allowedNodeEnvironmentFlags,
  report,
  throwDeprecation,
  traceDeprecation,].forEach(i => {
    if (typeof i === 'object') {
      if (isArray(i)) {
        console.log(i);
      }
    } else if (typeof i !== 'function') {
      console.log(i);
    }
  });

[getMaxListeners,
  cwd,
  getActiveResourcesInfo,
  hasUncaughtExceptionCaptureCallback,
  constrainedMemory,
  availableMemory,
  umask,
  uptime,
  resourceUsage,
  getgid,
  getuid,
  geteuid,
  getegid,
  getgroups,].forEach(i => {
    try {
      log(i?.());
    } catch (e) {
      try {
        const name = i?.name;
        if (name) {
          console.log(process[name]());
        }

      } catch (e) {
        console.error(i?.name, e);
      }
    }
  })

/*
^    (readonly )?\w+\??: \w\w
^    (readonly )?\w+(\(\))\??: \w\w
^    (readonly )?\w+\??: \(\)

*/