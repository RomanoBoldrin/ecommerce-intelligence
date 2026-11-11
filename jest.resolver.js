const path = require("path");

const NODE_BUILTINS = new Set([
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
]);

module.exports = function customResolver(requestPath, options) {
  if (requestPath.startsWith("node:")) {
    const builtinName = requestPath.slice(5);
    if (NODE_BUILTINS.has(builtinName)) {
      return builtinName;
    }
    requestPath = builtinName;
  }

  if (requestPath === "#main-entry-point") {
    return path.resolve(
      options.rootDir || process.cwd(),
      "node_modules/.prisma/client/index.js",
    );
  }

  return options.defaultResolver(requestPath, options);
};

