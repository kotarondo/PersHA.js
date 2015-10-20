#!/bin/sh

make download

cat >test.js <<EOF
var fs = require('fs');
var vm = require('vm');
function load(f){ vm.runInThisContext(fs.readFileSync(f), f); }
global.print = console.log;
global.load = load;
load("run.js");
process.exit(0);
EOF

persha -init test.js
