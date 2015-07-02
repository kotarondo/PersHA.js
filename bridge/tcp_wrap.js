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

var tcp = process.binding('tcp_wrap');
var tcpPort = new IOPort('tcp_wrap');

tcp.TCPConnectWrap = function() {
};

tcp.TCP = function() {
	var self = this;
	var port = tcpPort.open('TCP', arguments, portEventCallback);
	self._port = port;

	function portEventCallback(name, args) {
		_debug("binding[tcp] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
};

tcp.TCP.prototype.connect = function(req, address, port) {
	var self = this;
	self._port.asyncIO('connect', [ address, port ], function(status, readable, writable) {
		if (status instanceof IOPortError) {
			req.oncomplete(-1); //TODO
			return;
		}
		req.oncomplete(status, self, req, readable, writable);
	});
};

tcp.TCP.prototype.readStart = function() {
	var self = this;
	self._port.syncIO('readStart', arguments);
};

tcp.TCP.prototype.writeBinaryString = function(req, data) {
	var self = this;
	self._port.asyncIO('writeBinaryString', data, function(status, err) {
		if (status instanceof IOPortError) {
			return; //TODO
		}
		req.oncomplete(status, self, req, err);
	});
};

tcp.TCP.prototype.close = function(callback) {
	var self = this;
	if (callback === undefined) {
		self._port.syncIO('close');
	}
	else {
		self._port.asyncIO('close', null, callback);
	}
};