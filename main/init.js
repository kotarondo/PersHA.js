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

var NODE_INIT_SCRIPT_DIR = PERSHA_HOME + "/node-lib/";
var BRIDGE_SCRIPT_DIR = PERSHA_HOME + "/bridge/";

try {
	initializeVM();

	IOM_state = 'online'; //temporarily

	var text = fs.readFileSync(BRIDGE_SCRIPT_DIR + 'bridge.js').toString();
	Global_evaluateProgram(undefined, [ text, 'bridge/bridge.js' ]);

	var bridge_list = [ 'process', 'fs', 'uv', 'os', 'http_parser', 'crypto',//
	'tcp_wrap', 'udp_wrap', 'tty_wrap', 'timer_wrap', 'pipe_wrap', 'cares_wrap',//
	'stream_wrap', 'signal_wrap', 'fs_event_wrap' ];
	for (var i = 0; i < bridge_list.length; i++) {
		var n = bridge_list[i];
		var text = fs.readFileSync(BRIDGE_SCRIPT_DIR + n + '.js').toString();
		text = "(function(){" + text + "})();";
		Global_evaluateProgram(undefined, [ text, 'bridge/' + n + '.js' ]);
	}

	var _process = Global_eval(undefined, [ "process" ]);
	_process.Put('execPath', process.execPath, false);
	_process.Put('platform', process.platform, false);
	_process.Put('arch', process.arch, false);

	var _process_argv = Global_eval(undefined, [ "process.argv" ]);
	for (var i = 3; i < process.argv.length; i++) {
		_process_argv.Put(String(i - 2), process.argv[i], false);
	}

	var _process_env = Global_eval(undefined, [ "process.env" ]);
	_process_env.Put('HOME', process.env['HOME'], false);
	_process_env.Put('NODE_PATH', process.env['NODE_PATH'], false);
	_process_env.Put('PATH', process.env['PATH'], false);
	_process_env.Put('NODE_DEBUG', process.env['PERSHA_DEBUG'], false);

	var _natives = Global_eval(undefined, [ "process.binding('natives')" ]);
	var natives_list = [ 'events', 'constants', 'module', 'buffer', 'smalloc', 'util', 'assert',//
	'vm', 'timers', 'stream', 'console', 'fs', 'path', 'net', 'repl', 'readline', 'domain',//
	'string_decoder', '_stream_readable', '_stream_writable', '_stream_duplex', '_stream_transform',//
	'_stream_passthrough', 'http', '_http_agent', '_http_client', '_http_common', '_http_incoming',//
	'_http_outgoing', '_http_server', 'freelist', '_linklist', 'url', 'punycode', 'querystring',//
	'dns', 'dgram', 'tty', 'crypto', 'cluster', 'os' ];
	for (var i = 0; i < natives_list.length; i++) {
		var n = natives_list[i];
		var text = fs.readFileSync(NODE_INIT_SCRIPT_DIR + n + '.js').toString();
		_natives.Put(n, text, false);
	}

	var _constants = Global_eval(undefined, [ "process.binding('constants')" ]);
	var constants = process.binding('constants');
	for ( var P in constants) {
		if (isPrimitiveValue(constants[P])) {
			_constants.Put(P, constants[P], false);
		}
	}

	var _uv = Global_eval(undefined, [ "process.binding('uv')" ]);
	var uv = process.binding('uv');
	for ( var P in uv) {
		if (isPrimitiveValue(uv[P])) {
			_uv.Put(P, uv[P], false);
		}
	}

	var _HTTPParser = Global_eval(undefined, [ "process.binding('http_parser').HTTPParser" ]);
	var HTTPParser = process.binding('http_parser').HTTPParser;
	for ( var P in HTTPParser) {
		if (isPrimitiveValue(HTTPParser[P])) {
			_HTTPParser.Put(P, HTTPParser[P], false);
		}
	}
	for ( var P in HTTPParser.methods) {
		if (isPrimitiveValue(HTTPParser.methods[P])) {
			_HTTPParser.Get('methods').Put(P, HTTPParser.methods[P], false);
		}
	}

	var _cares = Global_eval(undefined, [ "process.binding('cares_wrap')" ]);
	var cares = process.binding('cares_wrap');
	for ( var P in cares) {
		if (isPrimitiveValue(cares[P])) {
			_cares.Put(P, cares[P], false);
		}
	}

	var text = fs.readFileSync(NODE_INIT_SCRIPT_DIR + 'node.js').toString();
	//Journal_init();
	consensus_evaluate(text, 'node.js');

} catch (e) {
	if (isInternalError(e)) {
		console.error("FATAL: " + e.stack);
	}
	else {
		if (Type(e) === TYPE_Object && e.HasProperty('stack')) {
			console.error("FATAL: " + e.Get('stack'));
		}
		else {
			console.error("FATAL: " + ToString(e));
		}
	}
	process.reallyExit(1);
}
