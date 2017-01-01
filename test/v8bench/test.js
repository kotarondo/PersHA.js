var fs = require('fs');
var vm = require('vm');
function load(f){ vm.runInNewContext(fs.readFileSync(f), sandbox, f); }
var sandbox = {};
sandbox.print = console.log;
sandbox.load = load;
load("run.js");
process.exit(0);
