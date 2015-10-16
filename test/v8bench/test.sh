#!/bin/sh

make download

persha -init << EOF
var fs = require('fs');
var vm = require('vm');
function load(f){ vm.runInThisContext(fs.readFileSync(f), f); }
global.print = console.log;
load("run.js");
process.exit(0);
EOF
