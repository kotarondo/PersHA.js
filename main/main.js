/*
 Copyright (c) 2015, Kotaro Endo.
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict'

var path = require('path');
var fs = require('fs');

function print_usage() {
	console.log("Usage:");
	console.log("    persha -init [main module]");
	console.log("    persha -restart");
	console.log("  where data directory can be specified by the environment variable PERSHA_DATA"
			+ " which defaults to $HOME/.persha");
}

var PERSHA_HOME = path.dirname(path.dirname(process.argv[1]));
var PERSHA_DATA = process.env.PERSHA_DATA;
if (PERSHA_DATA[0] !== '/') {
	console.log("ERROR: PERSHA_DATA must be absolute path: " + PERSHA_DATA);
	process.exit(1);
}
if (!fs.existsSync(PERSHA_DATA)) {
	console.log("ERROR: PERSHA_DATA does not exist: " + PERSHA_DATA);
	process.exit(1);
}

var cmd = process.argv[2];
if (cmd === '-init') {
	fs.readdirSync(PERSHA_DATA).forEach(function(file) {
		if (file.indexOf("journal") === 0) {
			fs.unlinkSync(PERSHA_DATA + "/" + file);
		}
	});
	Journal_init();
}
else if (cmd === '-restart') {
	if (!Journal_start()) {
		console.log("ERROR: invalid: " + PERSHA_DATA);
		process.exit(1);
	}
}
else {
	print_usage();
	process.exit(1);
}

fs.readdirSync(PERSHA_DATA).forEach(function(file) {
	if (file.indexOf("ipc") === 0) {
		fs.unlinkSync(PERSHA_DATA + "/" + file);
	}
});

serverA.listen(PERSHA_DATA + "/ipcA", function() {
	serverS.listen(PERSHA_DATA + "/ipcS", function() {
		var args = process.argv.slice(1);
		args[0] = PERSHA_HOME + "/bin/core_main.js";
		var core = require('child_process').spawn('node', args, {
			stdio : 'inherit'
		});
		core.on('close', function(exitcode) {
			process.exit(exitcode);
		});
	});
});
