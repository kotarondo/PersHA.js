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

'use strict';

var binding = process.binding('http_parser');
var parserPort = new IOPort('http_parser');

binding.HTTPParser = HTTPParser;

function HTTPParser() {
	var self = this;
	self._port = parserPort.open('HTTPParser', arguments, portEventCallback);

	function portEventCallback(name, args) {
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
}

HTTPParser.prototype.close = function() {
	var self = this;
	self._port.syncIO('close', arguments);
	self._port.close();
};

HTTPParser.prototype.execute = function() {
	var self = this;
	return self._port.syncIO('execute', arguments);
};

HTTPParser.prototype.finish = function() {
	var self = this;
	return self._port.syncIO('finish', arguments);
};

HTTPParser.prototype.reinitialize = function() {
	var self = this;
	try {
		return self._port.syncIO('reinitialize', arguments);
	} catch (e) {
		self._port.rebind();
	}
};

HTTPParser.prototype.pause = function() {
	var self = this;
	return self._port.syncIO('pause', arguments);
};

HTTPParser.prototype.resume = function() {
	var self = this;
	return self._port.syncIO('resume', arguments);
};

HTTPParser.methods = [];
