#!/bin/sh

make download

persha -init << EOF
var fs = require('fs');
var vm = require('vm');
function load(f){ vm.runInContext(fs.readFileSync(f), sandbox, f); }
var sandbox = vm.createContext();
sandbox.print = console.log;
sandbox.load = load;
load("run.js");
EOF
