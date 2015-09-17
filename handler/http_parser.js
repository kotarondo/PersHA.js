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

var binding = process.binding('http_parser');
var kOnBody = binding.HTTPParser.kOnBody;
var kOnHeaders = binding.HTTPParser.kOnHeaders;
var kOnHeadersComplete = binding.HTTPParser.kOnHeadersComplete;
var kOnMessageComplete = binding.HTTPParser.kOnMessageComplete;

module.exports = {
	open : open,
};

function open(name, callback) {
	if (name === 'HTTPParser') {
		return new HTTPParserPort(callback);
	}
	console.log("[unhandled] http_parser open: " + name);
}

function HTTPParserPort(callback) {
	var parser;

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			parser = new binding.HTTPParser(args[0]);
			parser[kOnHeaders] = function() {
				var args = Array.prototype.slice.call(arguments);
				callback(kOnHeaders, args);
			};
			parser[kOnHeadersComplete] = function() {
				var args = Array.prototype.slice.call(arguments);
				callback(kOnHeadersComplete, args);
			};
			parser[kOnBody] = function() {
				var args = Array.prototype.slice.call(arguments);
				callback(kOnBody, args);
			};
			parser[kOnMessageComplete] = function() {
				var args = Array.prototype.slice.call(arguments);
				callback(kOnMessageComplete, args);
			};
			return;
		}
		return parser[func].apply(parser, args);
	};
}
