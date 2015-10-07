#!/bin/sh

make download

persha -init << EOF
var fs = require('fs');
var print = console.log;
function load(f){evaluateProgram(fs.readFileSync(f), f)}
load("run.js");
EOF
