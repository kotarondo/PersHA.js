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

module.exports = {
	open : open,
};

function open(name, args, callback) {
	if (name === 'HTTPParser') {
		return new HTTPParserPort(args, callback);
	}
	console.log("[unhandled] http_parser open: " + name);
}

function HTTPParserPort(args, callback) {
	var HTTPParser = process.binding('http_parser').HTTPParser;
	var kOnHeaders = HTTPParser.kOnHeaders;
	var kOnHeadersComplete = HTTPParser.kOnHeadersComplete;
	var kOnBody = HTTPParser.kOnBody;
	var kOnMessageComplete = HTTPParser.kOnMessageComplete;

	var parser = new HTTPParser(args[0]);

	parser[kOnHeaders] = function() {
		callback(kOnHeaders, arguments);
	};
	parser[kOnHeadersComplete] = function() {
		callback(kOnHeadersComplete, arguments);
	};
	parser[kOnBody] = function() {
		callback(kOnBody, arguments);
	};
	parser[kOnMessageComplete] = function() {
		callback(kOnMessageComplete, arguments);
	};

	this.syncIO = function(name, args) {
		if (name === 'close') {
			return parser.close();
		}
		if (name === 'execute') {
			return parser.execute(args[0]);
		}
		if (name === 'finish') {
			return parser.finish();
		}
		if (name === 'reinitialize') {
			return parser.reinitialize(args[0]);
		}
		if (name === 'pause') {
			return parser.pause();
		}
		if (name === 'resume') {
			return parser.resume();
		}
		console.log("[unhandled] HTTPParser syncIO: " + name);
	};
}
