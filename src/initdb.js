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

try {
	initializeVM();

	var text = fs.readFileSync(BRIDGE_SCRIPT_DIR + 'bridge.js').toString();
	Global_evaluateProgram(undefined, [ text, 'bridge.js' ]);

	/* hacking
	*/
	Global_eval(undefined, [ "_debug" ]).Call = function(thisValue, argumentsList) {
		console.log(argumentsList);
	};

	var bridge_list = [ 'fs', 'uv', 'http_parser', 'tcp_wrap', 'tty_wrap', 'timer_wrap', 'pipe_wrap', 'cares_wrap', 'stream_wrap', ];
	for (var i = 0; i < bridge_list.length; i++) {
		var n = bridge_list[i];
		var text = fs.readFileSync(BRIDGE_SCRIPT_DIR + n + '.js').toString();
		text = "(function(){" + text + "})();";
		Global_evaluateProgram(undefined, [ text, n + '.js' ]);
	}

	var natives_binding = Global_eval(undefined, [ "process.binding('natives')" ]);
	var natives_list = [ 'events', 'constants', 'module', 'buffer', 'smalloc', 'util', 'assert', 'vm', 'timers', 'stream', 'console', 'fs',
			'path', 'net', 'repl', 'readline', 'domain', 'string_decoder', '_stream_readable', '_stream_writable', '_stream_duplex',
			'_stream_transform', '_stream_passthrough', 'http', '_http_agent', '_http_client', '_http_common', '_http_incoming',
			'_http_outgoing', '_http_server', 'freelist', '_linklist', 'url', 'punycode', 'querystring', 'dns', ];
	for (var i = 0; i < natives_list.length; i++) {
		var n = natives_list[i];
		var text = fs.readFileSync(NODE_INIT_SCRIPT_DIR + n + '.js').toString();
		natives_binding.Put(n, text, false);
	}

	var smalloc_binding = Global_eval(undefined, [ "process.binding('smalloc')" ]);
	var smalloc = process.binding('smalloc');
	for ( var P in smalloc) {
		if (isPrimitiveValue(smalloc[P])) {
			smalloc_binding.Put(P, smalloc[P], false);
		}
	}

	var constants_binding = Global_eval(undefined, [ "process.binding('constants')" ]);
	var constants = process.binding('constants');
	for ( var P in constants) {
		if (isPrimitiveValue(constants[P])) {
			constants_binding.Put(P, constants[P], false);
		}
	}

	var uv_binding = Global_eval(undefined, [ "process.binding('uv')" ]);
	var uv = process.binding('uv');
	for ( var P in uv) {
		if (isPrimitiveValue(uv[P])) {
			uv_binding.Put(P, uv[P], false);
		}
	}

	var HTTPParser_binding = Global_eval(undefined, [ "process.binding('http_parser').HTTPParser" ]);
	var HTTPParser = process.binding('http_parser').HTTPParser;
	for ( var P in HTTPParser) {
		if (isPrimitiveValue(HTTPParser[P])) {
			HTTPParser_binding.Put(P, HTTPParser[P], false);
		}
	}
	for ( var P in HTTPParser.methods) {
		if (isPrimitiveValue(HTTPParser.methods[P])) {
			HTTPParser_binding.Get('methods').Put(P, HTTPParser.methods[P], false);
		}
	}

	var cares_binding = Global_eval(undefined, [ "process.binding('cares_wrap')" ]);
	var cares = process.binding('cares_wrap');
	for ( var P in cares) {
		if (isPrimitiveValue(cares[P])) {
			cares_binding.Put(P, cares[P], false);
		}
	}

	var text = fs.readFileSync(NODE_INIT_SCRIPT_DIR + 'node.js').toString();
	var prog = Global_evaluateProgram(undefined, [ text, 'node.js' ]);
	prog.Call(theGlobalObject, [ Global_eval(undefined, [ 'process' ]) ]);
	runMicrotasks();
	Journal_init();

} catch (e) {
	if (isInternalError(e)) {
		console.log("FATAL: " + e.stack);
	}
	else {
		console.log("FATAL: " + e.Get('stack'));
	}
}
