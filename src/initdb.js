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

var fs = require('fs');

initializeVM();

var prog = fs.readFileSync(INITSCRIPT_DIR + 'bridge.js').toString();
Global_evaluateProgram(undefined, [ prog, 'bridge.js' ]);

/* hacking
*/
Global_eval(undefined, [ "process.debug" ]).Call = function(thisValue, argumentsList) {
	console.log(argumentsList);
};

var natives_binding = Global_eval(undefined, [ "process.binding('natives')" ]);
var list = [ 'events', 'module', 'buffer', 'smalloc', 'util', 'assert', 'vm', 'timers', 'stream', 'console', 'fs', 'path', 'net', 'repl',
		'readline', 'domain', 'string_decoder', '_stream_readable', '_stream_writable', '_stream_duplex', '_stream_transform',
		'_stream_passthrough', ];
for (var i = 0; i < list.length; i++) {
	var n = list[i];
	var s = fs.readFileSync(INITSCRIPT_DIR + n + '.js').toString();
	natives_binding.Put(n, s, false);
}

var smalloc_binding = Global_eval(undefined, [ "process.binding('smalloc')" ]);
smalloc_binding.Put('kMaxLength', require('smalloc').kMaxLength, false);

var constants_binding = Global_eval(undefined, [ "process.binding('constants')" ]);
var constants = require('constants');
for ( var P in constants) {
	assert(isPrimitiveValue(constants[P]));
	constants_binding.Put(P, constants[P]);
}

var prog = fs.readFileSync(INITSCRIPT_DIR + 'node.js').toString();
var process = Global_eval(undefined, [ "process" ]);
try {
	var result = Global_evaluateProgram(undefined, [ prog, "node.js" ]).Call(theGlobalObject, [ process ]);
} catch (e) {
	if (isInternalError(e)) {
		console.log(e);
	}
	else {
		console.log(e.Get("stack"));
	}
	return;
}

runMicrotasks();

Journal_init();
