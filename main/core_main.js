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

global.require = require;
global.PERSHA_HOME = undefined;
global.PERSHA_DATA = undefined;

var path = require('path');
var fs = require('fs');
var vm = require('vm');

PERSHA_HOME = path.dirname(path.dirname(process.argv[1]));
PERSHA_DATA = process.env.PERSHA_DATA;

vm.runInThisContext(fs.readFileSync(PERSHA_HOME + "/bin/core.js").toString(), "core.js");

consensus_socket.connect(PERSHA_DATA + "/ipcA", function() {
	var cmd = process.argv[2];
	if (cmd === '-init') {
		node_init();
		consensus_writeSnapshot();
	}
	else if (cmd === '-restart') {
		IOM_state = 'recovery';
		console.log("RECOVERING ...");
		consensus_readSnapshot();
	}
	consensus_schedule({
		type : 'getNextEvent',
	});
});

process.on('beforeExit', function() {
	console.error('beforeExit');
	if (IOM_state !== 'online') {
		return;
	}
	consensus_beforeExit();
});

process.on('exit', function() {
	console.error('exit');
	if (IOM_state !== 'online') {
		return;
	}
	consensus_exit();
	process.reallyExit(0);
});

process.on('uncaughtException', function(err) {
	console.error(err.stack);
	process.reallyExit(1);
});
