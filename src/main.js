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

var PERSHA_HOME;
var PERSHA_DB;
var JOURNAL_FILEBASE;
var NODE_INIT_SCRIPT_DIR;
var BRIDGE_SCRIPT_DIR;
var HANDLER_SCRIPT_DIR;

(function() {
	var path = require('path');
	var fs = require('fs');

	function print_usage() {
		console.log("Usage:");
		console.log("    persha -initdb [directory]");
		console.log("    persha -startup [directory]");
		console.log("  where omitted directory can be specified by the environment ");
		console.log("  variable PERSHA_DB which defaults to $HOME/.persha");
	}

	var cmd = process.argv[2];
	switch (cmd) {
	case '-initdb':
	case '-startup':
		PERSHA_DB = process.argv[3];
		break;
	default:
		print_usage();
		process.exit(1);
	}

	if (typeof PERSHA_DB !== "string" || PERSHA_DB === "") {
		PERSHA_DB = process.env.PERSHA_DB;
		if (typeof PERSHA_DB !== "string" || PERSHA_DB === "") {
			PERSHA_DB = process.env.HOME + "/.persha";
		}
	}
	JOURNAL_FILEBASE = path.normalize(PERSHA_DB + "/journal");
	PERSHA_DB = path.dirname(JOURNAL_FILEBASE);
	if (PERSHA_DB[0] !== '/') {
		console.log("ERROR: PERSHA_DB must be absolute path: " + PERSHA_DB);
		process.exit(1);
	}
	PERSHA_HOME = path.dirname(path.dirname(process.argv[1]));
	NODE_INIT_SCRIPT_DIR = PERSHA_HOME + "/node-init/";
	BRIDGE_SCRIPT_DIR = PERSHA_HOME + "/bridge/";
	HANDLER_SCRIPT_DIR = PERSHA_HOME + "/handler/";
	//console.log("PERSHA_DB: " + PERSHA_DB);
	//console.log("PERSHA_HOME: " + PERSHA_HOME);

	if (cmd === '-initdb') {
		if (fs.existsSync(PERSHA_DB)) {
			console.log("ERROR: already exists: " + PERSHA_DB);
			process.exit(1);
		}
		try {
			fs.mkdirSync(PERSHA_DB);
		} catch (e) {
			console.log("ERROR: cannot create directory: " + PERSHA_DB);
			process.exit(1);
		}
		persha_initdb();
	}

	if (cmd === '-startup') {
		if (!fs.existsSync(PERSHA_DB)) {
			console.log("ERROR: does not exist: " + PERSHA_DB);
			process.exit(1);
		}
		if (!Journal_start()) {
			console.log("ERROR: invalid: " + PERSHA_DB);
			process.exit(1);
		}

		/* hacking
		Global_eval(undefined, [ "_debug" ]).Call = function(thisValue, argumentsList) {
			console.log(argumentsList);
		};
		*/

		IOManager_start();
	}

})();